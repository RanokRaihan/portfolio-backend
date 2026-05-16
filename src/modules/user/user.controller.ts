import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  deleteUserService,
  findUserWithEmailService,
  getAllUsersService,
  getMeService,
  getUserByIdService,
  seedSuperAdminService,
  updateAvatarService,
  updateUserRoleService,
  updateUserService,
  updateUserStatusService,
} from "./user.service";

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getMeService(req.user._id);
    sendResponse(res, 200, "Profile fetched successfully!", data);
  },
);

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getUserByIdService(req.params.id);
    sendResponse(res, 200, "User fetched successfully!", data);
  },
);

export const updateUserStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await updateUserStatusService(req.params.id, req.body.isActive);
    sendResponse(res, 200, "User status updated successfully!", data);
  },
);

export const updateUserRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await updateUserRoleService(req.params.id, req.body.role);
    sendResponse(res, 200, "User role updated successfully!", data);
  },
);

export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await deleteUserService(req.params.id);
    sendResponse(res, 200, "User deleted successfully!", data);
  },
);

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

export const updateAvatarController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await updateAvatarService(req.user._id, req.body.image);
    sendResponse(res, 200, "Avatar updated successfully!", data);
  },
);

export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { name, dateOfBirth, gender, address, phone } = req.body;

    const payload: Record<string, unknown> = {};
    if (name !== undefined) payload.name = name;
    if (dateOfBirth !== undefined) payload.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) payload.gender = gender;
    if (address !== undefined) payload.address = address;
    if (phone !== undefined) payload.phone = phone;

    const data = await updateUserService(userId, payload);
    sendResponse(res, 200, "Profile updated successfully!", data);
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
