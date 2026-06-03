import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  changeProjectStatusController,
  createProjectController,
  getAllManagedProjectsController,
  getAllPublicProjectsController,
  getManagedProjectByIdController,
  getPublicProjectByIdController,
  getPublicProjectBySlugController,
  softDeleteProjectController,
  updateProjectController,
} from "./project.controller";
import {
  changeProjectStatusSchema,
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation";

const projectRouter = Router();

// Protected routes — registered before /:id to avoid param capture
projectRouter.get(
  "/manage",
  auth,
  authorize(["admin", "moderator"]),
  getAllManagedProjectsController,
);

projectRouter.get(
  "/manage/:id",
  auth,
  authorize(["admin", "moderator"]),
  getManagedProjectByIdController,
);

projectRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createProjectSchema),
  createProjectController,
);

projectRouter.patch(
  "/:id/status",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(changeProjectStatusSchema),
  changeProjectStatusController,
);

projectRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateProjectSchema),
  updateProjectController,
);

projectRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  softDeleteProjectController,
);

// Public routes
projectRouter.get("/", getAllPublicProjectsController);
projectRouter.get("/slug/:slug", getPublicProjectBySlugController);
projectRouter.get("/:id", getPublicProjectByIdController);

export default projectRouter;
