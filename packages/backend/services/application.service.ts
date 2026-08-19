import type { JoinApplication, ApplicationStatus } from "@aurix/types";
import { applicationModel } from "../models/application.model";
import { AuthError } from "./auth.service";
import type { CreateApplicationInput, ReviewApplicationInput } from "../validators/application.validator";

export class ApplicationNotFoundError extends AuthError {
  constructor(id: string) {
    super(`Application '${id}' not found`, "APPLICATION_NOT_FOUND", 404);
  }
}

export class DuplicateApplicationError extends AuthError {
  constructor(email: string) {
    super(
      `A pending or approved application already exists for '${email}'`,
      "APPLICATION_EXISTS",
      409
    );
  }
}

class ApplicationService {
  /**
   * List all applications. Super Admin only.
   * Supports filtering by status and search query.
   */
  async list(filters?: {
    status?: ApplicationStatus;
    search?: string;
  }): Promise<JoinApplication[]> {
    const records = await applicationModel.list(filters);
    return records.map((r) => applicationModel.toDTO(r));
  }

  /**
   * Get own applications for a logged-in member.
   */
  async getMyApplications(userId: string): Promise<JoinApplication[]> {
    const records = await applicationModel.findByUserId(userId);
    return records.map((r) => applicationModel.toDTO(r));
  }

  /**
   * Get a single application by ID. Super Admin only.
   */
  async getById(id: string): Promise<JoinApplication> {
    const record = await applicationModel.findById(id);
    if (!record) throw new ApplicationNotFoundError(id);
    return applicationModel.toDTO(record);
  }

  /**
   * Submit a new join application.
   * Prevents duplicate pending/approved applications from the same email.
   */
  async submit(
    input: CreateApplicationInput,
    userId: string | null
  ): Promise<JoinApplication> {
    // Check for duplicate active application by email
    const existing = await applicationModel.list({ email: input.email });
    const activeExists = existing.some(
      (a) => a.status === "pending" || a.status === "approved"
    );
    if (activeExists) {
      throw new DuplicateApplicationError(input.email);
    }

    const created = await applicationModel.create({
      user_id: userId,
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      college: input.college,
      branch: input.branch,
      year: input.year,
      department_interests: input.department_interests,
      why_join: input.why_join,
      skills: input.skills ?? null,
      portfolio_url: input.portfolio_url ?? null,
      github_url: input.github_url ?? null,
      linkedin_url: input.linkedin_url ?? null,
    });

    return applicationModel.toDTO(created);
  }

  /**
   * Review an application (approve/reject/waitlist). Super Admin only.
   */
  async review(
    id: string,
    input: ReviewApplicationInput,
    reviewedById: string
  ): Promise<JoinApplication> {
    const existing = await applicationModel.findById(id);
    if (!existing) throw new ApplicationNotFoundError(id);

    const updated = await applicationModel.review(id, {
      status: input.status,
      admin_notes: input.admin_notes ?? null,
      reviewed_by: reviewedById,
    });

    if (!updated) throw new ApplicationNotFoundError(id);
    return applicationModel.toDTO(updated);
  }

  /**
   * Delete an application. Super Admin only.
   */
  async delete(id: string): Promise<void> {
    const existing = await applicationModel.findById(id);
    if (!existing) throw new ApplicationNotFoundError(id);
    await applicationModel.delete(id);
  }
}

export const applicationService = new ApplicationService();
