import { ZodError } from "zod";
import { requireRole } from "../services/auth.guard";
import { emailService } from "../services/email.service";
import { AuthError } from "../services/auth.service";
import { sendEmailSchema } from "../validators/email.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class EmailController {
  /**
   * GET /api/email/campaigns
   * Super Admin only.
   */
  async handleListCampaigns(token: string | undefined): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const campaigns = await emailService.listCampaigns();
      return { response: { success: true, data: { campaigns, total: campaigns.length } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/email/send
   * Super Admin only.
   */
  async handleSend(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      const admin = await requireRole(token, "super_admin");
      const input = sendEmailSchema.parse(body);
      const campaign = await emailService.sendCampaign(input, admin.id);
      return { response: { success: true, data: { campaign } }, status: 201 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  private handleError(err: unknown): HttpResponse {
    if (err instanceof ZodError) {
      return {
        response: { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request data", details: err.errors } },
        status: 400,
      };
    }
    if (err instanceof AuthError) {
      return {
        response: { success: false, error: { code: err.code, message: err.message } },
        status: err.statusCode,
      };
    }
    console.error("[EmailController]", err);
    return {
      response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      status: 500,
    };
  }
}

export const emailController = new EmailController();
