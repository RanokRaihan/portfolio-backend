import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { createToken } from "../../utils/createToken";
import { sendResponse } from "../../utils/sendResponse";
import { findUserWithEmailService } from "../user/user.service";
import { SignOptions } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { IjwtPayload, TUserRole } from "./auth.interface";

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

    // send the token as response
    sendResponse(res, 200, "Login successful", { accessToken, refreshToken });
  },
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword } = req.body;
    const user = await findUserWithEmailService(email);
    if (!user) {
      throw new ApiError(401, "user not found", "changePassword");
    }
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid credentials", "changePassword");
    }
    user.password = newPassword;
    await user.save();
    sendResponse(res, 200, "Password changed successfully", null);
  },
);

export const logoutUserController = asyncHandler(
  async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    sendResponse(res, 200, "Logged out successfully", null);
  },
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized", "refreshToken");
    }
    let payload: IjwtPayload;
    try {
      payload = (await jwt.verify(
        refreshToken,
        config.jwt.refreshSecret as string,
      )) as IjwtPayload;
    } catch (error) {
      throw new ApiError(401, "Unauthorized", "refreshToken");
    }
    const user = await findUserWithEmailService(payload.email);
    if (!user) {
      throw new ApiError(401, "Unauthorized", "refreshToken");
    }
    const accessToken = createToken(
      payload,
      config.jwt.accessSecret as string,
      config.jwt.accessExpiresIn as SignOptions["expiresIn"],
    );
    const newRefreshToken = createToken(
      payload,
      config.jwt.refreshSecret as string,
      config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
    );
    res.cookie("refreshToken", newRefreshToken, {
      secure: config.nodeEnv === "production",
      httpOnly: true,
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    sendResponse(res, 200, "Token refreshed", {
      accessToken,
      refreshToken: newRefreshToken,
    });
  },
);
