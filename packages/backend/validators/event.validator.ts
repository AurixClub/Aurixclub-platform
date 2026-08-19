import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  short_description: z.string().max(300).nullable().optional(),
  cover_image_url: z.string().url("Invalid cover image URL").nullable().optional(),
  mode: z.enum(["online", "offline", "hybrid"]),
  venue: z.string().max(200).nullable().optional(),
  meeting_link: z.string().url("Invalid meeting link URL").nullable().optional(),
  department_id: z.string().nullable().optional(),
  starts_at: z.string().datetime("starts_at must be a valid ISO datetime"),
  ends_at: z.string().datetime("ends_at must be a valid ISO datetime"),
  registration_deadline: z.string().datetime().nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
  message: "ends_at must be after starts_at",
  path: ["ends_at"],
});

export const updateEventSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().min(20).max(5000).optional(),
  short_description: z.string().max(300).nullable().optional(),
  cover_image_url: z.string().url("Invalid cover image URL").nullable().optional(),
  mode: z.enum(["online", "offline", "hybrid"]).optional(),
  venue: z.string().max(200).nullable().optional(),
  meeting_link: z.string().url("Invalid meeting link URL").nullable().optional(),
  department_id: z.string().nullable().optional(),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
  registration_deadline: z.string().datetime().nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateRegistrationSchema = z.object({
  status: z.enum(["attended", "cancelled"], {
    errorMap: () => ({ message: "Status must be 'attended' or 'cancelled'" }),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
