import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadToCloudinary } from "../../utils/handleImageUpload";
import { sendResponse } from "../../utils/sendResponse";
import {
  createBlogService,
  deleteBlogService,
  getAllBlogsService,
  getBlogByIdService,
  getBlogsByCategoryService,
  getBlogsByTagService,
  getFeaturedBlogsService,
  updateBlogService,
} from "./blog.service";

// Create a new blog
export const createBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if thumbnail is provided
    if (!req.files || !("thumbnail" in req.files)) {
      throw new ApiError(400, "Blog thumbnail is required");
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Upload thumbnail to Cloudinary
    const thumbnailFile = files.thumbnail[0];
    const thumbnailResult = await uploadToCloudinary(
      thumbnailFile.filename,
      thumbnailFile.path
    );

    // Upload additional images if provided
    let imageUrls: string[] = [];
    if (files.images && files.images.length > 0) {
      const uploadPromises = files.images.map((image) =>
        uploadToCloudinary(image.filename, image.path)
      );

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url as string);
    }

    // Parse tags array if it's a string
    let tags = req.body.tags;
    if (typeof tags === "string") {
      tags = JSON.parse(tags);
    }

    // Create payload for service
    const payload = {
      ...req.body,
      tags,
      thumbnail: thumbnailResult.secure_url,
      images: imageUrls,
      isFeatured:
        req.body.isFeatured === "true" || req.body.isFeatured === true,
    };

    const result = await createBlogService(payload);
    sendResponse(res, 201, "Blog created successfully", result);
  }
);

// Get all blogs
export const getAllBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAllBlogsService(req.query);
    sendResponse(
      res,
      200,
      "Blogs retrieved successfully",
      result.data,
      result.meta
    );
  }
);

// Get a single blog by ID
export const getBlogByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getBlogByIdService(id);

    if (!result) {
      throw new ApiError(404, "Blog not found");
    }

    sendResponse(res, 200, "Blog retrieved successfully", result);
  }
);

// Update a blog
export const updateBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const existingBlog = await getBlogByIdService(id);

    if (!existingBlog) {
      throw new ApiError(404, "Blog not found");
    }

    let payload = { ...req.body };
    const files = req.files as
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | undefined;

    // Handle thumbnail upload if provided
    if (files && files.thumbnail && files.thumbnail.length > 0) {
      const thumbnailFile = files.thumbnail[0];
      const thumbnailResult = await uploadToCloudinary(
        thumbnailFile.filename,
        thumbnailFile.path
      );
      payload.thumbnail = thumbnailResult.secure_url;
    }

    // Handle additional images if provided
    if (files && files.images && files.images.length > 0) {
      const uploadPromises = files.images.map((image) =>
        uploadToCloudinary(image.filename, image.path)
      );

      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map((result) => result.secure_url);

      // Combine existing images with new ones
      payload.images = [...(existingBlog.images || []), ...newImageUrls];
    }

    // Parse tags array if it's a string
    if (typeof payload.tags === "string") {
      payload.tags = JSON.parse(payload.tags);
    }

    if (payload.isFeatured !== undefined) {
      payload.isFeatured =
        payload.isFeatured === "true" || payload.isFeatured === true;
    }

    const result = await updateBlogService(id, payload);
    sendResponse(res, 200, "Blog updated successfully", result);
  }
);

// Delete a blog
export const deleteBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteBlogService(id);

    if (!result) {
      throw new ApiError(404, "Blog not found");
    }

    sendResponse(res, 200, "Blog deleted successfully", result);
  }
);

// Get featured blogs
export const getFeaturedBlogsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getFeaturedBlogsService();
    sendResponse(res, 200, "Featured blogs retrieved successfully", result);
  }
);

// Get blogs by category
export const getBlogsByCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.params;
    const result = await getBlogsByCategoryService(category);
    sendResponse(res, 200, "Blogs retrieved successfully", result);
  }
);

// Get blogs by tag
export const getBlogsByTagController = asyncHandler(
  async (req: Request, res: Response) => {
    const { tag } = req.params;
    const result = await getBlogsByTagService(tag);
    sendResponse(res, 200, "Blogs retrieved successfully", result);
  }
);
