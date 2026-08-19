import type { UserRole } from "./auth";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  college: string | null;
  branch: string | null;
  year: number | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateOwnProfilePayload {
  full_name?: string;
  phone?: string | null;
  college?: string | null;
  branch?: string | null;
  year?: number | null;
  avatar_url?: string | null;
  bio?: string | null;
}

export interface UpdateMemberByAdminPayload extends UpdateOwnProfilePayload {
  role?: UserRole;
  department_id?: string | null;
  is_active?: boolean;
}
