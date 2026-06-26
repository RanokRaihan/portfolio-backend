import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";

export const verifySeedSecret = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const secret = config.seedSecret;
  if (!secret || req.headers["x-seed-secret"] !== secret) {
    return next(new ApiError(403, "Forbidden", "seedSuperAdmin"));
  }
  next();
};
