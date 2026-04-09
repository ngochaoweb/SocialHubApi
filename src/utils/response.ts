import { Response } from "express";

interface SuccessOptions<T> {
  data: T;
  message?: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>(res: Response, options: SuccessOptions<T>) => {
  const { data, message = "Success", statusCode = 200, meta } = options;
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
};

interface ErrorOptions {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: unknown;
}

export const sendError = (res: Response, options: ErrorOptions) => {
  const { message, statusCode = 500, code, errors } = options;
  return res.status(statusCode).json({
    success: false,
    message,
    ...(code && { code }),
    ...(errors !== undefined && { errors }),
  });
};
