export interface TeamMember {
  id: string;
  user_id: string | null;
  full_name: string;
  designation: string;
  department_id: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_visible: boolean;
  joined_year: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberPayload {
  user_id?: string | null;
  full_name: string;
  designation: string;
  department_id?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  display_order?: number;
  joined_year?: number | null;
}

export interface UpdateTeamMemberPayload {
  full_name?: string;
  designation?: string;
  department_id?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  display_order?: number;
  is_visible?: boolean;
  joined_year?: number | null;
}
