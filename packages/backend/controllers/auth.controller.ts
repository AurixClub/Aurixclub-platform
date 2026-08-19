import { ZodError } from "zod";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import { authService, AuthError } from "../services/auth.service";
import { createSuccessResponse, createErrorResponse, type ControllerResponse } from "./index";
import type { UserRole } from "@aurix/types";

export interface SignupResponseData {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
}

export interface LoginResponseData {
  user: {
    id: string;
    email: string;
    role: UserRole;
    full_name?: string;
  };
  redirect: string;
}

export interface SessionResponseData {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    role: UserRole;
    full_name?: string;
  } | null;
}

export class AuthController {
  /**
   * Handle user signup (POST /api/auth/signup) -> 201 or 400/409
   */
  async handleSignup(body: unknown): Promise<{
    response: ControllerResponse<SignupResponseData>;
    status: number;
    token?: string;
  }> {
    try {
      const validatedInput = signupSchema.parse(body);
      const { user, token } = await authService.signup(validatedInput);
      return {
        response: createSuccessResponse({ user }),
        status: 201,
        token,
      };
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return {
          response: createErrorResponse(
            err.errors[0]?.message || "Invalid signup details",
            "VALIDATION_ERROR",
            err.errors
          ),
          status: 400,
        };
      }
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      const message = err instanceof Error ? err.message : "Signup failed";
      return {
        response: createErrorResponse(message, "SIGNUP_FAILED"),
        status: 400,
      };
    }
  }

  /**
   * Handle user login (POST /api/auth/login) -> 200 or 400/401/403
   */
  async handleLogin(body: unknown): Promise<{
    response: ControllerResponse<LoginResponseData>;
    status: number;
    token?: string;
  }> {
    try {
      const validatedInput = loginSchema.parse(body);
      const { user, redirect, token } = await authService.login(validatedInput);
      return {
        response: createSuccessResponse({ user, redirect }),
        status: 200,
        token,
      };
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return {
          response: createErrorResponse(
            err.errors[0]?.message || "Invalid login credentials",
            "VALIDATION_ERROR",
            err.errors
          ),
          status: 400,
        };
      }
      if (err instanceof AuthError) {
        return {
          response: createErrorResponse(err.message, err.code),
          status: err.statusCode,
        };
      }
      const message = err instanceof Error ? err.message : "Login failed";
      return {
        response: createErrorResponse(message, "AUTH_FAILED"),
        status: 401,
      };
    }
  }

  /**
   * Handle get active session (GET /api/auth/session) -> 200
   */
  async handleSession(token: string | undefined): Promise<{
    response: ControllerResponse<SessionResponseData>;
    status: number;
  }> {
    try {
      const sessionData = await authService.getSession(token);
      return {
        response: createSuccessResponse(sessionData),
        status: 200,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to retrieve session";
      return {
        response: createErrorResponse(message, "SESSION_ERROR"),
        status: 500,
      };
    }
  }

  /**
   * Handle user logout (POST /api/auth/logout) -> 200
   */
  async handleLogout(token: string | undefined): Promise<{
    response: { success: boolean; message: string };
    status: number;
  }> {
    await authService.logout(token);
    return {
      response: {
        success: true,
        message: "Logged out successfully",
      },
      status: 200,
    };
  }
}

export const authController = new AuthController();
