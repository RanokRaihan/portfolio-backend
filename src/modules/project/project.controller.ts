import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadToCloudinary } from "../../utils/handleImageUpload";
import { sendResponse } from "../../utils/sendResponse";
import {
  createProjectService,
  deleteProjectService,
  getAllProjectsService,
  getFeaturedProjectsService,
  getProjectByIdService,
  updateProjectService,
} from "./project.service";

// Create a new project
export const addProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    // console.log(req.files);
    // Check if thumbnail is provided
    if (!req.files || !("thumbnail" in req.files)) {
      throw new ApiError(400, "Project thumbnail is required", "thumbnail");
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

    // Parse technologies and keyFeatures arrays if they're strings
    let technologies = req.body.technologies;
    let keyFeatures = req.body.keyFeatures;
    let challenges = req.body.challenges;
    if (typeof challenges === "string") {
      challenges = JSON.parse(challenges);
    }
    if (typeof technologies === "string") {
      technologies = JSON.parse(technologies);
    }

    if (typeof keyFeatures === "string") {
      keyFeatures = JSON.parse(keyFeatures);
    }
    // console.log(req.body);
    // Create payload for service
    const payload = {
      ...req.body,
      technologies,
      keyFeatures,
      challenges,
      thumbnail: thumbnailResult.secure_url,
      images: imageUrls,
      isFeatured:
        req.body.isFeatured === "true" || req.body.isFeatured === true,
    };
    // console.log(payload);
    const result = await createProjectService(payload);
    sendResponse(res, 201, "Project created successfully", result);
  }
);

// Get all projects
export const getAllProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAllProjectsService(req.query);

    sendResponse(
      res,
      200,
      "Projects retrieved successfully",
      result.data,
      result.meta
    );
  }
);

// Get a single project by ID
export const getProjectByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getProjectByIdService(id);

    if (!result) {
      throw new ApiError(404, "Project not found");
    }

    sendResponse(res, 200, "Project retrieved successfully", result);
  }
);

// Update a project
export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const existingProject = await getProjectByIdService(id);

    if (!existingProject) {
      throw new ApiError(404, "Project not found");
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
      payload.images = [...(existingProject.images || []), ...newImageUrls];
    }

    // Parse technologies and keyFeatures arrays if they're strings
    if (typeof payload.technologies === "string") {
      payload.technologies = JSON.parse(payload.technologies);
    }

    if (typeof payload.keyFeatures === "string") {
      payload.keyFeatures = JSON.parse(payload.keyFeatures);
    }

    if (payload.isFeatured !== undefined) {
      payload.isFeatured =
        payload.isFeatured === "true" || payload.isFeatured === true;
    }

    const result = await updateProjectService(id, payload);
    sendResponse(res, 200, "Project updated successfully", result);
  }
);

// Delete a project
export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteProjectService(id);

    if (!result) {
      throw new ApiError(404, "Project not found");
    }

    sendResponse(res, 200, "Project deleted successfully", result);
  }
);

// Get featured projects
export const getFeaturedProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getFeaturedProjectsService();
    sendResponse(res, 200, "Featured projects retrieved successfully", result);
  }
);
