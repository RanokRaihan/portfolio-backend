import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createUserController,
  getAllUsersController,
  seedSuperAdminController,
} from "./user.controller";
import { createUserSchema } from "./user.validation";

const userRouter = Router();

// user routes

userRouter.get(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  getAllUsersController,
);

userRouter.post("/seed-super-admin", seedSuperAdminController);

userRouter.post(
  "/create-user",
  auth,
  authorize(["admin"]),
  validateRequest(createUserSchema),
  createUserController,
);

export default userRouter;
