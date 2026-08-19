import { z } from "zod";

export const userRoleSchema = z.enum(["super_admin", "member"]);

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  // Login accepts any password — complexity is enforced on signup only.
  // This ensures existing users can still log in after the policy change.
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Please provide a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit"),
    full_name: z.string().min(2, "Full name must be at least 2 characters long").optional(),
    fullName: z.string().min(2, "Full name must be at least 2 characters long").optional(),
    // SECURITY: 'role' is intentionally omitted. All signups default to 'member'.
    // Super Admin accounts can only be promoted by existing admins.
  })
  .refine((data) => !!(data.full_name || data.fullName), {
    message: "Full name is required and must be at least 2 characters",
    path: ["full_name"],
  })
  .transform((data) => ({
    email: data.email,
    password: data.password,
    full_name: (data.full_name || data.fullName)!.trim(),
  }));

export const updateRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: userRoleSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
