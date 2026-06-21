import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import { resend } from "../../lib/resend";
import { createToken } from "../../utils/createToken";
import {
  resetPasswordEmailTemplate,
  verificationEmailTemplate,
} from "../../utils/emailTemplates";
import User from "../user/user.model";
import { IjwtPayload, TUserRole } from "./auth.interface";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const refreshAuthTokenService = async (token: string) => {
  const { accessSecret, refreshSecret } = config.jwt;
  let decoded: IjwtPayload;
  try {
    decoded = jwt.verify(token, refreshSecret) as IjwtPayload;
  } catch {
    throw new ApiError(401, "Invalid refresh token", "AUTHENTICATION_ERROR");
  }

  if (!decoded._id) {
    throw new ApiError(401, "Invalid refresh token", "AUTHENTICATION_ERROR");
  }

  const user = await User.findOne({ _id: decoded._id, isDeleted: false });

  if (!user) {
    throw new ApiError(404, "User not found", "NOT_FOUND");
  }

  const freshPayload: IjwtPayload = {
    name: user.name,
    _id: user._id as string,
    email: user.email,
    role: user.role as TUserRole,
    needPasswordChange: user.needPasswordChange ?? false,
    emailVerified: user.emailVerified ?? false,
  };
  const newAccessToken = createToken(
    freshPayload,
    config.jwt.accessSecret as string,
    config.jwt.accessExpiresIn as SignOptions["expiresIn"],
  );
  const newRefreshToken = createToken(
    freshPayload,
    config.jwt.refreshSecret as string,
    config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
  );
  return {
    userId: user._id,
    newAccessToken,
    newRefreshToken,
  };
};
const storeRefreshTokenService = async (userId: string, token: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: hashToken(token) });
};

const clearRefreshTokenService = async (email: string) => {
  await User.findOneAndUpdate({ email }, { $unset: { refreshToken: "" } });
};

const sendVerificationEmailService = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new ApiError(
      404,
      "No account found with this email",
      "sendVerificationEmail",
    );
  }
  if (user.emailVerified) {
    throw new ApiError(
      400,
      "Email is already verified",
      "sendVerificationEmail",
    );
  }
  if (user.emailVerificationTokenExpires) {
    const timeSinceLastEmail =
      Date.now() -
      (user.emailVerificationTokenExpires.getTime() - 15 * 60 * 1000);
    if (timeSinceLastEmail < 5 * 60 * 1000) {
      const remainingSeconds = Math.ceil(
        (5 * 60 * 1000 - timeSinceLastEmail) / 1000,
      );
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      throw new ApiError(
        400,
        `Please wait ${minutes}m ${seconds}s before requesting a new verification email.`,
        "sendVerificationEmail",
      );
    }
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.emailVerificationToken = hashToken(token);
  user.emailVerificationTokenExpires = expires;
  await user.save();

  const verificationUrl = `${config.appUrl.frontendUrl}/verify-email?token=${token}`;
  const html = verificationEmailTemplate(user.name, verificationUrl);

  const { error } = await resend.emails.send({
    from: config.resend.fromEmail,
    to: user.email,
    subject: "Verify your email address",
    html,
  });

  if (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    throw new ApiError(
      500,
      "Failed to send verification email",
      "sendVerificationEmail",
    );
  }
};

const verifyEmailService = async (token: string) => {
  const user = await User.findOne({
    emailVerificationToken: hashToken(token),
    emailVerificationTokenExpires: { $gt: new Date() },
    isDeleted: false,
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired verification token",
      "verifyEmail",
    );
  }

  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();
};

const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false, isActive: true });
  if (!user) {
    throw new ApiError(
      404,
      "No active account found with this email",
      "forgotPassword",
    );
  }

  if (user.passwordResetTokenExpires) {
    const timeSinceLastRequest =
      Date.now() - (user.passwordResetTokenExpires.getTime() - 15 * 60 * 1000);
    if (timeSinceLastRequest < 5 * 60 * 1000) {
      const remainingSeconds = Math.ceil(
        (5 * 60 * 1000 - timeSinceLastRequest) / 1000,
      );
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      throw new ApiError(
        429,
        `Please wait ${minutes}m ${seconds}s before requesting another reset email.`,
        "forgotPassword",
      );
    }
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  user.passwordResetToken = hashToken(token);
  user.passwordResetTokenExpires = expires;
  await user.save();

  const resetUrl = `${config.appUrl.frontendUrl}/reset-password?token=${token}`;
  const html = resetPasswordEmailTemplate(user.name, resetUrl);

  const { error } = await resend.emails.send({
    from: config.resend.fromEmail,
    to: user.email,
    subject: "Reset your password",
    html,
  });

  if (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    throw new ApiError(
      500,
      "Failed to send reset email. Please try again.",
      "forgotPassword",
    );
  }
};

const resetPasswordService = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetTokenExpires: { $gt: new Date() },
    isDeleted: false,
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired password reset token",
      "resetPassword",
    );
  }

  user.password = newPassword;
  user.needPasswordChange = false;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
};

export {
  clearRefreshTokenService,
  forgotPasswordService,
  refreshAuthTokenService,
  resetPasswordService,
  sendVerificationEmailService,
  storeRefreshTokenService,
  verifyEmailService,
};
