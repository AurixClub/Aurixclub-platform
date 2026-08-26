import { createClient } from "@aurix/supabase/server";
import type { Project, ProjectInput } from "@aurix/types";

export class ProjectModel {
  async getAll(): Promise<Project[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error (getAll Projects):", error);
      throw new Error("Failed to fetch projects");
    }

    return data || [];
  }

  async create(input: ProjectInput): Promise<Project> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (create Project):", error);
      throw new Error("Failed to create project");
    }

    return data;
  }

  async update(id: string, input: Partial<ProjectInput>): Promise<Project> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (update Project):", error);
      throw new Error("Failed to update project");
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Supabase Error (delete Project):", error);
      throw new Error("Failed to delete project");
    }
  }
}

export const projectModel = new ProjectModel();
