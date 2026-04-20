import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id format"),
});

export const updateMeSchema = z
  .object({
    name: z.string().trim().min(1).max(50),
  })
  .partial();

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string({ message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export type UserIdParamSchema = z.infer<typeof userIdParamSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
