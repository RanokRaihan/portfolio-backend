import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { getStatsService } from "./stats.service";

export const getStatsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await getStatsService();
    sendResponse(res, 200, "Stats retrieved successfully", data);
  },
);
