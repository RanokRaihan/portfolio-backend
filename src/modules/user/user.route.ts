import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { createUserController } from "./user.controller";
import { createUserSchema } from "./user.validation";

const userRouter = Router();

// user routes

userRouter.post(
  "/register",
  validateRequest(createUserSchema),
  createUserController
);

export default userRouter;
