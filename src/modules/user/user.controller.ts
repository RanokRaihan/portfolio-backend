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
    const { name, email, password, dateOfBirth, gender, address, phone } =
      req.body;
    const data = await seedSuperAdminService({
      name,
      email,
      password,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      phone,
    });
    sendResponse(res, 201, "Super admin seeded successfully!", data);
  },
);

export const createUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, dateOfBirth, gender, address, phone } = req.body;

    const existingUser = await findUserWithEmailService(email);
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email!", "email");
    }

    const data = await createUserService({
      name,
      email,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      phone,
    });

    sendResponse(res, 201, "User created successfully!", data);
  },
);
