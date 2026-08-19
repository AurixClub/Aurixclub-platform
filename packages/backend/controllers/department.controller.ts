import { ZodError } from "zod";
import { requireAuth, requireRole } from "../services/auth.guard";
import { departmentService, DepartmentNotFoundError, DuplicateDepartmentError } from "../services/department.service";
import { AuthError } from "../services/auth.service";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  addDepartmentMemberSchema,
} from "../validators/department.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class DepartmentController {
  /**
   * GET /api/departments
   * Unauthenticated: active departments only.
   * Super Admin: all departments (including inactive).
   */
  async handleList(token: string | undefined): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try {
        await requireRole(token, "super_admin");
        forAdmin = true;
      } catch {
        // Not admin — show only active departments
      }

      const departments = await departmentService.list({ forAdmin });
      return {
        response: { success: true, data: { departments } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * GET /api/departments/:id
   * Authenticated users only.
   */
  async handleGetById(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireAuth(token);
      const department = await departmentService.getById(id);
      return {
        response: { success: true, data: { department } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/departments
   * Super Admin only.
   */
  async handleCreate(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = createDepartmentSchema.parse(body);
      const department = await departmentService.create(input);
      return {
        response: { success: true, data: { department } },
        status: 201,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * PATCH /api/departments/:id
   * Super Admin only.
   */
  async handleUpdate(
    token: string | undefined,
    id: string,
    body: unknown
  ): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updateDepartmentSchema.parse(body);
      const department = await departmentService.update(id, input);
      return {
        response: { success: true, data: { department } },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * DELETE /api/departments/:id
   * Super Admin only.
   */
  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await departmentService.delete(id);
      return {
        response: { success: true, message: "Department deleted successfully" },
        status: 200,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * POST /api/departments/members
   * Add a Member / Lead / Co-Lead to a Department (Super Admin only).
   */
  async handleAddMember(
    token: string | undefined,
    body: unknown
  ): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      // SECURITY: Proper Zod validation instead of `body as any` (VULN-09)
      const input = addDepartmentMemberSchema.parse(body);
      const member = await departmentService.addMember(input.department_id, {
        name: input.name,
        role: input.role || "Member",
        description: input.description || null,
        avatar_url: input.avatar_url || null,
        email: input.email || null,
      });
      return {
        response: { success: true, data: { member } },
        status: 201,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * DELETE /api/departments/members/:memberId
   * Remove a member/lead from a department (Super Admin only).
   */
  async handleRemoveMember(
    token: string | undefined,
    memberId: string
  ): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await departmentService.removeMember(memberId);
      return {
        response: { success: true, message: "Member removed from department successfully" },
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
      err instanceof DepartmentNotFoundError ||
      err instanceof DuplicateDepartmentError ||
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

    console.error("[DepartmentController] Unhandled error:", err);
    return {
      response: {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
      },
      status: 500,
    };
  }
}

export const departmentController = new DepartmentController();
