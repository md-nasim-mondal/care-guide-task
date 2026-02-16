import { z } from "zod";

export const createPostZodSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const updatePostZodSchema = z.object({
  content: z.string().min(1, "Content is required").optional(),
});
