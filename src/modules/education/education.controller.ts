import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createEducationService,
  getAllEducationService,
  getEducationByIdService,
  softDeleteEducationService,
  updateEducationService,
} from "./education.service";

const createEducationController = asyncHandler(
  async (req: Request, res: Response) => {
    const education = await createEducationService({
      ...req.body,
      addedBy: req.user._id,
    });
    sendResponse(res, 201, "Education record created successfully", education);
  },
);

const getAllEducationController = asyncHandler(
  async (_req: Request, res: Response) => {
    const educations = await getAllEducationService();
    sendResponse(res, 200, "Education records retrieved successfully", educations);
  },
);

const getEducationByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const education = await getEducationByIdService(req.params.id);
    sendResponse(res, 200, "Education record retrieved successfully", education);
  },
);

const updateEducationController = asyncHandler(
  async (req: Request, res: Response) => {
    const education = await updateEducationService(req.params.id, req.body);
    sendResponse(res, 200, "Education record updated successfully", education);
  },
);

const softDeleteEducationController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await softDeleteEducationService(req.params.id);
    sendResponse(res, 200, "Education record deleted successfully", result);
  },
);

export {
  createEducationController,
  getAllEducationController,
  getEducationByIdController,
  softDeleteEducationController,
  updateEducationController,
};
