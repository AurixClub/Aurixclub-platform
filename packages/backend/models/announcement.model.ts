import { createServerSupabaseClient } from "@aurix/supabase/server";

export interface AnnouncementRecord {
  id: string;
  title: string;
  message: string;
  link_url?: string | null;
  link_text?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class AnnouncementModel {
  async getActive(): Promise<AnnouncementRecord | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error (getActive announcement):", error);
      return null;
    }
    return data;
  }

  async listAll(): Promise<AnnouncementRecord[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error (list announcements):", error);
      return [];
    }
    return data || [];
  }

  async create(data: Omit<AnnouncementRecord, "id" | "created_at" | "updated_at">): Promise<AnnouncementRecord> {
    const supabase = createServerSupabaseClient();

    // If setting active, deactivate others first
    if (data.is_active) {
      await supabase.from("announcements").update({ is_active: false }).neq("id", "0"); // update all
    }

    const { data: record, error } = await supabase
      .from("announcements")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (create announcement):", error);
      throw new Error("Failed to create announcement");
    }
    return record;
  }

  async update(id: string, data: Partial<Omit<AnnouncementRecord, "id" | "created_at" | "updated_at">>): Promise<AnnouncementRecord> {
    const supabase = createServerSupabaseClient();

    if (data.is_active) {
      await supabase.from("announcements").update({ is_active: false }).neq("id", id);
    }

    const { data: record, error } = await supabase
      .from("announcements")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (update announcement):", error);
      throw new Error("Failed to update announcement");
    }
    return record;
  }
  
  async delete(id: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      console.error("Supabase Error (delete announcement):", error);
      throw new Error("Failed to delete announcement");
    }
  }
}

export const announcementModel = new AnnouncementModel();
