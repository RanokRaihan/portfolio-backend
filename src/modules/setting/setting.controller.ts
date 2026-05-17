import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createSettingService,
  getSettingAdminService,
  getSettingPublicService,
  updateSettingService,
} from "./setting.service";

const createSettingController = asyncHandler(async (req: Request, res: Response) => {
  const setting = await createSettingService(req.body);
  sendResponse(res, 201, "Site settings created successfully", setting);
});

const getSettingPublicController = asyncHandler(async (_req: Request, res: Response) => {
  const setting = await getSettingPublicService();
  sendResponse(res, 200, "Site settings retrieved successfully", setting);
});

const getSettingAdminController = asyncHandler(async (_req: Request, res: Response) => {
  const setting = await getSettingAdminService();
  sendResponse(res, 200, "Site settings retrieved successfully", setting);
});

const updateSettingController = asyncHandler(async (req: Request, res: Response) => {
  const setting = await updateSettingService(req.body);
  sendResponse(res, 200, "Site settings updated successfully", setting);
});

export {
  createSettingController,
  getSettingAdminController,
  getSettingPublicController,
  updateSettingController,
};
