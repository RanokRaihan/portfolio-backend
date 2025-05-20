import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { TUserRole } from "../modules/auth/auth.interface";
import { asyncHandler } from "../utils/asyncHandler";

export const authorize = (roles: TUserRole[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user) {
        console.log("User not found");

        throw new ApiError(401, "You are not authorized !");
      }
      if (!roles.includes(user.role)) {
        throw new ApiError(401, " You are not authorized !");
      }
      next();
    }
  );
};
