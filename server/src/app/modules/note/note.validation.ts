import { z } from "zod";

export const createNoteZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const updateNoteZodSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});
