import type { Program, ProgramStatus, ProgramMode } from "@aurix/types";

export interface ProgramRecord {
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

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").substring(0, 80);
}

class MockProgramStore {
  private programs: Map<string, ProgramRecord> = new Map();
  private isInitialized = false;

  async ensureInitialized() {
    if (this.isInitialized) return;
    this.programs.clear();
    this.isInitialized = true;
  }

  async list(filters?: { forAdmin?: boolean; department_id?: string }): Promise<ProgramRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.programs.values());
    if (!filters?.forAdmin) records = records.filter(p => p.status === "published");
    if (filters?.department_id) records = records.filter(p => p.department_id === filters.department_id);
    return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(p => ({ ...p }));
  }

  async findById(id: string): Promise<ProgramRecord | null> {
    await this.ensureInitialized();
    const p = this.programs.get(id);
    return p ? { ...p } : null;
  }

  async create(data: Omit<ProgramRecord, "id" | "slug" | "registration_count" | "status" | "created_at" | "updated_at">): Promise<ProgramRecord> {
    await this.ensureInitialized();
    const id = `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const record: ProgramRecord = { ...data, id, slug: slugify(data.title), registration_count: 0, status: "draft", created_at: now, updated_at: now };
    this.programs.set(id, record);
    return { ...record };
  }

  async update(id: string, partial: Partial<Omit<ProgramRecord, "id" | "created_by" | "created_at">>): Promise<ProgramRecord | null> {
    await this.ensureInitialized();
    const existing = this.programs.get(id);
    if (!existing) return null;
    const updated: ProgramRecord = { ...existing, ...partial, slug: partial.title ? slugify(partial.title) : existing.slug, updated_at: new Date().toISOString() };
    this.programs.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.programs.delete(id);
  }

  toDTO(record: ProgramRecord): Program {
    return { ...record };
  }
}

const g = globalThis as unknown as { mockProgramStore?: MockProgramStore };
export const programStore = g.mockProgramStore ?? new MockProgramStore();
if (process.env.NODE_ENV !== "production") g.mockProgramStore = programStore;
export const programModel = programStore;
