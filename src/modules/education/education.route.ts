import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createEducationController,
  getAllEducationController,
  softDeleteEducationController,
  updateEducationController,
} from "./education.controller";
import { createEducationSchema, updateEducationSchema } from "./education.validation";

const educationRouter = Router();

// Public routes
educationRouter.get("/", getAllEducationController);

// Protected routes
educationRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createEducationSchema),
  createEducationController,
);

educationRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateEducationSchema),
  updateEducationController,
);

educationRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  softDeleteEducationController,
);

export default educationRouter;
