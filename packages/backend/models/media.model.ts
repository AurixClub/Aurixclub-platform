import type { MediaItem, MediaCategory } from "@aurix/types";

export interface MediaRecord {
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

class MockMediaStore {
  private mediaItems: Map<string, MediaRecord> = new Map();
  private isInitialized = false;

  async ensureInitialized() {
    if (this.isInitialized) return;
    const now = new Date().toISOString();
    const seed: MediaRecord[] = [
      {
        id: "media_001",
        file_name: "hackathon-banner.jpg",
        file_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
        file_type: "image/jpeg",
        file_size_bytes: 482910,
        category: "event",
        alt_text: "AURIX Hackathon 2026 Promotional Banner",
        uploaded_by: "admin_001",
        created_at: now,
      },
      {
        id: "media_002",
        file_name: "harshith-avatar.jpg",
        file_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
        file_type: "image/jpeg",
        file_size_bytes: 154200,
        category: "team",
        alt_text: "Harshith Gowda Profile Photo",
        uploaded_by: "admin_001",
        created_at: now,
      },
      {
        id: "media_003",
        file_name: "aurix-logo.png",
        file_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop",
        file_type: "image/png",
        file_size_bytes: 89400,
        category: "asset",
        alt_text: "AURIX Club Official Logo",
        uploaded_by: "admin_001",
        created_at: now,
      },
    ];

    this.mediaItems.clear();
    for (const m of seed) {
      this.mediaItems.set(m.id, m);
    }
    this.isInitialized = true;
  }

  async list(filters?: { category?: MediaCategory; search?: string }): Promise<MediaRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.mediaItems.values());

    if (filters?.category) {
      records = records.filter(m => m.category === filters.category);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        m => m.file_name.toLowerCase().includes(q) || (m.alt_text && m.alt_text.toLowerCase().includes(q))
      );
    }

    return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(m => ({ ...m }));
  }

  async findById(id: string): Promise<MediaRecord | null> {
    await this.ensureInitialized();
    const m = this.mediaItems.get(id);
    return m ? { ...m } : null;
  }

  async create(data: Omit<MediaRecord, "id" | "created_at">): Promise<MediaRecord> {
    await this.ensureInitialized();
    const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const record: MediaRecord = { ...data, id, created_at: now };
    this.mediaItems.set(id, record);
    return { ...record };
  }

  async update(id: string, partial: Partial<Pick<MediaRecord, "alt_text" | "category">>): Promise<MediaRecord | null> {
    await this.ensureInitialized();
    const existing = this.mediaItems.get(id);
    if (!existing) return null;
    const updated: MediaRecord = { ...existing, ...partial };
    this.mediaItems.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.mediaItems.delete(id);
  }

  toDTO(record: MediaRecord): MediaItem {
    return { ...record };
  }
}

const g = globalThis as unknown as { mockMediaStore?: MockMediaStore };
export const mediaStore = g.mockMediaStore ?? new MockMediaStore();
if (process.env.NODE_ENV !== "production") g.mockMediaStore = mediaStore;
export const mediaModel = mediaStore;
