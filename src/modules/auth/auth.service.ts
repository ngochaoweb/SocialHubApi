import { env } from "@/config/env";
import { prisma } from "@/config/prisma";
import { RegisterData } from "@/types/auth";
import { AppError } from "@/utils/AppError";
import { hashPassword, verifyPassword } from "@/utils/hash";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRE = env.JWT_EXPIRE;

export const authService = {
  register: async (data: RegisterData) => {
    return await prisma.user.create({
      data: {
        ...data,
        password: await hashPassword(data.password),
      },
      omit: {
        password: true,
      },
    });
  },
  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }
    const isPasswordValid = await verifyPassword(password, user?.password as string);
    if (!isPasswordValid) {
      throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }
    const token = jwt.sign({ sub: user?.id }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRE as SignOptions["expiresIn"],
    });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },
};
