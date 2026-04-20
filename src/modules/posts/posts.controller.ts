import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import {
  createPostSchema,
  paginationSchema,
  postIdParamSchema,
  updatePostSchema,
} from "./posts.schema";
import { postsService } from "./posts.service";
import { sendSuccess } from "@/utils/response";

export const postsController = {
  create: async (req: Request, res: Response) => {
    const id = req.userId;
    if (!id) {
      throw new AppError("Unauthenticated", 401);
    }
    const data = createPostSchema.parse(req.body);
    const post = await postsService.create(id, data);
    sendSuccess(res, { data: post, statusCode: 201 });
  },
  getById: async (req: Request, res: Response) => {
    const { id } = postIdParamSchema.parse(req.params);
    const post = await postsService.getById(id);
    sendSuccess(res, { data: post });
  },
  getAll: async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query);
    const { page, limit } = query;
    const { posts, total } = await postsService.getAll(query);
    sendSuccess(res, { data: posts, meta: { page, limit, total } });
  },
  update: async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("Unauthenticated", 401);
    }
    const { id: postId } = postIdParamSchema.parse(req.params);
    const content = updatePostSchema.parse(req.body);
    const post = await postsService.update(postId, userId, content);
    sendSuccess(res, { data: post });
  },
  delete: async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("Unauthenticated", 401);
    }
    const { id: postId } = postIdParamSchema.parse(req.params);
    const post = await postsService.delete(postId, userId);
    sendSuccess(res, { data: post });
  },
};
