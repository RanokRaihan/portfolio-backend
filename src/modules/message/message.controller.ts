import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import {
  deleteMessageService,
  getAllMessagesService,
  getMessageByIdService,
  submitMessageService,
  updateMessageStatusService,
} from "./message.service";

export const submitMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await submitMessageService({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    sendResponse(res, 201, "Message sent successfully", result);
  },
);

export const getAllMessagesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, meta } = await getAllMessagesService(
      req.query as Record<string, unknown>,
    );
    sendResponse(res, 200, "Messages retrieved successfully", data, meta);
  },
);

export const getMessageByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const message = await getMessageByIdService(req.params.id);
    sendResponse(res, 200, "Message retrieved successfully", message);
  },
);

export const updateMessageStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const message = await updateMessageStatusService(
      req.params.id,
      req.body.status,
    );
    sendResponse(res, 200, "Message status updated successfully", message);
  },
);

export const deleteMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteMessageService(req.params.id);
    sendResponse(res, 200, "Message deleted successfully", result);
  },
);
