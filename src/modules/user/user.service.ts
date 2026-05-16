import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import QueryBuilder from "../../builder/queryBuilder";
import { IMeta } from "../../interface/global.interface";
import { IUser } from "./user.interface";
import User from "./user.model";

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

export const seedSuperAdminService = async () => {
  const { name, email, password } = config.superAdmin;
  if (!name || !email || !password) {
    throw new ApiError(
      500,
      "Super admin credentials are not configured. Set SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD in .env",
      "seedSuperAdmin",
    );
  }

  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    throw new ApiError(409, " admin already exists", "seedSuperAdmin");
  }

  const user = await User.create({ name, email, password, role: "admin" });
  return { _id: user._id, name: user.name, email: user.email, role: user.role };
};

//create a user with the given data
export const createUserService = async (data: IUser) => {
  try {
    const user = await User.create(data);
    if (!user?._id) {
      throw new ApiError(500, "Failed to create user", "userCreation");
    }
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new ApiError(500, "Failed to create user", "userCreation");
  }
};
