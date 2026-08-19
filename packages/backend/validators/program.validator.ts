import { z } from "zod";

export const createProgramSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  short_description: z.string().max(300).nullable().optional(),
  cover_image_url: z.string().url("Invalid cover image URL").nullable().optional(),
  mode: z.enum(["online", "offline", "hybrid"]),
  department_id: z.string().nullable().optional(),
  duration_weeks: z.number().int().positive().nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  end_date: z.string().datetime().nullable().optional(),
  application_deadline: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProgramSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().min(20).max(5000).optional(),
  short_description: z.string().max(300).nullable().optional(),
  cover_image_url: z.string().url("Invalid cover image URL").nullable().optional(),
  mode: z.enum(["online", "offline", "hybrid"]).optional(),
  department_id: z.string().nullable().optional(),
  duration_weeks: z.number().int().positive().nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  end_date: z.string().datetime().nullable().optional(),
  application_deadline: z.string().datetime().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
