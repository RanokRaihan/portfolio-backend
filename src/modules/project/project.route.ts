import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import bodyParser from "../../middleware/bodyParser.middleware";
import validateRequest from "../../middleware/validateRequest";
import { upload } from "../../utils/handleImageUpload";
import {
  addProjectController,
  deleteProjectController,
  getAllProjectsController,
  getFeaturedProjectsController,
  getProjectByIdController,
  updateProjectController,
} from "./project.controller";
import { projectValidation } from "./project.validation";

const projectRouter = Router();

// Public routes
projectRouter.get("/", getAllProjectsController);
projectRouter.get("/featured", getFeaturedProjectsController);
projectRouter.get("/:id", getProjectByIdController);

// Protected routes
projectRouter.post(
  "/",
  auth,
  authorize(["admin"]),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  bodyParser,
  validateRequest(projectValidation),
  addProjectController
);

projectRouter.patch(
  "/:id",
  auth,
  authorize(["admin"]),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProjectController
);

projectRouter.delete(
  "/:id",
  auth,
  authorize(["admin"]),
  deleteProjectController
);

export default projectRouter;
