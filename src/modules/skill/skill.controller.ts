import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadToCloudinary } from "../../utils/handleImageUpload";
import { sendResponse } from "../../utils/sendResponse";
import {
  createSkillService,
  deleteSkillService,
  getAllSkillsService,
  getAllSkillsWithFilterService,
  getFeaturedSkillsService,
  getSkillByIdService,
  getSkillsByCategoryService,
  updateSkillService,
} from "./skill.service";

// Create a new skill
export const createSkillController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "Skill image is required");
    }
    console.log("req.file", req.file);
    console.log("req.body", req.body);

    // Assuming you have a cloudinaryUpload utility function
    const { secure_url } = await uploadToCloudinary(
      req.file.filename,
      req.file.path
    );

    const payload = {
      ...req.body,
      image: secure_url,
    };

    const result = await createSkillService(payload);
    sendResponse(res, 201, "Skill created successfully", result);
  }
);

// Get all skills
export const getAllSkillsController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("working");
    const result = await getAllSkillsService(req.query);
    sendResponse(res, 200, "Skills retrieved successfully", result.data);
  }
);

// // Get all skills with pagination
export const getAllSkillsWithFilterController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAllSkillsWithFilterService(req.query);
    console.log("result", result);
    sendResponse(
      res,
      200,
      "Skills retrieved successfully",
      result.data,
      result.meta
    );
  }
);
// Get a single skill by ID
export const getSkillByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getSkillByIdService(id);

    if (!result) {
      throw new ApiError(404, "Skill not found");
    }

    sendResponse(res, 200, "Skill retrieved successfully", result);
  }
);

// Update a skill
export const updateSkillController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await updateSkillService(id, req.body);

    if (!result) {
      throw new ApiError(404, "Skill not found");
    }

    sendResponse(res, 200, "Skill updated successfully", result);
  }
);

// Delete a skill
export const deleteSkillController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSkillService(id);

    if (!result) {
      throw new ApiError(404, "Skill not found");
    }

    sendResponse(res, 200, "Skill deleted successfully", result);
  }
);

// Get featured skills
export const getFeaturedSkillsController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getFeaturedSkillsService();
    sendResponse(res, 200, "Featured skills retrieved successfully", result);
  }
);

// Get skills by category
export const getSkillsByCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.params;
    const result = await getSkillsByCategoryService(category);
    sendResponse(res, 200, "Skills retrieved successfully", result);
  }
);
