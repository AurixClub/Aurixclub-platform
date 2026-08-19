export type EmailAudience = "all" | "selected" | "attended" | "not_attended" | "cancelled";
export type EmailStatus = "queued" | "sent" | "failed";
export type EmailTrigger =
  | "manual"
  | "registration_success"
  | "event_reminder"
  | "event_cancelled"
  | "event_completed";

export interface EmailCampaign {
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

export interface SendEmailPayload {
  subject: string;
  body: string;
  audience: EmailAudience;
  related_event_id?: string | null;
  related_program_id?: string | null;
  selected_user_ids?: string[];
}
