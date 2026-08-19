import type { EmailCampaign } from "@aurix/types";
import { emailModel } from "../models/email.model";
import { profileModel } from "../models/profile.model";
import { eventModel } from "../models/event.model";
import type { SendEmailInput } from "../validators/email.validator";

class EmailService {
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
