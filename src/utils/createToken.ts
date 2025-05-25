import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import { IjwtPayload } from "../modules/auth/auth.interface";

export const createToken = (
  jwtPayload: IjwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  try {
    return jwt.sign(jwtPayload, secret, { expiresIn });
  } catch (error) {
    // console.log("error", error);
    throw new ApiError(
      500,
      `Token creation failed: ${(error as Error).message}`
    );
  }
};
