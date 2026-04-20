import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/AppError";
import { ChangePasswordInput, UpdateMeInput } from "./users.schema";
import { hashPassword, verifyPassword } from "@/utils/hash";

export const usersService = {
  getMe: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },
  getById: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        email: true,
      },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },
  updateMe: async (id: string, inputUpdate: UpdateMeInput) => {
    const { name } = inputUpdate;
    return await prisma.user.update({
      where: { id },
      data: { name },
      omit: { password: true },
    });
  },
  changePassword: async (id: string, inputPassword: ChangePasswordInput) => {
    const { newPassword, currentPassword } = inputPassword;
    const currentUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!currentUser) {
      throw new AppError("User not found", 401);
    }
    const isMatch = await verifyPassword(currentPassword, currentUser.password);
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 401);
    }
    if (currentPassword === newPassword) {
      throw new AppError("New password must be different", 400);
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: await hashPassword(newPassword),
      },
      omit: {
        password: true,
      },
    });
    await prisma.refreshToken.deleteMany({
      where: { userId: id },
    });
    return user;
  },
};
