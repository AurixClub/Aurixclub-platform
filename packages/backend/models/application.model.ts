import type { JoinApplication, ApplicationStatus } from "@aurix/types";

export interface ApplicationRecord {
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

class MockApplicationStore {
  private applications: Map<string, ApplicationRecord> = new Map();
  private isInitialized = false;

  public async ensureInitialized() {
    if (this.isInitialized) return;
    this.applications.clear();
    this.isInitialized = true;
  }

  async list(filters?: {
    status?: ApplicationStatus;
    email?: string;
    search?: string;
  }): Promise<ApplicationRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.applications.values());

    if (filters?.status) {
      records = records.filter((a) => a.status === filters.status);
    }

    if (filters?.email) {
      const emailLower = filters.email.toLowerCase();
      records = records.filter((a) => a.email.toLowerCase() === emailLower);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.college.toLowerCase().includes(q) ||
          a.branch.toLowerCase().includes(q)
      );
    }

    // Sort by newest first
    return records.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).map((a) => ({ ...a }));
  }

  async findById(id: string): Promise<ApplicationRecord | null> {
    await this.ensureInitialized();
    const app = this.applications.get(id);
    return app ? { ...app } : null;
  }

  async findByUserId(userId: string): Promise<ApplicationRecord[]> {
    await this.ensureInitialized();
    const records: ApplicationRecord[] = [];
    for (const app of this.applications.values()) {
      if (app.user_id === userId) records.push({ ...app });
    }
    return records.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async create(data: {
    user_id: string | null;
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
  }): Promise<ApplicationRecord> {
    await this.ensureInitialized();
    const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: ApplicationRecord = {
      id,
      user_id: data.user_id,
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      college: data.college.trim(),
      branch: data.branch.trim(),
      year: data.year,
      department_interests: data.department_interests,
      why_join: data.why_join.trim(),
      skills: data.skills ?? null,
      portfolio_url: data.portfolio_url ?? null,
      github_url: data.github_url ?? null,
      linkedin_url: data.linkedin_url ?? null,
      status: "pending",
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: now,
      updated_at: now,
    };

    this.applications.set(id, record);
    return { ...record };
  }

  async review(
    id: string,
    data: {
      status: "approved" | "rejected" | "waitlisted";
      admin_notes?: string | null;
      reviewed_by: string;
    }
  ): Promise<ApplicationRecord | null> {
    await this.ensureInitialized();
    const existing = this.applications.get(id);
    if (!existing) return null;

    const updated: ApplicationRecord = {
      ...existing,
      status: data.status,
      admin_notes: data.admin_notes ?? existing.admin_notes,
      reviewed_by: data.reviewed_by,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.applications.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.applications.delete(id);
  }

  toDTO(record: ApplicationRecord): JoinApplication {
    return {
      id: record.id,
      user_id: record.user_id,
      full_name: record.full_name,
      email: record.email,
      phone: record.phone,
      college: record.college,
      branch: record.branch,
      year: record.year,
      department_interests: record.department_interests,
      why_join: record.why_join,
      skills: record.skills,
      portfolio_url: record.portfolio_url,
      github_url: record.github_url,
      linkedin_url: record.linkedin_url,
      status: record.status,
      admin_notes: record.admin_notes,
      reviewed_by: record.reviewed_by,
      reviewed_at: record.reviewed_at,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }
}

const globalForApps = globalThis as unknown as {
  mockApplicationStore: MockApplicationStore | undefined;
};

export const applicationStore =
  globalForApps.mockApplicationStore ?? new MockApplicationStore();

if (process.env.NODE_ENV !== "production") {
  globalForApps.mockApplicationStore = applicationStore;
}

export const applicationModel = applicationStore;
