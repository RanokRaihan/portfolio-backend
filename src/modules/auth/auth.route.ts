import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import {
  changePasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from "./auth.controller";
import { changePasswordSchema, loginValidationSchema } from "./auth.validation";

const authRouter = Router();

// login user
authRouter.post(
  "/login",
  validateRequest(loginValidationSchema),
  loginUserController
);
authRouter.post("/logout", logoutUserController);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.put(
  "/change-password",
  validateRequest(changePasswordSchema),
  changePasswordController
);

export default authRouter;
