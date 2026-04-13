import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { sendError } from "@/utils/response";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client"; // ← path theo chỗ em generate

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // 1. Zod validation error
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return sendError(res, {
      message: "Validation failed",
      statusCode: 400,
      errors,
    });
  }

  // 2. Prisma duplicate unique (P2002)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const field = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
    return sendError(res, {
      message: `${field} already exists`,
      statusCode: 409,
    });
  }

  // 3. Lỗi app cố ý throw
  if (err instanceof AppError) {
    const { message, statusCode, code } = err;
    return sendError(res, { message, statusCode, code });
  }

  // 4. Lỗi không biết — log + trả chung chung
  console.error("[UNEXPECTED ERROR]", err);
  return sendError(res, {
    message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
    statusCode: 500,
    ...(env.NODE_ENV !== "production" && { errors: { stack: err.stack } }),
  });
};
