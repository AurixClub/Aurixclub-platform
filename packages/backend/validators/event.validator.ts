import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(5, "Description must be at least 5 characters").max(10000),
  short_description: z.string().max(500).nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  mode: z.enum(["online", "offline", "in_person", "hybrid"]),
  venue: z.string().max(300).nullable().optional(),
  meeting_link: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
  starts_at: z.string(),
  ends_at: z.string(),
  registration_deadline: z.string().nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
}).refine((data) => {
  const startsAt = new Date(data.starts_at);
  const endsAt = new Date(data.ends_at);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return false;
  }
  return endsAt >= startsAt;
}, {
  message: "Valid start/end dates are required and ends_at must be after starts_at",
  path: ["ends_at"],
});

export const updateEventSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(5).max(10000).optional(),
  short_description: z.string().max(500).nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  mode: z.enum(["online", "offline", "in_person", "hybrid"]).optional(),
  venue: z.string().max(300).nullable().optional(),
  meeting_link: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  registration_deadline: z.string().nullable().optional(),
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
