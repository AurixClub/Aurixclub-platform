import { ZodError } from "zod";
import { requireAuth, requireRole } from "../services/auth.guard";
import {
  eventService,
  EventNotFoundError,
  EventNotPublishedError,
  RegistrationNotFoundError,
  AlreadyRegisteredError,
  RegistrationClosedError,
} from "../services/event.service";
import { AuthError } from "../services/auth.service";
import {
  createEventSchema,
  updateEventSchema,
  updateRegistrationSchema,
} from "../validators/event.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class EventController {
  /**
   * GET /api/events
   * Public: published events only.
   * Super Admin: all events.
   */
  async handleList(
    token: string | undefined,
    query: { department_id?: string }
  ): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try {
        await requireRole(token, "super_admin");
        forAdmin = true;
      } catch {
        /* not admin */
      }

      const events = await eventService.list({ forAdmin, department_id: query.department_id });
      return { response: { success: true, data: { events } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/events/:id
   * Public: published only. Super Admin: any.
   */
  async handleGetById(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try {
        await requireRole(token, "super_admin");
        forAdmin = true;
      } catch {
        /* not admin */
      }

      const event = await eventService.getById(id, forAdmin);
      return { response: { success: true, data: { event } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/events
   * Super Admin only.
   */
  async handleCreate(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      const admin = await requireRole(token, "super_admin");
      const input = createEventSchema.parse(body);
      const event = await eventService.create(input, admin.id);
      return { response: { success: true, data: { event } }, status: 201 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * PATCH /api/events/:id
   * Super Admin only.
   */
  async handleUpdate(token: string | undefined, id: string, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updateEventSchema.parse(body);
      const event = await eventService.update(id, input);
      return { response: { success: true, data: { event } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * DELETE /api/events/:id
   * Super Admin only.
   */
  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await eventService.delete(id);
      return { response: { success: true, message: "Event deleted successfully" }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/events/:id/register
   * Authenticated members only.
   */
  async handleRegister(token: string | undefined, eventId: string): Promise<HttpResponse> {
    try {
      const user = await requireAuth(token);
      const registration = await eventService.register(eventId, user.id);
      return { response: { success: true, data: { registration } }, status: 201 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/events/my-registrations
   * Authenticated users — their own event registrations.
   */
  async handleGetMyRegistrations(token: string | undefined): Promise<HttpResponse> {
    try {
      const user = await requireAuth(token);
      const registrations = await eventService.getMyRegistrations(user.id);
      return { response: { success: true, data: { registrations } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/events/:id/registrations
   * Super Admin only.
   */
  async handleGetRegistrations(token: string | undefined, eventId: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const registrations = await eventService.getRegistrations(eventId);
      return {
        response: { success: true, data: { registrations, total: registrations.length } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * PATCH /api/events/:id/registrations/:regId
   * Super Admin only — mark attended or cancel.
   */
  async handleUpdateRegistration(
    token: string | undefined,
    eventId: string,
    regId: string,
    body: unknown
  ): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updateRegistrationSchema.parse(body);
      const registration = await eventService.updateRegistration(eventId, regId, input);
      return { response: { success: true, data: { registration } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  private handleError(err: unknown): HttpResponse {
    if (err instanceof ZodError) {
      return {
        response: {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid request data", details: err.errors },
        },
        status: 400,
      };
    }

    if (
      err instanceof EventNotFoundError ||
      err instanceof EventNotPublishedError ||
      err instanceof RegistrationNotFoundError ||
      err instanceof AlreadyRegisteredError ||
      err instanceof RegistrationClosedError ||
      err instanceof AuthError
    ) {
      return {
        response: { success: false, error: { code: err.code, message: err.message } },
        status: err.statusCode,
      };
    }

    console.error("[EventController] Unhandled error:", err);
    return {
      response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      status: 500,
    };
  }
}

export const eventController = new EventController();
