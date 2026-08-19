import { z } from "zod";
import { userRoleSchema } from "./auth.validator";

export const updateOwnProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().min(6, "Phone number is invalid").max(20).optional().nullable(),
  college: z.string().max(100).optional().nullable(),
  branch: z.string().max(100).optional().nullable(),
  year: z.number().int().min(1).max(5).optional().nullable(),
  avatar_url: z.string().url("Invalid avatar URL").optional().nullable().or(z.literal("")),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().nullable(),
});

export const updateMemberByAdminSchema = updateOwnProfileSchema.extend({
  role: userRoleSchema.optional(),
  department_id: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export type UpdateOwnProfileInput = z.infer<typeof updateOwnProfileSchema>;
export type UpdateMemberByAdminInput = z.infer<typeof updateMemberByAdminSchema>;
