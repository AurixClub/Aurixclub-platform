import type { MediaItem, MediaCategory } from "@aurix/types";
import { mediaModel } from "../models/media.model";
import { AuthError } from "./auth.service";
import type { CreateMediaInput, UpdateMediaInput } from "../validators/media.validator";

export class MediaNotFoundError extends AuthError {
  constructor(id: string) {
    super(`Media item '${id}' not found`, "MEDIA_NOT_FOUND", 404);
  }
}

class MediaService {
  async list(filters?: { category?: MediaCategory; search?: string }): Promise<MediaItem[]> {
    const records = await mediaModel.list(filters);
    return records.map(r => mediaModel.toDTO(r));
  }

  async getById(id: string): Promise<MediaItem> {
    const record = await mediaModel.findById(id);
    if (!record) throw new MediaNotFoundError(id);
    return mediaModel.toDTO(record);
  }

  async create(input: CreateMediaInput, uploadedBy: string): Promise<MediaItem> {
    const created = await mediaModel.create({
      file_name: input.file_name,
      file_url: input.file_url,
      file_type: input.file_type,
      file_size_bytes: input.file_size_bytes,
      category: input.category,
      alt_text: input.alt_text ?? null,
      uploaded_by: uploadedBy,
    });
    return mediaModel.toDTO(created);
  }

  async update(id: string, input: UpdateMediaInput): Promise<MediaItem> {
    const existing = await mediaModel.findById(id);
    if (!existing) throw new MediaNotFoundError(id);
    const updated = await mediaModel.update(id, {
      ...(input.alt_text !== undefined && { alt_text: input.alt_text }),
      ...(input.category !== undefined && { category: input.category }),
    });
    if (!updated) throw new MediaNotFoundError(id);
    return mediaModel.toDTO(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await mediaModel.findById(id);
    if (!existing) throw new MediaNotFoundError(id);
    await mediaModel.delete(id);
  }
}

export const mediaService = new MediaService();
