export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type EventMode = "online" | "offline" | "hybrid";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  cover_image_url: string | null;
  mode: EventMode;
  venue: string | null;
  meeting_link: string | null;
  department_id: string | null;
  starts_at: string;
  ends_at: string;
  registration_deadline: string | null;
  max_participants: number | null;
  registration_count: number;
  status: EventStatus;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus = "registered" | "attended" | "cancelled";

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  full_name: string;
  email: string;
  branch: string;
  year: number;
  phone: string | null;
  status: RegistrationStatus;
  registered_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  short_description?: string | null;
  cover_image_url?: string | null;
  mode: EventMode;
  venue?: string | null;
  meeting_link?: string | null;
  department_id?: string | null;
  starts_at: string;
  ends_at: string;
  registration_deadline?: string | null;
  max_participants?: number | null;
  tags?: string[];
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  short_description?: string | null;
  cover_image_url?: string | null;
  mode?: EventMode;
  venue?: string | null;
  meeting_link?: string | null;
  department_id?: string | null;
  starts_at?: string;
  ends_at?: string;
  registration_deadline?: string | null;
  max_participants?: number | null;
  status?: EventStatus;
  tags?: string[];
}
