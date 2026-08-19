import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().max(400).nullable().optional(),
  cover_image_url: z.string().url("Invalid cover image URL").nullable().optional(),
  department_id: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().max(400).nullable().optional(),
  cover_image_url: z.string().url("Invalid cover image URL").nullable().optional(),
  department_id: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
