export * from "./auth.controller";
export * from "./profile.controller";
export * from "./department.controller";
export * from "./application.controller";
export * from "./event.controller";
export * from "./program.controller";
export * from "./post.controller";
export * from "./team.controller";
export * from "./media.controller";
export * from "./email.controller";
export * from "./admin.controller";

// Controller Layer signatures - request/response mapping & input validation only
export interface ControllerResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function createSuccessResponse<T>(data: T): ControllerResponse<T> {
  return { success: true, data };
}

export function createErrorResponse(message: string, code = "BAD_REQUEST", details?: unknown): ControllerResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}
