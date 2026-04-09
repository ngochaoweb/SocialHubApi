import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { sendError } from "@/utils/response";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    const { message, statusCode, code } = err;
    return sendError(res, { message, statusCode, code });
  }
  console.error("[UNEXPECTED ERROR]", err);
  return sendError(res, {
    message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
    statusCode: 500,
    ...(env.NODE_ENV !== "production" && { errors: { stack: err.stack } }),
  });
};
