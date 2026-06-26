import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createTestimonialService,
  getAllTestimonialsAdminService,
  getAllTestimonialsService,
  getFeaturedTestimonialsService,
  getTestimonialByIdService,
  softDeleteTestimonialService,
  togglePublishTestimonialService,
  updateTestimonialService,
} from "./testimonial.service";

export const createTestimonialController = asyncHandler(
  async (req: Request, res: Response) => {
    const testimonial = await createTestimonialService({
      ...req.body,
      addedBy: req.user?._id,
    });
    sendResponse(res, 201, "Testimonial created successfully", testimonial);
  },
);

export const getFeaturedTestimonialsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getFeaturedTestimonialsService(
      req.query as Record<string, unknown>,
    );
    sendResponse(
      res,
      200,
      "Featured testimonials retrieved successfully",
      data,
      meta,
    );
  },
);

export const getAllTestimonialsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllTestimonialsService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Testimonials retrieved successfully", data, meta);
  },
);

export const getAllTestimonialsAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllTestimonialsAdminService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Testimonials retrieved successfully", data, meta);
  },
);

export const getTestimonialByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const testimonial = await getTestimonialByIdService(req.params.id);
    sendResponse(res, 200, "Testimonial retrieved successfully", testimonial);
  },
);

export const updateTestimonialController = asyncHandler(
  async (req: Request, res: Response) => {
    const testimonial = await updateTestimonialService(
      req.params.id,
      req.body,
    );
    sendResponse(res, 200, "Testimonial updated successfully", testimonial);
  },
);

export const togglePublishTestimonialController = asyncHandler(
  async (req: Request, res: Response) => {
    const testimonial = await togglePublishTestimonialService(req.params.id);
    sendResponse(
      res,
      200,
      "Testimonial publish status updated successfully",
      testimonial,
    );
  },
);

export const softDeleteTestimonialController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await softDeleteTestimonialService(req.params.id);
    sendResponse(res, 200, "Testimonial deleted successfully", result);
  },
);
