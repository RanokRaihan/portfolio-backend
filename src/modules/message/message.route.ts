import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import validateRequest from "../../middleware/validateRequest";
import { createRateLimiter } from "../../utils/rateLimiter";
import {
  deleteMessageController,
  getAllMessagesController,
  getMessageByIdController,
  submitMessageController,
  updateMessageStatusController,
} from "./message.controller";
import { submitMessageSchema, updateMessageStatusSchema } from "./message.validation";

const messageRouter = Router();

const submitRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

// Public
messageRouter.post(
  "/",
  submitRateLimiter,
  validateRequest(submitMessageSchema),
  submitMessageController,
);

// Protected
messageRouter.get("/", auth, authorize(["admin", "moderator"]), getAllMessagesController);

messageRouter.get("/:id", auth, authorize(["admin", "moderator"]), getMessageByIdController);

messageRouter.patch(
  "/:id/status",
  auth,
  authorize(["admin", "moderator"]),
  validateRequest(updateMessageStatusSchema),
  updateMessageStatusController,
);

messageRouter.delete("/:id", auth, authorize(["admin"]), deleteMessageController);

export default messageRouter;
