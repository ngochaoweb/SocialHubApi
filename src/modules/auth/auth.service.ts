import { env } from "@/config/env";
import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/AppError";
import { hashPassword, verifyPassword } from "@/utils/hash";
import jwt, { SignOptions } from "jsonwebtoken";
import { LoginInput, RefreshInput, RegisterInput } from "./auth.schema";

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const JWT_EXPIRE = env.JWT_EXPIRE;
const JWT_REFRESH_EXPIRE = env.JWT_REFRESH_EXPIRE;

export const authService = {
  register: async (data: RegisterInput) => {
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

  login: async (input: LoginInput) => {
    const { email, password } = input;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }

    const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE as SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE as SignOptions["expiresIn"],
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  getMe: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    });
  },

  refresh: async (input: RefreshInput) => {
    const { refreshToken: oldToken } = input;

    //1. verify JWT
    try {
      jwt.verify(oldToken, env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
    }

    //2. tìm trong DB
    const record = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
    });
    if (!record) {
      throw new AppError("Refresh token không hợp lệ", 401);
    }

    //3. Xóa token cũ (rotation)
    await prisma.refreshToken.delete({ where: { token: oldToken } });

    //4. Sinh token mới
    const accessToken = jwt.sign({ sub: record.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE as SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ sub: record.userId }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE as SignOptions["expiresIn"],
    });

    //5. Lưu refresh token mới vào DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: record.userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  },
};
