import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createCertificationController,
  getCertificationByIdController,
  getAllCertificationsController,
  softDeleteCertificationController,
  updateCertificationController,
} from "./certification.controller";
import { createCertificationSchema, updateCertificationSchema } from "./certification.validation";

const certificationRouter = Router();

// Public routes
certificationRouter.get("/", getAllCertificationsController);
certificationRouter.get("/:id", getCertificationByIdController);

// Protected routes
certificationRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createCertificationSchema),
  createCertificationController,
);

certificationRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateCertificationSchema),
  updateCertificationController,
);

certificationRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  softDeleteCertificationController,
);

export default certificationRouter;
