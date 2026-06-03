import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createSkillController,
  deleteSkillController,
  getAllPublicSkillsController,
  getSkillByIdController,
  updateSkillController,
} from "./skill.controller";
import { createSkillSchema, updateSkillSchema } from "./skill.validation";

const skillRouter = Router();

// Protected routes
skillRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createSkillSchema),
  createSkillController,
);

skillRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateSkillSchema),
  updateSkillController,
);

skillRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  deleteSkillController,
);

// Public routes
skillRouter.get("/", getAllPublicSkillsController);
skillRouter.get("/:id", getSkillByIdController);

export default skillRouter;
