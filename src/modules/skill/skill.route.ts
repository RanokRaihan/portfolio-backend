import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createSkillController,
  getAllSkillsController,
  getFeaturedSkillsController,
  getSkillByIdController,
  getSkillsByCategoryController,
  updateSkillController,
} from "./skill.controller";
import { skillValidationSchema } from "./skill.validation";

const router = Router();

// Public routes - accessible to everyone
router.get("/", getAllSkillsController);
router.get("/featured", getFeaturedSkillsController);
router.get("/category/:category", getSkillsByCategoryController);
router.get("/:id", getSkillByIdController);

// Protected routes - only accessible to authenticated users
router.post(
  "/",
  auth,
  authorize(["admin"]),
  validateRequest(skillValidationSchema),
  createSkillController
);

//get all skills
router.get("/", getAllSkillsController);

router.patch(
  "/:id",
  auth,
  authorize(["admin"]),
  validateRequest(skillValidationSchema),
  updateSkillController
);

export default router;
