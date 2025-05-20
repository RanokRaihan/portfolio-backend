import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { createUserService, findUserWithEmailService } from "./user.service";

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    // get the user data from the request body
    const { name, email, password } = req.body;

    //check the user already exists
    const existingUser = await findUserWithEmailService(email);
    // if exists, send error response
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email!", "email");
    }

    // else, create the user with authService
    const user = await createUserService({ name, email, password });

    //throw error if user is not created
    if (!user?._id) {
      throw new ApiError(500, "Failed to create user");
    }
    //create a response data without password
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    // send success response
    sendResponse(res, 201, "User registered successfully!", responseData);
  }
);
