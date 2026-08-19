import { z } from "zod";

export const sendEmailSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  body: z.string().min(10, "Email body must be at least 10 characters"),
  audience: z.enum(["all", "selected", "attended", "not_attended", "cancelled"], {
    errorMap: () => ({ message: "Audience must be 'all', 'selected', 'attended', 'not_attended', or 'cancelled'" }),
  }),
  related_event_id: z.string().nullable().optional(),
  related_program_id: z.string().nullable().optional(),
  selected_user_ids: z.array(z.string()).optional(),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
