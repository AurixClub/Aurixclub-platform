import type { Post, PostStatus } from "@aurix/types";

export interface PostRecord {
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

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").substring(0, 80);
}

class MockPostStore {
  private posts: Map<string, PostRecord> = new Map();
  private isInitialized = false;

  async ensureInitialized() {
    if (this.isInitialized) return;
    this.posts.clear();
    this.isInitialized = true;
  }

  async list(filters?: { forAdmin?: boolean; department_id?: string }): Promise<PostRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.posts.values());
    if (!filters?.forAdmin) records = records.filter(p => p.status === "published");
    if (filters?.department_id) records = records.filter(p => p.department_id === filters.department_id);
    return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(p => ({ ...p }));
  }

  async findById(id: string): Promise<PostRecord | null> {
    await this.ensureInitialized();
    const p = this.posts.get(id);
    return p ? { ...p } : null;
  }

  async findBySlug(slug: string): Promise<PostRecord | null> {
    await this.ensureInitialized();
    for (const p of this.posts.values()) if (p.slug === slug) return { ...p };
    return null;
  }

  async create(data: { title: string; content: string; excerpt?: string | null; cover_image_url?: string | null; author_id: string; department_id?: string | null; tags?: string[]; scheduled_at?: string | null }): Promise<PostRecord> {
    await this.ensureInitialized();
    const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const record: PostRecord = {
      id, title: data.title.trim(), slug: slugify(data.title), content: data.content.trim(),
      excerpt: data.excerpt ?? null, cover_image_url: data.cover_image_url ?? null,
      author_id: data.author_id, department_id: data.department_id ?? null,
      status: data.scheduled_at ? "scheduled" : "draft",
      tags: data.tags ?? [], published_at: null, scheduled_at: data.scheduled_at ?? null,
      created_at: now, updated_at: now,
    };
    this.posts.set(id, record);
    return { ...record };
  }

  async update(id: string, partial: Partial<Omit<PostRecord, "id" | "author_id" | "created_at">>): Promise<PostRecord | null> {
    await this.ensureInitialized();
    const existing = this.posts.get(id);
    if (!existing) return null;
    const published_at = partial.status === "published" && !existing.published_at ? new Date().toISOString() : existing.published_at;
    const updated: PostRecord = { ...existing, ...partial, slug: partial.title ? slugify(partial.title) : existing.slug, published_at, updated_at: new Date().toISOString() };
    this.posts.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.posts.delete(id);
  }

  toDTO(record: PostRecord): Post {
    return { ...record };
  }
}

const g = globalThis as unknown as { mockPostStore?: MockPostStore };
export const postStore = g.mockPostStore ?? new MockPostStore();
if (process.env.NODE_ENV !== "production") g.mockPostStore = postStore;
export const postModel = postStore;
