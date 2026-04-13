import { z } from "zod";

export const registerSchema = z.object({
  email: z.string({ message: "Email là bắt buộc" }).email({ message: "Email không hợp lệ" }),

  username: z
    .string({ message: "Username là bắt buộc" })
    .min(3, { message: "Username tối thiểu 3 ký tự" })
    .max(30, { message: "Username tối đa 30 ký tự" }),

  name: z.string({ message: "Tên là bắt buộc" }).min(1, { message: "Tên không được để trống" }),

  password: z
    .string({ message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export const loginSchema = z.object({
  email: z.string({ message: "Email là bắt buộc" }).email({ message: "Email không hợp lệ" }),
  password: z
    .string({ message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;
