import type { EmailCampaign, Event } from "@aurix/types";
import { emailModel } from "../models/email.model";
import { profileModel } from "../models/profile.model";
import { eventModel } from "../models/event.model";
import type { SendEmailInput } from "../validators/email.validator";

class EmailService {
  private readonly resendEndpoint = "https://api.resend.com/emails";

  /**
   * Send a registration confirmation without making event registration fail
   * when the provider is unavailable. RESEND_FROM_EMAIL must be a verified
   * sender/domain in Resend.
   */
  async sendEventRegistrationConfirmation(registration: {
    email: string;
    full_name: string;
  }, event: Event): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !from) {
      console.warn("[Email] Event confirmation skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is missing");
      return;
    }

    const response = await fetch(this.resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [registration.email],
        subject: `Registration confirmed: ${event.title}`,
        html: this.registrationConfirmationHtml(registration.full_name, event),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Resend rejected event confirmation (${response.status}): ${detail.slice(0, 300)}`);
    }
  }

  private registrationConfirmationHtml(fullName: string, event: Event): string {
    const escapeHtml = (value: string) =>
      value.replace(/[&<>'\"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        "\"": "&quot;",
      })[character] ?? character);

    return `<div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>Registration confirmed</h2>
      <p>Hello ${escapeHtml(fullName)},</p>
      <p>Your registration for <strong>${escapeHtml(event.title)}</strong> is confirmed.</p>
      <p><strong>When:</strong> ${escapeHtml(new Date(event.starts_at).toLocaleString())}</p>
      ${event.venue ? `<p><strong>Venue:</strong> ${escapeHtml(event.venue)}</p>` : ""}
      <p>We look forward to seeing you.</p>
      <p>— AURIX Club</p>
    </div>`;
  }

  async listCampaigns(): Promise<EmailCampaign[]> {
    const records = await emailModel.list();
    return records.map(r => emailModel.toDTO(r));
  }

  async sendCampaign(input: SendEmailInput, sentBy: string): Promise<EmailCampaign> {
    let recipientCount = 0;

    if (input.audience === "all") {
      const allMembers = await profileModel.list();
      recipientCount = allMembers.filter(m => m.is_active).length;
    } else if (input.audience === "selected") {
      recipientCount = input.selected_user_ids?.length ?? 0;
    } else if (input.related_event_id) {
      const registrations = await eventModel.listRegistrationsForEvent(input.related_event_id);
      if (input.audience === "attended") {
        recipientCount = registrations.filter(r => r.status === "attended").length;
      } else if (input.audience === "cancelled") {
        recipientCount = registrations.filter(r => r.status === "cancelled").length;
      } else if (input.audience === "not_attended") {
        recipientCount = registrations.filter(r => r.status === "registered").length;
      }
    } else {
      recipientCount = 1;
    }

    const created = await emailModel.create({
      subject: input.subject,
      body: input.body,
      audience: input.audience,
      trigger: "manual",
      related_event_id: input.related_event_id ?? null,
      related_program_id: input.related_program_id ?? null,
      sent_by: sentBy,
      recipient_count: Math.max(1, recipientCount),
    });

    return emailModel.toDTO(created);
  }
}

export const emailService = new EmailService();
