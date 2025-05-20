import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import { createUserController } from "./user.controller";
import { createUserSchema } from "./user.validation";

const userRouter = Router();

// user routes

userRouter.post(
  "/register",
  auth,
  authorize(["admin"]),
  validateRequest(createUserSchema),
  createUserController
);

export default userRouter;
