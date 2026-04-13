import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendSuccess } from "@/utils/response";
import { loginSchema, registerSchema } from "./auth.schema";

export const authController = {
  register: async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);
    sendSuccess(res, { data: user });
  },
  login: async (req: Request, res: Response) => {
    const { password, email } = loginSchema.parse(req.body);
    const user = await authService.login(email, password);
    sendSuccess(res, { data: user });
  },
};
