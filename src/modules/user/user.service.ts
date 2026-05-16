import crypto from "crypto";
import { Resend } from "resend";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import QueryBuilder from "../../builder/queryBuilder";
import { IMeta } from "../../interface/global.interface";
import { welcomeEmailTemplate } from "../../utils/emailTemplates";
import { IUser } from "./user.interface";
import User from "./user.model";

const resend = new Resend(config.resend.apiKey);

const generateTemporaryPassword = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.randomBytes(10))
    .map((b) => chars[b % chars.length])
    .join("");
};

export const findUserWithEmailService = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error finding user with email:", error);
    throw new ApiError(
      500,
      "Failed to find user with email",
      "findUserWithEmail",
    );
  }
};

export const getAllUsersService = async (
  query: Record<string, unknown>
): Promise<{ data: unknown[]; meta: IMeta }> => {
  const queryBuilder = new QueryBuilder(User.find(), query)
    .search(["name", "email"])
    .filter(["role"])
    .sort()
    .paginate();

  const data = await queryBuilder.modelQuery.select("-password");
  const meta = await queryBuilder.countTotal();
  return { data, meta };
};

export const seedSuperAdminService = async (data: IUser) => {
  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    throw new ApiError(409, "Admin already exists", "seedSuperAdmin");
  }

  const emailTaken = await User.findOne({ email: data.email });
  if (emailTaken) {
    throw new ApiError(409, "Email is already in use", "seedSuperAdmin");
  }

  const user = await User.create({ ...data, role: "admin" });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    address: user.address,
    phone: user.phone,
    role: user.role,
  };
};

export const updateAvatarService = async (userId: string, image: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { image },
    { new: true, runValidators: true },
  ).select("_id name email image");

  if (!user) {
    throw new ApiError(404, "User not found", "updateAvatar");
  }

  return user;
};

export const updateUserService = async (
  userId: string,
  data: Partial<Pick<IUser, "name" | "dateOfBirth" | "gender" | "address" | "phone">>,
) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select("_id name email dateOfBirth gender address phone role");

  if (!user) {
    throw new ApiError(404, "User not found", "updateUser");
  }

  return user;
};

export const createUserService = async (
  data: Omit<IUser, "password" | "role">,
) => {
  const temporaryPassword = generateTemporaryPassword();

  const user = await User.create({
    ...data,
    password: temporaryPassword,
    needPasswordChange: true,
  });

  const loginUrl = `${config.resetPassUiLink}/login`;
  const html = welcomeEmailTemplate(
    user.name,
    user.email,
    temporaryPassword,
    loginUrl,
  );

  const { error } = await resend.emails.send({
    from: config.resend.fromEmail,
    to: user.email,
    subject: "Your account has been created — login details inside",
    html,
  });

  if (error) {
    await User.findByIdAndDelete(user._id);
    throw new ApiError(
      500,
      "Failed to send welcome email. User creation rolled back.",
      "userCreation",
    );
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    address: user.address,
    phone: user.phone,
    role: user.role,
  };
};
