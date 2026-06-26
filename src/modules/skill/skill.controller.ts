import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  createSkillService,
  deleteSkillService,
  getAllPublicSkillsService,
  getSkillByIdService,
  updateSkillService,
} from "./skill.service";

const createSkillController = asyncHandler(
  async (req: Request, res: Response) => {
    const skill = await createSkillService({
      ...req.body,
      addedBy: req.user._id,
    });
    sendResponse(res, 201, "Skill created successfully", skill);
  },
);

const getAllPublicSkillsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category } = req.query as Record<string, string | undefined>;
    const skills = await getAllPublicSkillsService(category);
    sendResponse(res, 200, "Skills retrieved successfully", skills);
  },
);

const getSkillByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const skill = await getSkillByIdService(req.params.id);
    sendResponse(res, 200, "Skill retrieved successfully", skill);
  },
);

const updateSkillController = asyncHandler(
  async (req: Request, res: Response) => {
    const skill = await updateSkillService(req.params.id, req.body);
    sendResponse(res, 200, "Skill updated successfully", skill);
  },
);

const deleteSkillController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteSkillService(req.params.id);
    sendResponse(res, 200, "Skill deleted successfully", result);
  },
);

export {
  createSkillController,
  deleteSkillController,
  getAllPublicSkillsController,
  getSkillByIdController,
  updateSkillController,
};
