import { prisma } from "@/config/prisma";
import { CreatePostInput, PaginationInput, UpdatePostInput } from "./posts.schema";
import { AppError } from "@/utils/AppError";

export const postsService = {
  create: async (id: string, inputContent: CreatePostInput) => {
    const { content } = inputContent;
    return await prisma.post.create({
      data: {
        content,
        authorId: id,
      },
    });
  },
  getById: async (id: string) => {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    return post;
  },
  getAll: async (queryInput: PaginationInput) => {
    const { limit, page } = queryInput;
    const skip = (page - 1) * limit;
    const posts = await prisma.post.findMany({
      skip, //Bỏ qua bao nhiêu record
      take: limit, //Lấy bao nhiêu record
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    const total = await prisma.post.count();
    return { posts, total };
  },
  update: async (postId: string, userId: string, contentInput: UpdatePostInput) => {
    const { content } = contentInput;
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    if (post.authorId !== userId) {
      throw new AppError("You are not the author of this post", 403);
    }
    const postUpdate = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
      },
    });
    return postUpdate;
  },
  delete: async (postId: string, userId: string) => {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    if (post.authorId !== userId) {
      throw new AppError("You are not the author of this post", 403);
    }
    const postDelete = await prisma.post.delete({
      where: { id: postId },
    });
    return postDelete;
  },
};
