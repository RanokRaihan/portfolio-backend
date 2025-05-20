import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Requested api not found",
    statusCode: 404,
    errorSources: [
      {
        path: "global",
        message: "Requested api not found",
      },
    ],
  });
};

export default notFound;
