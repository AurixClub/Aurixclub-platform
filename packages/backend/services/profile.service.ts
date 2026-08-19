import type { UserProfile, UserRole } from "@aurix/types";
import { profileModel } from "../models/profile.model";
import { AuthError, ForbiddenError } from "./auth.service";
import type {
  UpdateOwnProfileInput,
  UpdateMemberByAdminInput,
} from "../validators/profile.validator";

export class NotFoundError extends AuthError {
  constructor(resource = "Member") {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

export class ProfileService {
  /**
   * Helper: verify user exists and is active
   */
  private async getActiveUser(userId: string) {
    const user = await profileModel.findById(userId);
    if (!user) {
      throw new NotFoundError("Profile");
    }
    if (!user.is_active) {
      throw new ForbiddenError("Account is inactive");
    }
    return user;
  }

  /**
   * Helper: verify requesting user is a super_admin
   */
  private async assertSuperAdmin(adminUserId: string) {
    const admin = await this.getActiveUser(adminUserId);
    if (admin.role !== "super_admin") {
      throw new ForbiddenError("Only Super Admins are permitted to perform this action");
    }
    return admin;
  }

  /**
   * Get own profile (Members & Super Admin)
   */
  async getOwnProfile(userId: string): Promise<UserProfile> {
    const user = await this.getActiveUser(userId);
    return profileModel.toProfile(user);
  }

  /**
   * Update own profile (Members & Super Admin)
   * Note: Members can ONLY update personal info (name, phone, college, branch, year, avatar, bio).
   * They cannot elevate roles, change status, or assign departments.
   */
  async updateOwnProfile(
    userId: string,
    data: UpdateOwnProfileInput
  ): Promise<UserProfile> {
    await this.getActiveUser(userId);

    const updated = await profileModel.update(userId, {
      ...(data.full_name !== undefined && { full_name: data.full_name.trim() }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.college !== undefined && { college: data.college }),
      ...(data.branch !== undefined && { branch: data.branch }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
      ...(data.bio !== undefined && { bio: data.bio }),
    });

    if (!updated) {
      throw new NotFoundError("Profile");
    }

    return profileModel.toProfile(updated);
  }

  /**
   * Super Admin: List all members with optional filters
   */
  async listMembers(
    adminUserId: string,
    filters?: {
      search?: string;
      role?: UserRole;
      is_active?: boolean;
    }
  ): Promise<{ members: UserProfile[]; total: number }> {
    await this.assertSuperAdmin(adminUserId);

    const records = await profileModel.list(filters);
    const members = records.map((r) => profileModel.toProfile(r));

    return {
      members,
      total: members.length,
    };
  }

  /**
   * Super Admin: Get single member details by ID
   */
  async getMemberById(
    adminUserId: string,
    memberId: string
  ): Promise<UserProfile> {
    await this.assertSuperAdmin(adminUserId);

    const record = await profileModel.findById(memberId);
    if (!record) {
      throw new NotFoundError("Member");
    }

    return profileModel.toProfile(record);
  }

  /**
   * Super Admin: Update member details, role, department, or active status
   */
  async updateMemberByAdmin(
    adminUserId: string,
    memberId: string,
    data: UpdateMemberByAdminInput
  ): Promise<UserProfile> {
    await this.assertSuperAdmin(adminUserId);

    const targetUser = await profileModel.findById(memberId);
    if (!targetUser) {
      throw new NotFoundError("Member");
    }

    // Safety: prevent demoting or deactivating the last active super admin
    if (
      targetUser.role === "super_admin" &&
      (data.role === "member" || data.is_active === false)
    ) {
      const allAdmins = await profileModel.list({ role: "super_admin", is_active: true });
      if (allAdmins.length <= 1 && allAdmins[0]?.id === memberId) {
        throw new ForbiddenError("Cannot demote or deactivate the last remaining Super Admin");
      }
    }

    const updated = await profileModel.update(memberId, {
      ...(data.full_name !== undefined && { full_name: data.full_name.trim() }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.college !== undefined && { college: data.college }),
      ...(data.branch !== undefined && { branch: data.branch }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.department_id !== undefined && { department_id: data.department_id }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
    });

    if (!updated) {
      throw new NotFoundError("Member");
    }

    return profileModel.toProfile(updated);
  }

  /**
   * Super Admin: Delete member by ID
   */
  async deleteMemberByAdmin(
    adminUserId: string,
    memberId: string
  ): Promise<{ message: string }> {
    await this.assertSuperAdmin(adminUserId);

    if (adminUserId === memberId) {
      throw new ForbiddenError("Super Admins cannot delete their own account");
    }

    const targetUser = await profileModel.findById(memberId);
    if (!targetUser) {
      throw new NotFoundError("Member");
    }

    await profileModel.delete(memberId);

    return {
      message: `Member '${targetUser.full_name}' (${targetUser.email}) successfully deleted`,
    };
  }
}

export const profileService = new ProfileService();
