import type { UserRole } from "@aurix/types";
import { authService, ForbiddenError, UnauthorizedError } from "./auth.service";
import type { AuthUserRecord } from "../models/auth.model";

/**
 * Reusable Authorization Guards
 * Ensures endpoint requests are authenticated and checks role permissions
 */

export async function requireAuth(token: string | undefined): Promise<AuthUserRecord> {
  if (!token) {
    throw new UnauthorizedError("Authentication required to access this resource");
  }
  return await authService.verifyUser(token);
}

export async function requireRole(
  token: string | undefined,
  ...allowedRoles: UserRole[]
): Promise<AuthUserRecord> {
  const user = await requireAuth(token);

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(
      `Access denied. Requires one of [${allowedRoles.join(", ")}], but user has role '${user.role}'`
    );
  }

  return user;
}

/**
 * Helper to extract session token from standard headers or cookie strings
 */
export function extractTokenFromRequest(
  cookieValueOrHeader: string | undefined,
  authHeader: string | undefined
): string | undefined {
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  if (cookieValueOrHeader) {
    if (cookieValueOrHeader.includes("aurix_session=")) {
      const match = cookieValueOrHeader.match(/aurix_session=([^;]+)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    } else {
      return cookieValueOrHeader.trim();
    }
  }

  return undefined;
}
