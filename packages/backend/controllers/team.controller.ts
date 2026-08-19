import { ZodError } from "zod";
import { requireRole } from "../services/auth.guard";
import { teamService, TeamMemberNotFoundError } from "../services/team.service";
import { AuthError } from "../services/auth.service";
import { createTeamMemberSchema, updateTeamMemberSchema } from "../validators/team.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class TeamController {
  async handleList(token: string | undefined, query: { department_id?: string }): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try { await requireRole(token, "super_admin"); forAdmin = true; } catch { /* not admin */ }
      const team = await teamService.list({ forAdmin, department_id: query.department_id });
      return { response: { success: true, data: { team } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleGetById(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try { await requireRole(token, "super_admin"); forAdmin = true; } catch { /* not admin */ }
      const member = await teamService.getById(id, forAdmin);
      return { response: { success: true, data: { member } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleCreate(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = createTeamMemberSchema.parse(body);
      const member = await teamService.create(input);
      return { response: { success: true, data: { member } }, status: 201 };
    } catch (err) { return this.handleError(err); }
  }

  async handleUpdate(token: string | undefined, id: string, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updateTeamMemberSchema.parse(body);
      const member = await teamService.update(id, input);
      return { response: { success: true, data: { member } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await teamService.delete(id);
      return { response: { success: true, message: "Team member removed successfully" }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  private handleError(err: unknown): HttpResponse {
    if (err instanceof ZodError) return { response: { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request data", details: err.errors } }, status: 400 };
    if (err instanceof TeamMemberNotFoundError || err instanceof AuthError) return { response: { success: false, error: { code: err.code, message: err.message } }, status: err.statusCode };
    console.error("[TeamController]", err);
    return { response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }, status: 500 };
  }
}

export const teamController = new TeamController();
