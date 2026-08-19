import type { Department, DepartmentStatus, AddDepartmentMemberPayload } from "@aurix/types";

export interface DepartmentRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  status: DepartmentStatus;
  created_at: string;
  updated_at: string;
}

export interface DepartmentMemberRecord {
  id: string;
  department_id: string;
  name: string;
  role: string;
  description: string | null;
  avatar_url: string | null;
  email?: string | null;
  created_at: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

class MockDepartmentStore {
  private departments: Map<string, DepartmentRecord> = new Map();
  private members: Map<string, DepartmentMemberRecord> = new Map();
  private isInitialized = false;

  public async ensureInitialized() {
    if (this.isInitialized) return;

    const now = "2026-01-01T00:00:00.000Z";
    const initial: DepartmentRecord[] = [
      {
        id: "dept_tech_01",
        name: "Technical Department",
        slug: "technical",
        description: "Handles all technical initiatives, software projects, open source, and hands-on workshops.",
        logo_url: null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        id: "dept_sponsors_02",
        name: "Sponsors & Industry Relations",
        slug: "sponsors-industry-relations",
        description: "Manages corporate sponsorships, industry partnerships, alumni networks, and community relations.",
        logo_url: null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        id: "dept_research_03",
        name: "Innovation & Research",
        slug: "innovation-research",
        description: "Drives research papers, deep-tech experiments, patents, and cutting-edge innovation programs.",
        logo_url: null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        id: "dept_event_04",
        name: "Event Management",
        slug: "event-management",
        description: "Plans and executes flagship hackathons, tech fests, guest lectures, and campus experiences.",
        logo_url: null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        id: "dept_media_05",
        name: "Social Media & Marketing",
        slug: "social-media-marketing",
        description: "Manages digital branding, social outreach, graphic media design, and promotional campaigns.",
        logo_url: null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        id: "dept_startup_06",
        name: "Entrepreneurship & Startup",
        slug: "entrepreneurship-startup",
        description: "Supports student startup founders, prototype incubation, pitch nights, and venture acceleration.",
        logo_url: null,
        status: "active",
        created_at: now,
        updated_at: now,
      },
    ];

    this.departments.clear();
    for (const d of initial) {
      this.departments.set(d.id, d);
    }

    // Empty initial department members — ready for fresh entry via Admin Portal
    this.members.clear();
    this.isInitialized = true;
  }

  async list(filters?: { status?: DepartmentStatus }): Promise<DepartmentRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.departments.values());
    if (filters?.status) {
      records = records.filter((d) => d.status === filters.status);
    }
    return records.map((d) => ({ ...d }));
  }

  async findById(id: string): Promise<DepartmentRecord | null> {
    await this.ensureInitialized();
    const dept = this.departments.get(id);
    return dept ? { ...dept } : null;
  }

  async findBySlug(slug: string): Promise<DepartmentRecord | null> {
    await this.ensureInitialized();
    for (const dept of this.departments.values()) {
      if (dept.slug === slug) return { ...dept };
    }
    return null;
  }

  async create(data: {
    name: string;
    description?: string | null;
    logo_url?: string | null;
  }): Promise<DepartmentRecord> {
    await this.ensureInitialized();
    const id = `dept_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const slug = slugify(data.name);

    const record: DepartmentRecord = {
      id,
      name: data.name.trim(),
      slug,
      description: data.description ?? null,
      logo_url: data.logo_url ?? null,
      status: "active",
      created_at: now,
      updated_at: now,
    };

    this.departments.set(id, record);
    return { ...record };
  }

  async update(
    id: string,
    partial: Partial<Omit<DepartmentRecord, "id" | "created_at">>
  ): Promise<DepartmentRecord | null> {
    await this.ensureInitialized();
    const existing = this.departments.get(id);
    if (!existing) return null;

    const updated: DepartmentRecord = {
      ...existing,
      ...partial,
      slug: partial.name ? slugify(partial.name) : existing.slug,
      updated_at: new Date().toISOString(),
    };

    this.departments.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    // Also remove members of this department
    for (const [memId, mem] of this.members.entries()) {
      if (mem.department_id === id) {
        this.members.delete(memId);
      }
    }
    return this.departments.delete(id);
  }

  // --- Department Member Operations ---
  async listMembers(departmentId?: string): Promise<DepartmentMemberRecord[]> {
    await this.ensureInitialized();
    let mems = Array.from(this.members.values());
    if (departmentId) {
      mems = mems.filter((m) => m.department_id === departmentId);
    }
    return mems.map((m) => ({ ...m }));
  }

  async addMember(departmentId: string, data: AddDepartmentMemberPayload): Promise<DepartmentMemberRecord> {
    await this.ensureInitialized();
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: DepartmentMemberRecord = {
      id,
      department_id: departmentId,
      name: data.name.trim(),
      role: data.role.trim() || "Member",
      description: data.description?.trim() || null,
      avatar_url: data.avatar_url?.trim() || null,
      email: data.email?.trim() || null,
      created_at: now,
    };

    this.members.set(id, record);
    return { ...record };
  }

  async removeMember(memberId: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.members.delete(memberId);
  }

  async toDTO(record: DepartmentRecord): Promise<Department> {
    const deptMembers = await this.listMembers(record.id);
    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      logo_url: record.logo_url,
      status: record.status,
      member_count: deptMembers.length,
      members: deptMembers,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }
}

const globalForDept = globalThis as unknown as {
  mockDepartmentStore: MockDepartmentStore | undefined;
};

export const departmentStore =
  globalForDept.mockDepartmentStore && typeof (globalForDept.mockDepartmentStore as any).addMember === "function"
    ? globalForDept.mockDepartmentStore
    : new MockDepartmentStore();

if (process.env.NODE_ENV !== "production") {
  globalForDept.mockDepartmentStore = departmentStore;
}

export const departmentModel = departmentStore;
