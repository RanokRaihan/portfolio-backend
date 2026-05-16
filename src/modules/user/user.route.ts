import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createUserController,
  getAllUsersController,
  seedSuperAdminController,
  updateAvatarController,
  updateUserController,
} from "./user.controller";
import {
  createUserSchema,
  updateAvatarSchema,
  updateUserSchema,
} from "./user.validation";

const userRouter = Router();

// user routes

userRouter.get(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  getAllUsersController,
);

userRouter.post(
  "/seed-super-admin",
  validateRequest(createUserSchema),
  seedSuperAdminController,
);

userRouter.post(
  "/create-user",
  auth,
  authorize(["admin"]),
  validateRequest(createUserSchema),
  createUserController,
);

userRouter.patch(
  "/me",
  auth,
  validateRequest(updateUserSchema),
  updateUserController,
);

userRouter.patch(
  "/me/avatar",
  auth,
  validateRequest(updateAvatarSchema),
  updateAvatarController,
);

export default userRouter;
