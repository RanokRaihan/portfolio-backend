import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  findUserWithEmailService,
  getAllUsersService,
  seedSuperAdminService,
} from "./user.service";

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllUsersService(
      req.query as Record<string, unknown>
    );
    sendResponse(res, 200, "Users fetched successfully!", data, meta);
  }
);

export const seedSuperAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await seedSuperAdminService();
    sendResponse(res, 201, "Super admin seeded successfully!", data);
  }
);

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
