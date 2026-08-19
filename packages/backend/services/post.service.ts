import type { Post } from "@aurix/types";
import { postModel } from "../models/post.model";
import { AuthError } from "./auth.service";
import type { CreatePostInput, UpdatePostInput } from "../validators/post.validator";

export class PostNotFoundError extends AuthError {
  constructor(id: string) { super(`Post '${id}' not found`, "POST_NOT_FOUND", 404); }
}

class PostService {
  async list(options: { forAdmin?: boolean; department_id?: string } = {}): Promise<Post[]> {
    const records = await postModel.list({ forAdmin: options.forAdmin, department_id: options.department_id });
    return records.map(r => postModel.toDTO(r));
  }

  async getBySlug(slug: string, forAdmin = false): Promise<Post> {
    const record = await postModel.findBySlug(slug);
    if (!record) throw new PostNotFoundError(slug);
    if (!forAdmin && record.status !== "published") throw new PostNotFoundError(slug);
    return postModel.toDTO(record);
  }

  async getById(id: string): Promise<Post> {
    const record = await postModel.findById(id);
    if (!record) throw new PostNotFoundError(id);
    return postModel.toDTO(record);
  }

  async create(input: CreatePostInput, authorId: string): Promise<Post> {
    const created = await postModel.create({
      title: input.title, content: input.content,
      excerpt: input.excerpt ?? null, cover_image_url: input.cover_image_url ?? null,
      author_id: authorId, department_id: input.department_id ?? null,
      tags: input.tags ?? [], scheduled_at: input.scheduled_at ?? null,
    });
    return postModel.toDTO(created);
  }

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const existing = await postModel.findById(id);
    if (!existing) throw new PostNotFoundError(id);
    const updated = await postModel.update(id, {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
      ...(input.cover_image_url !== undefined && { cover_image_url: input.cover_image_url }),
      ...(input.department_id !== undefined && { department_id: input.department_id }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.scheduled_at !== undefined && { scheduled_at: input.scheduled_at }),
    });
    if (!updated) throw new PostNotFoundError(id);
    return postModel.toDTO(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await postModel.findById(id);
    if (!existing) throw new PostNotFoundError(id);
    await postModel.delete(id);
  }
}

export const postService = new PostService();
