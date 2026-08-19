export type PostStatus = "draft" | "published" | "scheduled" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_id: string;
  department_id: string | null;
  status: PostStatus;
  tags: string[];
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  department_id?: string | null;
  tags?: string[];
  scheduled_at?: string | null;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  department_id?: string | null;
  status?: PostStatus;
  tags?: string[];
  scheduled_at?: string | null;
}
