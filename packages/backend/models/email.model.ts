import { createServerSupabaseClient } from "@aurix/supabase/server";
import type { EmailCampaign, EmailAudience, EmailStatus, EmailTrigger } from "@aurix/types";

export class EmailModel {
  async list(): Promise<EmailCampaign[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error (list email campaigns):", error);
      throw new Error("Failed to fetch email campaigns");
    }

    return data || [];
  }

  async findById(id: string): Promise<EmailCampaign | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error("Supabase Error (find email campaign):", error);
      throw new Error("Failed to fetch email campaign");
    }

    return data;
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
    status?: EmailStatus;
  }): Promise<EmailCampaign> {
    const supabase = createServerSupabaseClient();
    const now = new Date().toISOString();
    
    const insertData = {
      subject: data.subject.trim(),
      body: data.body.trim(),
      audience: data.audience,
      trigger: data.trigger,
      related_event_id: data.related_event_id ?? null,
      related_program_id: data.related_program_id ?? null,
      sent_by: data.sent_by,
      sent_at: now,
      status: data.status ?? "sent",
      recipient_count: data.recipient_count,
      created_at: now,
    };

    const { data: record, error } = await supabase
      .from("email_campaigns")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (create email campaign):", error);
      throw new Error("Failed to create email campaign record");
    }

    return record;
  }

  toDTO(record: EmailCampaign): EmailCampaign {
    return { ...record };
  }
}

export const emailModel = new EmailModel();
