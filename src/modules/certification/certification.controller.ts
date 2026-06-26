import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createCertificationService,
  getCertificationByIdService,
  getAllCertificationsService,
  softDeleteCertificationService,
  updateCertificationService,
} from "./certification.service";

const createCertificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const certification = await createCertificationService({
      ...req.body,
      addedBy: req.user._id,
    });
    sendResponse(res, 201, "Certification created successfully", certification);
  },
);

const getCertificationByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const certification = await getCertificationByIdService(req.params.id);
    sendResponse(res, 200, "Certification retrieved successfully", certification);
  },
);

const getAllCertificationsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const certifications = await getAllCertificationsService();
    sendResponse(res, 200, "Certifications retrieved successfully", certifications);
  },
);

const updateCertificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const certification = await updateCertificationService(req.params.id, req.body);
    sendResponse(res, 200, "Certification updated successfully", certification);
  },
);

const softDeleteCertificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await softDeleteCertificationService(req.params.id);
    sendResponse(res, 200, "Certification deleted successfully", result);
  },
);

export {
  createCertificationController,
  getCertificationByIdController,
  getAllCertificationsController,
  softDeleteCertificationController,
  updateCertificationController,
};
