import type { TeamMember } from "@aurix/types";
import { teamModel } from "../models/team.model";
import { AuthError } from "./auth.service";
import type { CreateTeamMemberInput, UpdateTeamMemberInput } from "../validators/team.validator";

export class TeamMemberNotFoundError extends AuthError {
  constructor(id: string) { super(`Team member '${id}' not found`, "TEAM_MEMBER_NOT_FOUND", 404); }
}

class TeamService {
  async list(options: { forAdmin?: boolean; department_id?: string } = {}): Promise<TeamMember[]> {
    const records = await teamModel.list({ forAdmin: options.forAdmin, department_id: options.department_id });
    return records.map(r => teamModel.toDTO(r));
  }

  async getById(id: string, forAdmin = false): Promise<TeamMember> {
    const record = await teamModel.findById(id);
    if (!record) throw new TeamMemberNotFoundError(id);
    if (!forAdmin && !record.is_visible) throw new TeamMemberNotFoundError(id);
    return teamModel.toDTO(record);
  }

  async create(input: CreateTeamMemberInput): Promise<TeamMember> {
    const created = await teamModel.create({
      user_id: input.user_id ?? null,
      full_name: input.full_name,
      designation: input.designation,
      department_id: input.department_id ?? null,
      avatar_url: input.avatar_url ?? null,
      bio: input.bio ?? null,
      github_url: input.github_url ?? null,
      linkedin_url: input.linkedin_url ?? null,
      display_order: input.display_order,
      joined_year: input.joined_year ?? null,
    });
    return teamModel.toDTO(created);
  }

  async update(id: string, input: UpdateTeamMemberInput): Promise<TeamMember> {
    const existing = await teamModel.findById(id);
    if (!existing) throw new TeamMemberNotFoundError(id);
    const updated = await teamModel.update(id, {
      ...(input.full_name !== undefined && { full_name: input.full_name }),
      ...(input.designation !== undefined && { designation: input.designation }),
      ...(input.department_id !== undefined && { department_id: input.department_id }),
      ...(input.avatar_url !== undefined && { avatar_url: input.avatar_url }),
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.github_url !== undefined && { github_url: input.github_url }),
      ...(input.linkedin_url !== undefined && { linkedin_url: input.linkedin_url }),
      ...(input.display_order !== undefined && { display_order: input.display_order }),
      ...(input.is_visible !== undefined && { is_visible: input.is_visible }),
      ...(input.joined_year !== undefined && { joined_year: input.joined_year }),
    });
    if (!updated) throw new TeamMemberNotFoundError(id);
    return teamModel.toDTO(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await teamModel.findById(id);
    if (!existing) throw new TeamMemberNotFoundError(id);
    await teamModel.delete(id);
  }
}

export const teamService = new TeamService();
