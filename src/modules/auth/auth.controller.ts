import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { createToken } from "../../utils/createToken";
import { sendResponse } from "../../utils/sendResponse";
import { parseExpiryToMs } from "../../utils/time";
import { findUserWithEmailService } from "../user/user.service";
import { SignOptions } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { IjwtPayload, LoggedinUser, TUserRole } from "./auth.interface";
import {
  clearRefreshTokenService,
  forgotPasswordService,
  refreshAuthTokenService,
  resetPasswordService,
  sendVerificationEmailService,
  storeRefreshTokenService,
  verifyEmailService,
} from "./auth.service";

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // check the email and password
    const user = await findUserWithEmailService(email);

    // if not valid, throw error
    if (!user) {
      throw new ApiError(401, "Invalid credentials", "login");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid credentials", "login");
    }

    // else, create a token and send the token as response
    const jwtPayload: IjwtPayload = {
      name: user.name,
      _id: user._id,
      email: user.email,
      role: user.role as TUserRole,
      needPasswordChange: user.needPasswordChange ?? false,
      emailVerified: user.emailVerified ?? false,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt.accessSecret as string,
      config.jwt.accessExpiresIn as SignOptions["expiresIn"],
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt.refreshSecret as string,
      config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
    );
    res.cookie("refreshToken", refreshToken, {
      secure: config.nodeEnv === "production",
      httpOnly: true,
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
      path: "/",
    });

    await storeRefreshTokenService(user._id as string, refreshToken);

    sendResponse(res, 200, "Login successful", {
      accessToken,
      refreshToken,
      needPasswordChange: user.needPasswordChange ?? false,
    });
  },
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await findUserWithEmailService(req.user.email);
    if (!user) {
      throw new ApiError(401, "User not found", "changePassword");
    }
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid credentials", "changePassword");
    }
    const wasFirstLogin = user.needPasswordChange && !user.emailVerified;
    user.password = newPassword;
    user.needPasswordChange = false;
    if (wasFirstLogin) {
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
    }
    await user.save();
    sendResponse(res, 200, "Password changed successfully", null);
  },
);

export const logoutUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req?.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(
          token,
          config.jwt.refreshSecret as string,
        ) as IjwtPayload;
        await clearRefreshTokenService(payload.email);
      } catch {
        // token invalid/expired — still clear the cookie
      }
    }
    res.clearCookie("refreshToken");
    sendResponse(res, 200, "Logged out successfully", null);
  },
);

export const sendVerificationEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    await sendVerificationEmailService(req.user.email);
    sendResponse(res, 200, "Verification email sent successfully", null);
  },
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body;
    await verifyEmailService(token);
    sendResponse(res, 200, "Email verified successfully", null);
  },
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await forgotPasswordService(email);
    sendResponse(res, 200, "Password reset email sent successfully", null);
  },
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    sendResponse(res, 200, "Password reset successfully", null);
  },
);

export const currentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id, email, name, role, needPasswordChange, emailVerified } =
      req.user as IjwtPayload;
    const currentUser: LoggedinUser = {
      _id,
      email,
      name,
      role: role as string,
      needPasswordChange,
      emailVerified,
    };
    sendResponse(res, 200, "Current user retrieved successfully", currentUser);
  },
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract refresh token from cookies

    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(
        401,
        "Refresh token not provided",
        "AUTHENTICATION_ERROR",
      );
    }

    const { newAccessToken, newRefreshToken, userId } =
      await refreshAuthTokenService(refreshToken);
    await storeRefreshTokenService(userId as string, newRefreshToken);

    // Set new refresh token as httpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseExpiryToMs(config.jwt.refreshExpiresIn),
    });

    sendResponse(res, 200, "Token refreshed", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  },
);
