import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import ApiError from "../../errors/ApiError";
import validateRequest from "../../middleware/validateRequest";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getMeController,
  getUserByIdController,
  seedSuperAdminController,
  updateAvatarController,
  updateUserController,
  updateUserRoleController,
  updateUserStatusController,
} from "./user.controller";
import {
  createUserSchema,
  seedSuperAdminSchema,
  updateAvatarSchema,
  updateUserRoleSchema,
  updateUserSchema,
  updateUserStatusSchema,
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
  (req, _res, next) => {
    const secret = process.env.SEED_SECRET;
    if (!secret || req.headers["x-seed-secret"] !== secret) {
      return next(new ApiError(403, "Forbidden", "seedSuperAdmin"));
    }
    next();
  },
  validateRequest(seedSuperAdminSchema),
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

userRouter.get("/me", auth, getMeController);

userRouter.get("/:id", auth, authorize(["admin", "moderator"]), getUserByIdController);

userRouter.patch(
  "/:id/status",
  auth,
  authorize(["admin"]),
  validateRequest(updateUserStatusSchema),
  updateUserStatusController,
);

userRouter.patch(
  "/:id/role",
  auth,
  authorize(["admin"]),
  validateRequest(updateUserRoleSchema),
  updateUserRoleController,
);

userRouter.delete("/:id", auth, authorize(["admin"]), deleteUserController);

export default userRouter;
