import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    throw new AppError("Unauthorized", 401);
  }
  const token = bearerHeader.slice(7);
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
  } catch {
    throw new AppError("Token không hợp lệ hoặc đã hết hạn", 401);
  }
  req.userId = payload.sub as string;
  next();
};
