import { z } from "zod";

export const createMediaSchema = z.object({
  file_name: z.string().min(1, "File name is required").max(255),
  file_url: z.string().url("Invalid file URL"),
  file_type: z.string().min(1, "File type is required"),
  file_size_bytes: z.number().int().nonnegative("File size must be non-negative"),
  category: z.enum(["event", "team", "program", "post", "department", "asset"], {
    errorMap: () => ({ message: "Category must be event, team, program, post, department, or asset" }),
  }),
  alt_text: z.string().max(255).nullable().optional(),
});

export const updateMediaSchema = z.object({
  alt_text: z.string().max(255).nullable().optional(),
  category: z.enum(["event", "team", "program", "post", "department", "asset"]).optional(),
});

export type CreateMediaInput = z.infer<typeof createMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
