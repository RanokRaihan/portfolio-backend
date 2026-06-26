import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createSettingController,
  getSettingAdminController,
  getSettingPublicController,
  updateSettingController,
} from "./setting.controller";
import { createSettingSchema, updateSettingSchema } from "./setting.validation";

const settingRouter = Router();

// Public route
settingRouter.get("/", getSettingPublicController);

// Admin routes
settingRouter.get("/admin", auth, authorize(["admin"]), getSettingAdminController);

settingRouter.post(
  "/",
  auth,
  authorize(["admin"]),
  validateRequest(createSettingSchema),
  createSettingController,
);

settingRouter.patch(
  "/",
  auth,
  authorize(["admin"]),
  validateRequest(updateSettingSchema),
  updateSettingController,
);

export default settingRouter;
