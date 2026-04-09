import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`Không tìm thấy route ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND");
};
