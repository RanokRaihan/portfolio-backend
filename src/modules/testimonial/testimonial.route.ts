import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createTestimonialController,
  getAllTestimonialsAdminController,
  getAllTestimonialsController,
  getFeaturedTestimonialsController,
  getTestimonialByIdController,
  softDeleteTestimonialController,
  togglePublishTestimonialController,
  updateTestimonialController,
} from "./testimonial.controller";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation";

const testimonialRouter = Router();

// Public routes
testimonialRouter.get("/featured", getFeaturedTestimonialsController);
testimonialRouter.get("/", getAllTestimonialsController);
testimonialRouter.post(
  "/",
  validateRequest(createTestimonialSchema),
  createTestimonialController,
);

// Protected routes
testimonialRouter.get(
  "/admin",
  auth,
  authorize(["admin", "moderator"]),
  getAllTestimonialsAdminController,
);

testimonialRouter.get(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  getTestimonialByIdController,
);

testimonialRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateTestimonialSchema),
  updateTestimonialController,
);

testimonialRouter.patch(
  "/:id/publish",
  auth,
  authorize(["admin", "moderator"]),
  togglePublishTestimonialController,
);

testimonialRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  softDeleteTestimonialController,
);

export default testimonialRouter;
