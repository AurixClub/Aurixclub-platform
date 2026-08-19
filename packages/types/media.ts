export type MediaCategory = "event" | "team" | "program" | "post" | "department" | "asset";

export interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_bytes: number;
  category: MediaCategory;
  alt_text: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface CreateMediaPayload {
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_bytes: number;
  category: MediaCategory;
  alt_text?: string | null;
}

export interface UpdateMediaPayload {
  alt_text?: string | null;
  category?: MediaCategory;
}
