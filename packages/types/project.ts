export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  icon: string | null;
  accent: string | null;
  github_url: string | null;
  demo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInput {
  title: string;
  category: string;
  description: string;
  tags?: string[];
  icon?: string | null;
  accent?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
}
