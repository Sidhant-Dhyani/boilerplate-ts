import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env, isProd } from "../config/env";
import { AppError } from "../utils/AppError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => issue.message).join("; ");
  } else if (err && typeof err === "object" && "name" in err) {
    const mongoErr = err as { name: string; code?: number; message?: string };

    if (mongoErr.name === "ValidationError") {
      statusCode = 400;
      message = mongoErr.message || "Validation failed";
    } else if (mongoErr.name === "CastError") {
      statusCode = 400;
      message = "Invalid resource id";
    } else if (mongoErr.code === 11000) {
      statusCode = 409;
      message = "Duplicate field value";
    }
  }

  if (!isProd && err instanceof Error && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && err instanceof Error
      ? { stack: err.stack }
      : {}),
  });
};
