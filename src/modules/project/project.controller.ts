import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  changeProjectStatusService,
  createProjectService,
  getAllManagedProjectsService,
  getAllPublicProjectsService,
  getManagedProjectByIdService,
  getPublicProjectByIdService,
  softDeleteProjectService,
  updateProjectService,
} from "./project.service";

const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await createProjectService({
      ...req.body,
      addedBy: req.user._id,
    });
    sendResponse(res, 201, "Project created successfully", project);
  },
);

const getAllPublicProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllPublicProjectsService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Projects retrieved successfully", data, meta);
  },
);

const getPublicProjectByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await getPublicProjectByIdService(req.params.id);
    sendResponse(res, 200, "Project retrieved successfully", project);
  },
);

const getAllManagedProjectsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllManagedProjectsService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Projects retrieved successfully", data, meta);
  },
);

const getManagedProjectByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await getManagedProjectByIdService(req.params.id);
    sendResponse(res, 200, "Project retrieved successfully", project);
  },
);

const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await updateProjectService(req.params.id, req.body);
    sendResponse(res, 200, "Project updated successfully", project);
  },
);

const changeProjectStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await changeProjectStatusService(req.params.id, req.body.status);
    sendResponse(res, 200, "Project status updated successfully", project);
  },
);

const softDeleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await softDeleteProjectService(req.params.id, req.user._id);
    sendResponse(res, 200, "Project deleted successfully", result);
  },
);

export {
  changeProjectStatusController,
  createProjectController,
  getAllManagedProjectsController,
  getAllPublicProjectsController,
  getManagedProjectByIdController,
  getPublicProjectByIdController,
  softDeleteProjectController,
  updateProjectController,
};
