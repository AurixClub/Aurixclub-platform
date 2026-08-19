import type { Event, EventRegistration, EventStatus, EventMode, RegistrationStatus } from "@aurix/types";

export interface EventRecord {
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

export interface RegistrationRecord {
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

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

class MockEventStore {
  private events: Map<string, EventRecord> = new Map();
  private registrations: Map<string, RegistrationRecord> = new Map();
  private isInitialized = false;

  async ensureInitialized() {
    if (this.isInitialized) return;
    this.events.clear();
    this.registrations.clear();
    this.isInitialized = true;
  }

  // ─── Event CRUD ───────────────────────────────────────

  async listEvents(filters?: {
    status?: EventStatus;
    department_id?: string;
    forAdmin?: boolean;
  }): Promise<EventRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.events.values());

    if (!filters?.forAdmin) {
      records = records.filter((e) => e.status === "published");
    }

    if (filters?.status) {
      records = records.filter((e) => e.status === filters.status);
    }

    if (filters?.department_id) {
      records = records.filter((e) => e.department_id === filters.department_id);
    }

    return records
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
      .map((e) => ({ ...e }));
  }

  async findEventById(id: string): Promise<EventRecord | null> {
    await this.ensureInitialized();
    const ev = this.events.get(id);
    return ev ? { ...ev } : null;
  }

  async findEventBySlug(slug: string): Promise<EventRecord | null> {
    await this.ensureInitialized();
    for (const ev of this.events.values()) {
      if (ev.slug === slug) return { ...ev };
    }
    return null;
  }

  async createEvent(data: {
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
    created_by: string;
  }): Promise<EventRecord> {
    await this.ensureInitialized();
    const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: EventRecord = {
      id,
      title: data.title.trim(),
      slug: slugify(data.title),
      description: data.description.trim(),
      short_description: data.short_description ?? null,
      cover_image_url: data.cover_image_url ?? null,
      mode: data.mode,
      venue: data.venue ?? null,
      meeting_link: data.meeting_link ?? null,
      department_id: data.department_id ?? null,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      registration_deadline: data.registration_deadline ?? null,
      max_participants: data.max_participants ?? null,
      registration_count: 0,
      status: "draft",
      tags: data.tags ?? [],
      created_by: data.created_by,
      created_at: now,
      updated_at: now,
    };

    this.events.set(id, record);
    return { ...record };
  }

  async updateEvent(
    id: string,
    partial: Partial<Omit<EventRecord, "id" | "created_by" | "created_at">>
  ): Promise<EventRecord | null> {
    await this.ensureInitialized();
    const existing = this.events.get(id);
    if (!existing) return null;

    const updated: EventRecord = {
      ...existing,
      ...partial,
      slug: partial.title ? slugify(partial.title) : existing.slug,
      updated_at: new Date().toISOString(),
    };

    this.events.set(id, updated);
    return { ...updated };
  }

  async deleteEvent(id: string): Promise<boolean> {
    await this.ensureInitialized();
    // Also delete all registrations for this event
    for (const [regId, reg] of this.registrations.entries()) {
      if (reg.event_id === id) this.registrations.delete(regId);
    }
    return this.events.delete(id);
  }

  // ─── Registration CRUD ────────────────────────────────

  async findRegistration(eventId: string, userId: string): Promise<RegistrationRecord | null> {
    await this.ensureInitialized();
    for (const reg of this.registrations.values()) {
      if (reg.event_id === eventId && reg.user_id === userId) return { ...reg };
    }
    return null;
  }

  async findRegistrationById(regId: string): Promise<RegistrationRecord | null> {
    await this.ensureInitialized();
    const reg = this.registrations.get(regId);
    return reg ? { ...reg } : null;
  }

  async listRegistrationsForEvent(eventId: string): Promise<RegistrationRecord[]> {
    await this.ensureInitialized();
    const records: RegistrationRecord[] = [];
    for (const reg of this.registrations.values()) {
      if (reg.event_id === eventId) records.push({ ...reg });
    }
    return records.sort(
      (a, b) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime()
    );
  }

  async listRegistrationsByUser(userId: string): Promise<RegistrationRecord[]> {
    await this.ensureInitialized();
    const records: RegistrationRecord[] = [];
    for (const reg of this.registrations.values()) {
      if (reg.user_id === userId) records.push({ ...reg });
    }
    return records.sort(
      (a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime()
    );
  }

  async createRegistration(data: {
    event_id: string;
    user_id: string;
    full_name: string;
    email: string;
    branch: string;
    year: number;
    phone?: string | null;
  }): Promise<RegistrationRecord> {
    await this.ensureInitialized();
    const id = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: RegistrationRecord = {
      id,
      event_id: data.event_id,
      user_id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      branch: data.branch ?? "Not specified",
      year: data.year ?? 1,
      phone: data.phone ?? null,
      status: "registered",
      registered_at: now,
      updated_at: now,
    };

    this.registrations.set(id, record);

    // Increment event registration count
    const ev = this.events.get(data.event_id);
    if (ev) {
      ev.registration_count += 1;
      this.events.set(ev.id, ev);
    }

    return { ...record };
  }

  async updateRegistration(
    regId: string,
    partial: Partial<Pick<RegistrationRecord, "status">>
  ): Promise<RegistrationRecord | null> {
    await this.ensureInitialized();
    const existing = this.registrations.get(regId);
    if (!existing) return null;

    // If cancelling, decrement registration count
    if (partial.status === "cancelled" && existing.status === "registered") {
      const ev = this.events.get(existing.event_id);
      if (ev && ev.registration_count > 0) {
        ev.registration_count -= 1;
        this.events.set(ev.id, ev);
      }
    }

    const updated: RegistrationRecord = {
      ...existing,
      ...partial,
      updated_at: new Date().toISOString(),
    };

    this.registrations.set(regId, updated);
    return { ...updated };
  }

  // ─── DTO Conversion ───────────────────────────────────

  eventToDTO(record: EventRecord): Event {
    return { ...record };
  }

  registrationToDTO(record: RegistrationRecord): EventRegistration {
    return { ...record };
  }
}

const globalForEvents = globalThis as unknown as {
  mockEventStore: MockEventStore | undefined;
};

export const eventStore = globalForEvents.mockEventStore ?? new MockEventStore();

if (process.env.NODE_ENV !== "production") {
  globalForEvents.mockEventStore = eventStore;
}

export const eventModel = eventStore;
