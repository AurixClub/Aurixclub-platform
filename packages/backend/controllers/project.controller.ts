import { projectModel } from "../models/project.model";
import type { ProjectInput } from "@aurix/types";

export class ProjectController {
  async getAllProjects() {
    try {
      const projects = await projectModel.getAll();
      return { response: { success: true, data: { projects } }, status: 200 };
    } catch (error) {
      console.error("[ProjectController] Get all projects error:", error);
      return { response: { success: false, error: { message: "Failed to fetch projects" } }, status: 500 };
    }
  }

  async createProject(input: ProjectInput) {
    try {
      const project = await projectModel.create(input);
      return { response: { success: true, data: { project } }, status: 201 };
    } catch (error) {
      console.error("[ProjectController] Create project error:", error);
      return { response: { success: false, error: { message: "Failed to create project" } }, status: 500 };
    }
  }

  async updateProject(id: string, input: Partial<ProjectInput>) {
    try {
      const project = await projectModel.update(id, input);
      return { response: { success: true, data: { project } }, status: 200 };
    } catch (error) {
      console.error("[ProjectController] Update project error:", error);
      return { response: { success: false, error: { message: "Failed to update project" } }, status: 500 };
    }
  }

  async deleteProject(id: string) {
    try {
      await projectModel.delete(id);
      return { response: { success: true, data: null }, status: 200 };
    } catch (error) {
      console.error("[ProjectController] Delete project error:", error);
      return { response: { success: false, error: { message: "Failed to delete project" } }, status: 500 };
    }
  }
}

export const projectController = new ProjectController();
