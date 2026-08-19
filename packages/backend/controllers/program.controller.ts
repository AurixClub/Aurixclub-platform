import { ZodError } from "zod";
import { requireRole } from "../services/auth.guard";
import { programService, ProgramNotFoundError } from "../services/program.service";
import { AuthError } from "../services/auth.service";
import { createProgramSchema, updateProgramSchema } from "../validators/program.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class ProgramController {
  async handleList(token: string | undefined, query: { department_id?: string }): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try { await requireRole(token, "super_admin"); forAdmin = true; } catch { /* not admin */ }
      const programs = await programService.list({ forAdmin, department_id: query.department_id });
      return { response: { success: true, data: { programs } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleGetById(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try { await requireRole(token, "super_admin"); forAdmin = true; } catch { /* not admin */ }
      const program = await programService.getById(id, forAdmin);
      return { response: { success: true, data: { program } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleCreate(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      const admin = await requireRole(token, "super_admin");
      const input = createProgramSchema.parse(body);
      const program = await programService.create(input, admin.id);
      return { response: { success: true, data: { program } }, status: 201 };
    } catch (err) { return this.handleError(err); }
  }

  async handleUpdate(token: string | undefined, id: string, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updateProgramSchema.parse(body);
      const program = await programService.update(id, input);
      return { response: { success: true, data: { program } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await programService.delete(id);
      return { response: { success: true, message: "Program deleted successfully" }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  private handleError(err: unknown): HttpResponse {
    if (err instanceof ZodError) return { response: { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request data", details: err.errors } }, status: 400 };
    if (err instanceof ProgramNotFoundError || err instanceof AuthError) return { response: { success: false, error: { code: err.code, message: err.message } }, status: err.statusCode };
    console.error("[ProgramController]", err);
    return { response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }, status: 500 };
  }
}

export const programController = new ProgramController();
