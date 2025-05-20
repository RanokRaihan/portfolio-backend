import { Response } from "express";
import { IMeta, IResponse } from "../interface/global.interface";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: IMeta
) => {
  const response: IResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    statusCode,
    data,
  };
  if (meta) {
    response["meta"] = meta;
  }
  return res.status(statusCode).json(response);
};
