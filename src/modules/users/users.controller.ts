import { Request, Response } from "express";
import { usersService } from "./users.service";
import { sendSuccess } from "@/utils/response";
import { AppError } from "@/utils/AppError";
import { changePasswordSchema, updateMeSchema, userIdParamSchema } from "./users.schema";

export const usersController = {
  getMe: async (req: Request, res: Response) => {
    const id = req.userId;
    if (!id) {
      throw new AppError("Unauthenticated", 401);
    }
    const user = await usersService.getMe(id);
    sendSuccess(res, { data: user });
  },
  getById: async (req: Request, res: Response) => {
    const { id } = userIdParamSchema.parse(req.params);
    const user = await usersService.getById(id);
    sendSuccess(res, { data: user });
  },
  updateMe: async (req: Request, res: Response) => {
    const id = req.userId;
    if (!id) {
      throw new AppError("Unauthenticated", 401);
    }
    const data = updateMeSchema.parse(req.body);

    const user = await usersService.updateMe(id, data);
    sendSuccess(res, { data: user });
  },
  changePassword: async (req: Request, res: Response) => {
    const id = req.userId;
    if (!id) {
      throw new AppError("Unauthenticated", 401);
    }
    const data = changePasswordSchema.parse(req.body);
    const user = await usersService.changePassword(id, data);
    sendSuccess(res, { data: user });
  },
};
