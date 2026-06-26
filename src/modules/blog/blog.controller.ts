import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createBlogService,
  getAllBlogsAdminService,
  getAllPublishedBlogsService,
  getBlogBySlugService,
  softDeleteBlogService,
  updateBlogService,
} from "./blog.service";

export const createBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const blog = await createBlogService({
      ...req.body,
      addedBy: req.user._id,
    });
    sendResponse(res, 201, "Blog created successfully", blog);
  },
);

export const getAllPublishedBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllPublishedBlogsService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Blogs retrieved successfully", data, meta);
  },
);

export const getAllBlogsAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllBlogsAdminService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Blogs retrieved successfully", data, meta);
  },
);

export const getBlogBySlugController = asyncHandler(
  async (req: Request, res: Response) => {
    const blog = await getBlogBySlugService(req.params.slug);
    sendResponse(res, 200, "Blog retrieved successfully", blog);
  },
);

export const updateBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const blog = await updateBlogService(req.params.id, req.body);
    sendResponse(res, 200, "Blog updated successfully", blog);
  },
);

export const softDeleteBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await softDeleteBlogService(req.params.id);
    sendResponse(res, 200, "Blog deleted successfully", result);
  },
);
