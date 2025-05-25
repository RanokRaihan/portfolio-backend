import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { getDashboardInsightService } from "./dashboard.service";

export const getDashboardInsightController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getDashboardInsightService();
    sendResponse(res, 200, "Dashboard insight retrieved successfully", result);
  }
);
