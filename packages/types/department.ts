export type DepartmentStatus = "active" | "inactive";

export interface DepartmentMember {
  id: string;
  department_id: string;
  name: string;
  role: string; // e.g. "Lead", "Co-Lead", "Core Member", "Technical Lead"
  description: string | null;
  avatar_url: string | null;
  email?: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  status: DepartmentStatus;
  member_count: number;
  members?: DepartmentMember[];
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string | null;
  logo_url?: string | null;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string | null;
  logo_url?: string | null;
  status?: DepartmentStatus;
}

export interface AddDepartmentMemberPayload {
  department_id?: string;
  name: string;
  role: string;
  description?: string | null;
  avatar_url?: string | null;
  email?: string | null;
}
