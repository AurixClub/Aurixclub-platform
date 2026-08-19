import { ZodError } from "zod";
import { requireRole } from "../services/auth.guard";
import { postService, PostNotFoundError } from "../services/post.service";
import { AuthError } from "../services/auth.service";
import { createPostSchema, updatePostSchema } from "../validators/post.validator";

type HttpResponse = { response: Record<string, unknown>; status: number };

class PostController {
  async handleList(token: string | undefined, query: { department_id?: string }): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try { await requireRole(token, "super_admin"); forAdmin = true; } catch { /* not admin */ }
      const posts = await postService.list({ forAdmin, department_id: query.department_id });
      return { response: { success: true, data: { posts } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleGetBySlug(token: string | undefined, slug: string): Promise<HttpResponse> {
    try {
      let forAdmin = false;
      try { await requireRole(token, "super_admin"); forAdmin = true; } catch { /* not admin */ }
      const post = await postService.getBySlug(slug, forAdmin);
      return { response: { success: true, data: { post } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleCreate(token: string | undefined, body: unknown): Promise<HttpResponse> {
    try {
      const admin = await requireRole(token, "super_admin");
      const input = createPostSchema.parse(body);
      const post = await postService.create(input, admin.id);
      return { response: { success: true, data: { post } }, status: 201 };
    } catch (err) { return this.handleError(err); }
  }

  async handleUpdate(token: string | undefined, id: string, body: unknown): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      const input = updatePostSchema.parse(body);
      const post = await postService.update(id, input);
      return { response: { success: true, data: { post } }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  async handleDelete(token: string | undefined, id: string): Promise<HttpResponse> {
    try {
      await requireRole(token, "super_admin");
      await postService.delete(id);
      return { response: { success: true, message: "Post deleted successfully" }, status: 200 };
    } catch (err) { return this.handleError(err); }
  }

  private handleError(err: unknown): HttpResponse {
    if (err instanceof ZodError) return { response: { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request data", details: err.errors } }, status: 400 };
    if (err instanceof PostNotFoundError || err instanceof AuthError) return { response: { success: false, error: { code: err.code, message: err.message } }, status: err.statusCode };
    console.error("[PostController]", err);
    return { response: { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }, status: 500 };
  }
}

export const postController = new PostController();
