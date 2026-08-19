export type ProgramStatus = "draft" | "published" | "archived";
export type ProgramMode = "online" | "offline" | "hybrid";

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  cover_image_url: string | null;
  mode: ProgramMode;
  department_id: string | null;
  duration_weeks: number | null;
  max_participants: number | null;
  registration_count: number;
  start_date: string | null;
  end_date: string | null;
  application_deadline: string | null;
  status: ProgramStatus;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProgramPayload {
  title: string;
  description: string;
  short_description?: string | null;
  cover_image_url?: string | null;
  mode: ProgramMode;
  department_id?: string | null;
  duration_weeks?: number | null;
  max_participants?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  application_deadline?: string | null;
  tags?: string[];
}

export interface UpdateProgramPayload {
  title?: string;
  description?: string;
  short_description?: string | null;
  cover_image_url?: string | null;
  mode?: ProgramMode;
  department_id?: string | null;
  duration_weeks?: number | null;
  max_participants?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  application_deadline?: string | null;
  status?: ProgramStatus;
  tags?: string[];
}
