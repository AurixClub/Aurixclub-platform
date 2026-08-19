import { z } from "zod";

export const createTeamMemberSchema = z.object({
  user_id: z.string().nullable().optional(),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  designation: z.string().min(2, "Designation is required").max(100),
  department_id: z.string().nullable().optional(),
  avatar_url: z.string().url("Invalid avatar URL").nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  github_url: z.string().url("Invalid GitHub URL").nullable().optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").nullable().optional(),
  display_order: z.number().int().min(0).optional(),
  joined_year: z.number().int().min(2000).max(2100).nullable().optional(),
});

export const updateTeamMemberSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  designation: z.string().min(2).max(100).optional(),
  department_id: z.string().nullable().optional(),
  avatar_url: z.string().url("Invalid avatar URL").nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  github_url: z.string().url("Invalid GitHub URL").nullable().optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").nullable().optional(),
  display_order: z.number().int().min(0).optional(),
  is_visible: z.boolean().optional(),
  joined_year: z.number().int().min(2000).max(2100).nullable().optional(),
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
