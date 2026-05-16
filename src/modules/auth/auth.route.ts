import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  changePasswordController,
  forgotPasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  resetPasswordController,
  sendVerificationEmailController,
  verifyEmailController,
} from "./auth.controller";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginValidationSchema,
  resetPasswordSchema,
  sendVerificationEmailSchema,
  verifyEmailSchema,
} from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/login",
  validateRequest(loginValidationSchema),
  loginUserController,
);
authRouter.post("/logout", logoutUserController);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.put(
  "/change-password",
  validateRequest(changePasswordSchema),
  changePasswordController,
);
authRouter.post(
  "/send-verification-email",
  auth,
  validateRequest(sendVerificationEmailSchema),
  sendVerificationEmailController,
);
authRouter.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  verifyEmailController,
);
authRouter.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPasswordController,
);
authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPasswordController,
);

export default authRouter;
