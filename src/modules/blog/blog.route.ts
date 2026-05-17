import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createBlogController,
  getAllBlogsAdminController,
  getAllPublishedBlogsController,
  getBlogBySlugController,
  softDeleteBlogController,
  updateBlogController,
} from "./blog.controller";
import { createBlogSchema, updateBlogSchema } from "./blog.validation";

const blogRouter = Router();

// Static routes must be registered before /:slug to avoid param capture
blogRouter.get(
  "/all",
  auth,
  authorize(["admin", "moderator"]),
  getAllBlogsAdminController,
);

// Public routes
blogRouter.get("/", getAllPublishedBlogsController);

blogRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createBlogSchema),
  createBlogController,
);

// Dynamic slug route — after all static GET routes
blogRouter.get("/:slug", getBlogBySlugController);

// Protected CRUD — use ObjectId-based :id (different HTTP methods, no conflict with /:slug)
blogRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateBlogSchema),
  updateBlogController,
);

blogRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  softDeleteBlogController,
);

export default blogRouter;
