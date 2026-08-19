import { ZodError } from "zod";
import { requireRole } from "../services/auth.guard";
import { mediaService, MediaNotFoundError } from "../services/media.service";
import { AuthError } from "../services/auth.service";
import { createMediaSchema, updateMediaSchema } from "../validators/media.validator";
import type { MediaCategory } from "@aurix/types";

type HttpResponse = { response: Record<string, unknown>; status: number };

class MediaController {
  /**
   * GET /api/media
   * Super Admin only.
   */
  async handleList(token: string | undefined, query: { category?: string; search?: string }): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const category = ["event", "team", "program", "post", "department", "asset"].includes(query.category ?? "")
        ? (query.category as MediaCategory)
        : undefined;
      const media = await mediaService.list({ category, search: query.search });
      return { response: { success: true, data: { media, total: media.length } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/media/:id
   * Super Admin only.
   */
  async handleGetById(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const media = await mediaService.getById(id);
      return { response: { success: true, data: { media } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/media
   * Super Admin only.
   */
  async handleCreate(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      const admin = await requireRole(token, "super_admin");
      const input = createMediaSchema.parse(body);
      const media = await mediaService.create(input, admin.id);
      return { response: { success: true, data: { media } }, status: 201 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * PATCH /api/media/:id
   * Super Admin only.
   */
  async handleUpdate(token: string | undefined, id: string, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updateMediaSchema.parse(body);
      const media = await mediaService.update(id, input);
      return { response: { success: true, data: { media } }, status: 200 };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * DELETE /api/media/:id
   * Super Admin only.
   */
  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await mediaService.delete(id);
      return { response: { success: true, message: "Media deleted successfully" }, status: 200 };
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
    if (err instanceof MediaNotFoundError || err instanceof AuthError) {
      return {
        response: { success: false, error: { code: err.code, message: err.message } },
        status: err.statusCode,
      };
    }
    console.error("[MediaController]", err);
    return {
      response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      status: 500,
    };
  }
}

export const mediaController = new MediaController();
