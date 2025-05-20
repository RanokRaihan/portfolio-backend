import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError, ZodIssue } from "zod";
import { node_env } from "../config";
import { TErrorSources } from "../interface/error.interface";
import ApiError from "./ApiError";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  // define default values
  let statusCode = 500;
  let message = "something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "global",
      message: "something went wrong!",
    },
  ];

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error occurred!";
    errorSources = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue.message,
      };
    });
  }

  // Handle mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation error occurred!";
    errorSources = Object.values(err.errors).map(
      (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
          path: error.path,
          message: error.message,
        };
      }
    );
  }

  // mongoose cast error
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid data!";
    errorSources = [
      {
        path: err.path,
        message: err.message,
      },
    ];
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    // Extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);
    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1];
    statusCode = 400;
    message = "Duplicate field value entered";
    errorSources = [
      {
        path: "global",
        message: `${extractedMessage} is already exists`,
      },
    ];
  }

  //apiError handler
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;

    errorSources = [
      {
        path: err?.path || "global",
        message: err.message,
      },
    ];
  }

  //   return response
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errorSources,
    stack: node_env === "development" ? err?.stack : null,
  });
};
