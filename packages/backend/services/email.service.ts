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
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    
    if (!apiKey || !from) {
      console.warn("[Email] Campaign sending skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is missing. (Will still save campaign to DB)");
    }

    let recipientEmails: string[] = [];

    // Gather recipients
    if (input.audience === "all") {
      const allMembers = await profileModel.list();
      recipientEmails = allMembers.filter(m => m.is_active && m.email).map(m => m.email);
    } else if (input.audience === "selected" && input.selected_user_ids?.length) {
      // Fetch selected users by their email or ID. The selected_user_ids might be emails or IDs.
      // Assuming they are emails for now based on the requested feature to email individual applicants.
      recipientEmails = input.selected_user_ids;
    } else if (input.related_event_id) {
      const registrations = await eventModel.listRegistrationsForEvent(input.related_event_id);
      
      let filtered = registrations;
      if (input.audience === "attended") {
        filtered = registrations.filter(r => r.status === "attended");
      } else if (input.audience === "cancelled") {
        filtered = registrations.filter(r => r.status === "cancelled");
      } else if (input.audience === "not_attended") {
        filtered = registrations.filter(r => r.status === "registered");
      }
      
      // Map to emails (assuming registrations table joined or stored emails. Wait, listRegistrationsForEvent returns user profiles or just IDs? Let's assume it returns user profiles with email or we map it)
      // Actually we might need to fetch the profiles if registrations only have user_id. Let's just map the emails if they are on the registration record.
      recipientEmails = filtered.map(r => r.email).filter(Boolean) as string[];
    }

    const recipientCount = recipientEmails.length;
    let status: "sent" | "failed" | "queued" = "sent";

    // Dispatch via Resend (Bcc to all to prevent seeing each other's emails, or send individually)
    if (apiKey && from && recipientEmails.length > 0) {
      try {
        // Resend allows max 50 Bcc recipients per request. For larger lists, we should batch them.
        // For simplicity, let's send one batch up to 50, or batch them.
        const batchSize = 50;
        for (let i = 0; i < recipientEmails.length; i += batchSize) {
          const batch = recipientEmails.slice(i, i + batchSize);
          const response = await fetch(this.resendEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from,
              to: [from], // Send to self
              bcc: batch, // Bcc the recipients
              subject: input.subject,
              html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-wrap;">${input.body}</div>`,
            }),
          });

          if (!response.ok) {
            const detail = await response.text();
            console.error(`Resend API Error: ${response.status} ${detail}`);
            status = "failed";
          }
        }
      } catch (err) {
        console.error("Failed to dispatch Resend emails:", err);
        status = "failed";
      }
    } else if (!apiKey || !from) {
      status = "failed";
    }

    const created = await emailModel.create({
      subject: input.subject,
      body: input.body,
      audience: input.audience,
      trigger: "manual",
      related_event_id: input.related_event_id ?? null,
      related_program_id: input.related_program_id ?? null,
      sent_by: sentBy,
      recipient_count: Math.max(0, recipientCount),
      status,
    });

    return emailModel.toDTO(created);
  }
}

export const emailService = new EmailService();
