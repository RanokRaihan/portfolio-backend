import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import { createProjectController } from "./project.controller";
import { createProjectSchema } from "./project.validation";

const projectRouter = Router();

projectRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createProjectSchema),
  createProjectController,
);

export default projectRouter;
