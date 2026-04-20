import * as z from "zod";

export const createPostSchema = z.object({
  content: z
    .string({ message: "Content bắt buộc phải nhập" })
    .min(1, { message: "Content phải nhiều hơn 1 kí tự" })
    .max(280, { message: "Content quá dài" }),
});

export const postIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id format"),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().default(5),
  page: z.coerce.number().default(1),
});

export const updatePostSchema = z.object({
  content: z
    .string({ message: "Content bắt buộc phải nhập" })
    .min(1, { message: "Content phải nhiều hơn 1 kí tự" })
    .max(280, { message: "Content quá dài" }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PostIdParamInput = z.infer<typeof postIdParamSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
