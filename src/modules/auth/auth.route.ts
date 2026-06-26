import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validateRequest";
import { createRateLimiter } from "../../utils/rateLimiter";
import {
  changePasswordController,
  currentUserController,
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

const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

authRouter.post(
  "/login",
  validateRequest(loginValidationSchema),
  loginUserController,
);
authRouter.get("/current-user", auth, currentUserController);
authRouter.post("/logout", logoutUserController);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.patch(
  "/change-password",
  auth,
  validateRequest(changePasswordSchema),
  changePasswordController,
);
authRouter.post(
  "/send-verification-email",
  auth,
  sendVerificationEmailController,
);
authRouter.post(
  "/verify-email",
  authRateLimiter,
  validateRequest(verifyEmailSchema),
  verifyEmailController,
);
authRouter.post(
  "/forgot-password",
  authRateLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPasswordController,
);
authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPasswordController,
);

export default authRouter;
