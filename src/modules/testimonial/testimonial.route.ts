import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createTestimonialController,
  getAllTestimonialsController,
  getTestimonialByIdController,
  softDeleteTestimonialController,
  updateTestimonialController,
} from "./testimonial.controller";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation";

const testimonialRouter = Router();

// Public routes
testimonialRouter.get("/", getAllTestimonialsController);
testimonialRouter.get("/:id", getTestimonialByIdController);

// Protected routes
testimonialRouter.post(
  "/",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(createTestimonialSchema),
  createTestimonialController,
);

testimonialRouter.patch(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateTestimonialSchema),
  updateTestimonialController,
);

testimonialRouter.delete(
  "/:id",
  auth,
  authorize(["admin", "moderator"]),
  softDeleteTestimonialController,
);

export default testimonialRouter;
