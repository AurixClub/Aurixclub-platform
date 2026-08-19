export type ApplicationStatus = "pending" | "approved" | "rejected" | "waitlisted";

export interface JoinApplication {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: number;
  department_interests: string[];
  why_join: string;
  skills: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationPayload {
  full_name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: number;
  department_interests: string[];
  why_join: string;
  skills?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
}

export interface ReviewApplicationPayload {
  status: "approved" | "rejected" | "waitlisted";
  admin_notes?: string | null;
}
