import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { createProjectService } from "./project.service";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await createProjectService({
      ...req.body,
      addedBy: req.user._id,
    });

    sendResponse(res, 201, "Project created successfully", project);
  },
);
