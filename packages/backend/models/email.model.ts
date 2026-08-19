import type { EmailCampaign, EmailAudience, EmailStatus, EmailTrigger } from "@aurix/types";

export interface EmailRecord {
  id: string;
  subject: string;
  body: string;
  audience: EmailAudience;
  trigger: EmailTrigger;
  related_event_id: string | null;
  related_program_id: string | null;
  sent_by: string;
  sent_at: string | null;
  status: EmailStatus;
  recipient_count: number;
  created_at: string;
}

class MockEmailStore {
  private campaigns: Map<string, EmailRecord> = new Map();
  private isInitialized = false;

  async ensureInitialized() {
    if (this.isInitialized) return;
    const now = "2026-08-12T14:30:00.000Z";
    const seed: EmailRecord[] = [
      {
        id: "camp_001",
        subject: "Welcome to AURIX — Fall 2026 Kickoff!",
        body: "Hello AURIX members,\n\nWe are excited to welcome you all to the new academic year! Check out our upcoming events and get ready for a semester of building and innovation.\n\nBest,\nAURIX Core Team",
        audience: "all",
        trigger: "manual",
        related_event_id: null,
        related_program_id: null,
        sent_by: "admin_001",
        sent_at: now,
        status: "sent",
        recipient_count: 142,
        created_at: now,
      },
    ];

    this.campaigns.clear();
    for (const c of seed) {
      this.campaigns.set(c.id, c);
    }
    this.isInitialized = true;
  }

  async list(): Promise<EmailRecord[]> {
    await this.ensureInitialized();
    return Array.from(this.campaigns.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(c => ({ ...c }));
  }

  async findById(id: string): Promise<EmailRecord | null> {
    await this.ensureInitialized();
    const c = this.campaigns.get(id);
    return c ? { ...c } : null;
  }

  async create(data: {
    subject: string;
    body: string;
    audience: EmailAudience;
    trigger: EmailTrigger;
    related_event_id?: string | null;
    related_program_id?: string | null;
    sent_by: string;
    recipient_count: number;
  }): Promise<EmailRecord> {
    await this.ensureInitialized();
    const id = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: EmailRecord = {
      id,
      subject: data.subject.trim(),
      body: data.body.trim(),
      audience: data.audience,
      trigger: data.trigger,
      related_event_id: data.related_event_id ?? null,
      related_program_id: data.related_program_id ?? null,
      sent_by: data.sent_by,
      sent_at: now,
      status: "sent",
      recipient_count: data.recipient_count,
      created_at: now,
    };

    this.campaigns.set(id, record);
    return { ...record };
  }

  toDTO(record: EmailRecord): EmailCampaign {
    return { ...record };
  }
}

const g = globalThis as unknown as { mockEmailStore?: MockEmailStore };
export const emailStore = g.mockEmailStore ?? new MockEmailStore();
if (process.env.NODE_ENV !== "production") g.mockEmailStore = emailStore;
export const emailModel = emailStore;
