import { z } from "zod";

// Admin uploads are sent as data URLs by the current UI. Keep that supported,
// but reject arbitrary schemes and unbounded payloads.
const imageSourceSchema = z
  .string()
  .max(7_000_000, "Image is too large (maximum 5 MB)")
  .refine(
    (value) =>
      value === "" ||
      /^https:\/\//i.test(value) ||
      /^http:\/\//i.test(value) ||
      /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,/i.test(value),
    "Invalid image URL or image upload"
  );

export const createDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters").max(100),
  description: z.string().max(500).nullable().optional(),
  logo_url: z.string().url("Invalid logo URL").nullable().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  logo_url: z.string().url("Invalid logo URL").nullable().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

// SECURITY: Proper Zod schema for department member creation
// Replaces the unsafe `body as any` pattern (VULN-09)
export const addDepartmentMemberSchema = z.object({
  department_id: z.string().min(1, "Department ID is required"),
  name: z.string().min(1, "Member name is required").max(100),
  role: z.string().max(50).default("Member"),
  description: z.string().max(500).nullable().optional(),
  avatar_url: imageSourceSchema.nullable().optional().or(z.literal("")),
  email: z.string().email("Invalid email").nullable().optional().or(z.literal("")),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type AddDepartmentMemberInput = z.infer<typeof addDepartmentMemberSchema>;
