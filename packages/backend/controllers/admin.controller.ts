import { requireRole } from "../services/auth.guard";
import { adminService } from "../services/admin.service";
import { AuthError } from "../services/auth.service";

type HttpResponse = { response: Record<string, unknown>; status: number };

class AdminController {
  /**
   * GET /api/admin/overview
   * Super Admin only: returns aggregated statistics and summaries for dashboard.
   */
  async handleOverview(token: string | undefined): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const overview = await adminService.getOverview();
      return { response: { success: true, data: overview }, status: 200 };
    } catch (err) {
      if (err instanceof AuthError) {
        return {
          response: { success: false, error: { code: err.code, message: err.message } },
          status: err.statusCode,
        };
      }
      console.error("[AdminController]", err);
      return {
        response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
        status: 500,
      };
    }
  }
}

export const adminController = new AdminController();
