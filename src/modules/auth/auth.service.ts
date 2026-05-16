import crypto from "crypto";
import { Resend } from "resend";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import { verificationEmailTemplate } from "../../utils/emailTemplates";
import User from "../user/user.model";

const resend = new Resend(config.resend.apiKey);

export const sendVerificationEmailService = async (
  email: string,
  userId: string,
) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new ApiError(
      404,
      "No account found with this email",
      "sendVerificationEmail",
    );
  }
  if (user._id.toString() !== userId) {
    throw new ApiError(
      403,
      "You can only send verification email for your own account",
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

  user.emailVerificationToken = token;
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

export const verifyEmailService = async (token: string) => {
  const user = await User.findOne({
    emailVerificationToken: token,
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
