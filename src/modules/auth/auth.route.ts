import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  changePasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  sendVerificationEmailController,
  verifyEmailController,
} from "./auth.controller";
import {
  changePasswordSchema,
  loginValidationSchema,
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

export default authRouter;
