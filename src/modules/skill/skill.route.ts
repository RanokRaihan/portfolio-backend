import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import bodyParser from "../../middleware/bodyParser.middleware";
import validateRequest from "../../middleware/validateRequest";
import { upload } from "../../utils/handleImageUpload";
import {
  createSkillController,
  deleteSkillController,
  getAllSkillsController,
  getAllSkillsWithFilterController,
  getFeaturedSkillsController,
  getSkillByIdController,
  getSkillsByCategoryController,
  updateSkillController,
} from "./skill.controller";
import { skillValidationSchema } from "./skill.validation";

const router = Router();

// Public routes - accessible to everyone
router.get("/", getAllSkillsController);
router.get("/paginate", getAllSkillsWithFilterController);

router.get("/featured", getFeaturedSkillsController);
router.get("/category/:category", getSkillsByCategoryController);
router.get("/:id", getSkillByIdController);

// Protected routes - only accessible to authenticated users

router.post(
  "/",
  auth,
  authorize(["admin"]),
  upload.single("image"),
  bodyParser,
  validateRequest(skillValidationSchema),
  createSkillController
);

router.patch(
  "/:id",
  auth,
  authorize(["admin"]),
  validateRequest(skillValidationSchema),
  updateSkillController
);
router.delete("/:id", auth, authorize(["admin"]), deleteSkillController);

export default router;
