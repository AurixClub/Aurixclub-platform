import { z } from "zod";

export const createApplicationSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required").max(20),
  college: z.string().min(2, "College name is required").max(150),
  branch: z.string().min(2, "Branch is required").max(100),
  year: z.number().int().min(1).max(5),
  department_interests: z
    .array(z.string())
    .min(1, "Select at least one department of interest"),
  why_join: z
    .string()
    .min(50, "Please write at least 50 characters about why you want to join")
    .max(2000),
  skills: z.string().max(500).nullable().optional(),
  portfolio_url: z.string().url("Invalid portfolio URL").nullable().optional(),
  github_url: z.string().url("Invalid GitHub URL").nullable().optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").nullable().optional(),
});

export const reviewApplicationSchema = z.object({
  status: z.enum(["approved", "rejected", "waitlisted"], {
    errorMap: () => ({ message: "Status must be 'approved', 'rejected', or 'waitlisted'" }),
  }),
  admin_notes: z.string().max(1000).nullable().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;
