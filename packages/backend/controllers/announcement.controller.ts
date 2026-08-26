import { announcementModel } from "../models/announcement.model";

export class AnnouncementController {
  async getActive() {
    return announcementModel.getActive();
  }

  async listAll() {
    return announcementModel.listAll();
  }

  async create(data: { title: string; message: string; link_url?: string; link_text?: string; is_active: boolean }) {
    return announcementModel.create(data);
  }

  async update(id: string, data: { title?: string; message?: string; link_url?: string; link_text?: string; is_active?: boolean }) {
    return announcementModel.update(id, data);
  }

  async delete(id: string) {
    return announcementModel.delete(id);
  }
}

export const announcementController = new AnnouncementController();
