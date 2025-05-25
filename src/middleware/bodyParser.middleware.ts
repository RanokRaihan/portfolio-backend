import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const bodyParser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    if (!data) {
      throw new ApiError(400, "Data is required");
    }
    if (typeof data === "string") {
      req.body = JSON.parse(data);
    }

    next();
  }
);

export default bodyParser;
