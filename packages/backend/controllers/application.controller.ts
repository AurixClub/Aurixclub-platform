import { ZodError } from "zod";
import { requireAuth, requireRole } from "../services/auth.guard";
import {
  applicationService,
  ApplicationNotFoundError,
  DuplicateApplicationError,
} from "../services/application.service";
import { AuthError } from "../services/auth.service";
import {
  createApplicationSchema,
  reviewApplicationSchema,
} from "../validators/application.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class ApplicationController {
  /**
   * GET /api/applications
   * Super Admin only — list all applications with optional filters.
   * Query params: ?status=pending|approved|rejected|waitlisted, ?search=...
   */
  async handleList(
    token: string | undefined,
    query: { status?: string; search?: string }
  ): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");

      const status = ["pending", "approved", "rejected", "waitlisted"].includes(
        query.status ?? ""
      )
        ? (query.status as "pending" | "approved" | "rejected" | "waitlisted")
        : undefined;

      const applications = await applicationService.list({
        status,
        search: query.search,
      });

      return {
        response: { success: true, data: { applications, total: applications.length } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/applications/my
   * Authenticated member — returns own submitted applications.
   */
  async handleGetMy(token: string | undefined): Promise<HttpResponse> {
    try {
      const user = await requireAuth(token);
      const applications = await applicationService.getMyApplications(user.id);
      return {
        response: { success: true, data: { applications } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/applications/:id
   * Super Admin only.
   */
  async handleGetById(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const application = await applicationService.getById(id);
      return {
        response: { success: true, data: { application } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/applications
   * Authenticated members submit their own application.
   * Associates the user_id if the submitter is logged in.
   */
  async handleSubmit(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      // Auth is required to submit
      const user = await requireAuth(token);
      const input = createApplicationSchema.parse(body);
      const application = await applicationService.submit(input, user.id);
      return {
        response: { success: true, data: { application } },
        status: 201,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * PATCH /api/applications/:id
   * Super Admin only — review (approve/reject/waitlist) an application.
   */
  async handleReview(
    token: string | undefined,
    id: string,
    body: unknown
  ): Promise<HttpResponse> {
    try {
      const admin = await requireRole(token, "super_admin");
      const input = reviewApplicationSchema.parse(body);
      const application = await applicationService.review(id, input, admin.id);
      return {
        response: { success: true, data: { application } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * DELETE /api/applications/:id
   * Super Admin only.
   */
  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await applicationService.delete(id);
      return {
        response: { success: true, message: "Application deleted successfully" },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  private handleError(err: unknown): HttpResponse {
    if (err instanceof ZodError) {
      return {
        response: {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: err.errors,
          },
        },
        status: 400,
      };
    }

    if (
      err instanceof ApplicationNotFoundError ||
      err instanceof DuplicateApplicationError ||
      err instanceof AuthError
    ) {
      return {
        response: {
          success: false,
          error: { code: err.code, message: err.message },
        },
        status: err.statusCode,
      };
    }

    console.error("[ApplicationController] Unhandled error:", err);
    return {
      response: {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
      },
      status: 500,
    };
  }
}

export const applicationController = new ApplicationController();
