import type { Program } from "@aurix/types";
import { programModel } from "../models/program.model";
import { AuthError } from "./auth.service";
import type { CreateProgramInput, UpdateProgramInput } from "../validators/program.validator";

export class ProgramNotFoundError extends AuthError {
  constructor(id: string) { super(`Program '${id}' not found`, "PROGRAM_NOT_FOUND", 404); }
}

class ProgramService {
  async list(options: { forAdmin?: boolean; department_id?: string } = {}): Promise<Program[]> {
    const records = await programModel.list({ forAdmin: options.forAdmin, department_id: options.department_id });
    return records.map(r => programModel.toDTO(r));
  }

  async getById(id: string, forAdmin = false): Promise<Program> {
    const record = await programModel.findById(id);
    if (!record) throw new ProgramNotFoundError(id);
    if (!forAdmin && record.status !== "published") throw new ProgramNotFoundError(id);
    return programModel.toDTO(record);
  }

  async create(input: CreateProgramInput, createdBy: string): Promise<Program> {
    const created = await programModel.create({
      title: input.title, description: input.description,
      short_description: input.short_description ?? null,
      cover_image_url: input.cover_image_url ?? null,
      mode: input.mode, department_id: input.department_id ?? null,
      duration_weeks: input.duration_weeks ?? null,
      max_participants: input.max_participants ?? null,
      start_date: input.start_date ?? null, end_date: input.end_date ?? null,
      application_deadline: input.application_deadline ?? null,
      tags: input.tags ?? [], created_by: createdBy,
    });
    return programModel.toDTO(created);
  }

  async update(id: string, input: UpdateProgramInput): Promise<Program> {
    const existing = await programModel.findById(id);
    if (!existing) throw new ProgramNotFoundError(id);
    const updated = await programModel.update(id, {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.short_description !== undefined && { short_description: input.short_description }),
      ...(input.cover_image_url !== undefined && { cover_image_url: input.cover_image_url }),
      ...(input.mode !== undefined && { mode: input.mode }),
      ...(input.department_id !== undefined && { department_id: input.department_id }),
      ...(input.duration_weeks !== undefined && { duration_weeks: input.duration_weeks }),
      ...(input.max_participants !== undefined && { max_participants: input.max_participants }),
      ...(input.start_date !== undefined && { start_date: input.start_date }),
      ...(input.end_date !== undefined && { end_date: input.end_date }),
      ...(input.application_deadline !== undefined && { application_deadline: input.application_deadline }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.tags !== undefined && { tags: input.tags }),
    });
    if (!updated) throw new ProgramNotFoundError(id);
    return programModel.toDTO(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await programModel.findById(id);
    if (!existing) throw new ProgramNotFoundError(id);
    await programModel.delete(id);
  }
}

export const programService = new ProgramService();
