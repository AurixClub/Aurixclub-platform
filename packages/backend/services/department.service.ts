import type { Department, DepartmentMember, AddDepartmentMemberPayload } from "@aurix/types";
import { departmentModel } from "../models/department.model";
import { AuthError } from "./auth.service";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "../validators/department.validator";

export class DepartmentNotFoundError extends AuthError {
  constructor(id: string) {
    super(`Department '${id}' not found`, "DEPARTMENT_NOT_FOUND", 404);
  }
}

export class DuplicateDepartmentError extends AuthError {
  constructor(name: string) {
    super(`Department '${name}' already exists`, "DEPARTMENT_EXISTS", 409);
  }
}

class DepartmentService {
  /**
   * List departments with their assigned member/lead profiles.
   */
  async list(options: { forAdmin?: boolean } = {}): Promise<Department[]> {
    const records = await departmentModel.list(
      options.forAdmin ? undefined : { status: "active" }
    );

    return Promise.all(
      records.map(async (r) => {
        return departmentModel.toDTO(r);
      })
    );
  }

  /**
   * Get a single department by ID.
   */
  async getById(id: string): Promise<Department> {
    const record = await departmentModel.findById(id);
    if (!record) throw new DepartmentNotFoundError(id);
    return departmentModel.toDTO(record);
  }

  /**
   * Create a new department (Super Admin only).
   */
  async create(input: CreateDepartmentInput): Promise<Department> {
    const records = await departmentModel.list();
    const nameLower = input.name.trim().toLowerCase();
    const duplicate = records.find((r) => r.name.toLowerCase() === nameLower);
    if (duplicate) throw new DuplicateDepartmentError(input.name);

    const created = await departmentModel.create({
      name: input.name,
      description: input.description ?? null,
      logo_url: input.logo_url ?? null,
    });

    return departmentModel.toDTO(created);
  }

  /**
   * Update a department (Super Admin only).
   */
  async update(id: string, input: UpdateDepartmentInput): Promise<Department> {
    const existing = await departmentModel.findById(id);
    if (!existing) throw new DepartmentNotFoundError(id);

    if (input.name) {
      const records = await departmentModel.list();
      const nameLower = input.name.trim().toLowerCase();
      const duplicate = records.find(
        (r) => r.name.toLowerCase() === nameLower && r.id !== id
      );
      if (duplicate) throw new DuplicateDepartmentError(input.name);
    }

    const updated = await departmentModel.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.logo_url !== undefined && { logo_url: input.logo_url }),
      ...(input.status !== undefined && { status: input.status }),
    });

    if (!updated) throw new DepartmentNotFoundError(id);
    return departmentModel.toDTO(updated);
  }

  /**
   * Delete a department (Super Admin only).
   */
  async delete(id: string): Promise<void> {
    const existing = await departmentModel.findById(id);
    if (!existing) throw new DepartmentNotFoundError(id);
    await departmentModel.delete(id);
  }

  /**
   * Add a Member / Lead / Co-Lead to a Department (Super Admin only).
   */
  async addMember(departmentId: string, data: AddDepartmentMemberPayload): Promise<DepartmentMember> {
    const existing = await departmentModel.findById(departmentId);
    if (!existing) throw new DepartmentNotFoundError(departmentId);
    return departmentModel.addMember(departmentId, data);
  }

  /**
   * Remove a member from a department (Super Admin only).
   */
  async removeMember(memberId: string): Promise<boolean> {
    return departmentModel.removeMember(memberId);
  }

  /**
   * List members of a department.
   */
  async listMembers(departmentId?: string): Promise<DepartmentMember[]> {
    return departmentModel.listMembers(departmentId);
  }
}

export const departmentService = new DepartmentService();
