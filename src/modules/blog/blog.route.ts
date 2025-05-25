import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import bodyParser from "../../middleware/bodyParser.middleware";
import validateRequest from "../../middleware/validateRequest";
import { upload } from "../../utils/handleImageUpload";
import {
  createBlogController,
  deleteBlogController,
  getAllBlogsController,
  getBlogByIdController,
  getBlogsByCategoryController,
  getBlogsByTagController,
  getFeaturedBlogsController,
  updateBlogController,
} from "./blog.controller";
import { blogUpdateValidation, blogValidation } from "./blog.validation";

const blogRouter = Router();

// Public routes
blogRouter.get("/", getAllBlogsController);
blogRouter.get("/featured", getFeaturedBlogsController);
blogRouter.get("/category/:category", getBlogsByCategoryController);
blogRouter.get("/tag/:tag", getBlogsByTagController);
blogRouter.get("/:id", getBlogByIdController);

// Protected routes
blogRouter.post(
  "/",
  auth,
  authorize(["admin"]),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  bodyParser,
  validateRequest(blogValidation),
  createBlogController
);

blogRouter.patch(
  "/:id",
  auth,
  authorize(["admin"]),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validateRequest(blogUpdateValidation),
  updateBlogController
);

blogRouter.delete("/:id", auth, authorize(["admin"]), deleteBlogController);

export default blogRouter;
