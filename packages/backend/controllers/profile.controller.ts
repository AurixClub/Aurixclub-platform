import { ZodError } from "zod";
import type { UserProfile, UserRole } from "@aurix/types";
import { requireAuth, requireRole } from "../services/auth.guard";
import { profileService } from "../services/profile.service";
import { AuthError } from "../services/auth.service";
import {
  updateOwnProfileSchema,
  updateMemberByAdminSchema,
} from "../validators/profile.validator";
import { createSuccessResponse, createErrorResponse, type ControllerResponse } from "./index";

export class ProfileController {
  /**
   * GET /api/profile (Own Profile)
   */
  async handleGetProfile(token: string | undefined): Promise<{
    response: ControllerResponse<UserProfile>;
    status: number;
  }> {
    try {
      const user = await requireAuth(token);
      const profile = await profileService.getOwnProfile(user.id);
      return {
        response: createSuccessResponse(profile),
        status: 200,
      };
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      return {
        response: createErrorResponse("Failed to fetch profile", "SERVER_ERROR"),
        status: 500,
      };
    }
  }

  /**
   * PATCH /api/profile (Edit Own Profile)
   */
  async handleUpdateProfile(
    token: string | undefined,
    body: unknown
  ): Promise<{
    response: ControllerResponse<UserProfile>;
    status: number;
  }> {
    try {
      const user = await requireAuth(token);
      const validatedInput = updateOwnProfileSchema.parse(body);
      const updated = await profileService.updateOwnProfile(user.id, validatedInput);
      return {
        response: createSuccessResponse(updated),
        status: 200,
      };
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return {
          response: createErrorResponse(
            err.errors[0]?.message || "Invalid profile update fields",
            "VALIDATION_ERROR",
            err.errors
          ),
          status: 400,
        };
      }
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      return {
        response: createErrorResponse("Failed to update profile", "SERVER_ERROR"),
        status: 500,
      };
    }
  }

  /**
   * GET /api/members (Super Admin: List All Members)
   */
  async handleListMembers(
    token: string | undefined,
    filters?: {
      search?: string;
      role?: string;
      is_active?: string;
    }
  ): Promise<{
    response: ControllerResponse<{ members: UserProfile[]; total: number }>;
    status: number;
  }> {
    try {
      const admin = await requireRole(token, "super_admin");

      const parsedFilters = {
        search: filters?.search,
        role: (filters?.role === "super_admin" || filters?.role === "member"
          ? filters.role
          : undefined) as UserRole | undefined,
        is_active:
          filters?.is_active !== undefined
            ? filters.is_active === "true" || filters.is_active === "1"
            : undefined,
      };

      const result = await profileService.listMembers(admin.id, parsedFilters);
      return {
        response: createSuccessResponse(result),
        status: 200,
      };
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      return {
        response: createErrorResponse("Failed to list members", "SERVER_ERROR"),
        status: 500,
      };
    }
  }

  /**
   * GET /api/members/:id (Super Admin: Member Details)
   */
  async handleGetMemberById(
    token: string | undefined,
    memberId: string
  ): Promise<{
    response: ControllerResponse<UserProfile>;
    status: number;
  }> {
    try {
      const admin = await requireRole(token, "super_admin");
      const member = await profileService.getMemberById(admin.id, memberId);
      return {
        response: createSuccessResponse(member),
        status: 200,
      };
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      return {
        response: createErrorResponse("Failed to get member details", "SERVER_ERROR"),
        status: 500,
      };
    }
  }

  /**
   * PATCH /api/members/:id (Super Admin: Edit Member)
   */
  async handleUpdateMember(
    token: string | undefined,
    memberId: string,
    body: unknown
  ): Promise<{
    response: ControllerResponse<UserProfile>;
    status: number;
  }> {
    try {
      const admin = await requireRole(token, "super_admin");
      const validatedInput = updateMemberByAdminSchema.parse(body);
      const updated = await profileService.updateMemberByAdmin(
        admin.id,
        memberId,
        validatedInput
      );
      return {
        response: createSuccessResponse(updated),
        status: 200,
      };
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return {
          response: createErrorResponse(
            err.errors[0]?.message || "Invalid member update fields",
            "VALIDATION_ERROR",
            err.errors
          ),
          status: 400,
        };
      }
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      return {
        response: createErrorResponse("Failed to update member", "SERVER_ERROR"),
        status: 500,
      };
    }
  }

  /**
   * DELETE /api/members/:id (Super Admin: Delete Member)
   */
  async handleDeleteMember(
    token: string | undefined,
    memberId: string
  ): Promise<{
    response: { success: boolean; message?: string; error?: { code: string; message: string } };
    status: number;
  }> {
    try {
      const admin = await requireRole(token, "super_admin");
      const result = await profileService.deleteMemberByAdmin(admin.id, memberId);
      return {
        response: {
          success: true,
          message: result.message,
        },
        status: 200,
      };
    } catch (err: unknown) {
      if (err instanceof AuthError) {
        return {
          response: {
            success: false,
            error: { code: err.code, message: err.message },
          },
          status: err.statusCode,
        };
      }
      return {
        response: {
          success: false,
          error: { code: "SERVER_ERROR", message: "Failed to delete member" },
        },
        status: 500,
      };
    }
  }
}

export const profileController = new ProfileController();
