import type { UserRole, SessionUser } from "@aurix/types";
import { randomBytes } from "crypto";
import { profileModel, type UserRecord } from "../models/profile.model";
import { passwordService } from "./password.service";
import type { LoginInput, SignupInput } from "../validators/auth.validator";

export class AuthError extends Error {
  constructor(
    public override message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class DuplicateEmailError extends AuthError {
  constructor(email: string) {
    super(`User with email '${email}' already exists`, "EMAIL_EXISTS", 409);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = "Invalid email or password") {
    super(message, "INVALID_CREDENTIALS", 401);
  }
}

export class AccountInactiveError extends AuthError {
  constructor() {
    super("This account is inactive. Please contact an administrator.", "ACCOUNT_INACTIVE", 403);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Authentication required") {
    super(message, "UNAUTHENTICATED", 401);
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, "FORBIDDEN", 403);
  }
}

// In-memory active session tokens mapping to User IDs, preserved on globalThis across Next.js dev server
const globalForSessions = globalThis as unknown as {
  activeSessions: Map<string, { userId: string; expiresAt: number }> | undefined;
};

export const activeSessions =
  globalForSessions.activeSessions ?? new Map<string, { userId: string; expiresAt: number }>();

if (process.env.NODE_ENV !== "production") {
  globalForSessions.activeSessions = activeSessions;
}

export class AuthService {
  /** Create an application session for a verified Supabase OAuth identity. */
  async loginWithOAuth(email: string, fullName: string): Promise<{
    user: { id: string; email: string; full_name: string; role: UserRole };
    redirect: string;
    token: string;
  }> {
    const normalizedEmail = email.trim().toLowerCase();
    let user = await profileModel.findByEmail(normalizedEmail);

    if (!user) {
      const passwordHash = await passwordService.hash(randomBytes(32).toString("hex"));
      user = await profileModel.create({
        email: normalizedEmail,
        password_hash: passwordHash,
        full_name: fullName.trim() || normalizedEmail.split("@")[0] || "Member",
        role: "member",
        is_active: true,
      });
    }

    if (!user.is_active) throw new AccountInactiveError();
    const token = this.createSessionToken(user.id);
    return {
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      redirect: this.getRedirectUrl(user.role),
      token,
    };
  }

  /**
   * Helper: check if role is super_admin
   */
  isSuperAdmin(role: UserRole): boolean {
    return role === "super_admin";
  }

  /**
   * Helper: determine redirect URL based on role
   * super_admin -> /admin
   * member -> / (Home page)
   */
  getRedirectUrl(role: UserRole): string {
    return role === "super_admin" ? "/admin" : "/";
  }

  /**
   * Helper: sanitize database record into a safe SessionUser
   */
  toSessionUser(record: UserRecord): SessionUser {
    return {
      id: record.id,
      email: record.email,
      full_name: record.full_name,
      role: record.role,
      is_active: record.is_active,
      createdAt: record.created_at,
    };
  }

  /**
   * Create an in-memory session token for a user
   */
  createSessionToken(userId: string): string {
    const token = `aurix_${randomBytes(32).toString("hex")}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    activeSessions.set(token, { userId, expiresAt });
    return token;
  }

  /**
   * User Signup (Defaults to 'member' role)
   */
  async signup(input: SignupInput): Promise<{
    user: { id: string; email: string; full_name: string; role: UserRole };
    token: string;
  }> {
    const existing = await profileModel.findByEmail(input.email);
    if (existing) {
      throw new DuplicateEmailError(input.email);
    }

    const passwordHash = await passwordService.hash(input.password);

    // SECURITY: Role is ALWAYS forced to "member" on signup.
    // Super Admin accounts can only be created by existing admins.
    const createdUser = await profileModel.create({
      email: input.email,
      password_hash: passwordHash,
      full_name: input.full_name,
      phone: input.phone,
      college: input.college || "Dr. Ambedkar Institute of Technology",
      branch: input.branch,
      year: input.year,
      role: "member",
      is_active: true,
    });

    const token = this.createSessionToken(createdUser.id);

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        full_name: createdUser.full_name,
        role: createdUser.role,
      },
      token,
    };
  }

  /**
   * User Login (Redirects to /admin for super_admin, /dashboard for member)
   */
  async login(input: LoginInput): Promise<{
    user: { id: string; email: string; role: UserRole; full_name?: string };
    redirect: string;
    token: string;
  }> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const user = await profileModel.findByEmail(normalizedEmail);

    if (!user) {
      throw new InvalidCredentialsError("Invalid email or password. Please sign up if you don't have an account.");
    }

    const isMatch = await passwordService.compare(input.password, user.password_hash);
    if (!isMatch) {
      throw new InvalidCredentialsError("Invalid email or password.");
    }

    if (!user.is_active) {
      throw new AccountInactiveError();
    }

    const token = this.createSessionToken(user.id);
    const redirect = this.getRedirectUrl(user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      redirect,
      token,
    };
  }

  /**
   * Get Active Session from token
   */
  async getSession(token: string | undefined): Promise<{
    authenticated: boolean;
    user: { id: string; email: string; role: UserRole; full_name?: string } | null;
  }> {
    if (!token) {
      return { authenticated: false, user: null };
    }

    const session = activeSessions.get(token);
    if (!session) {
      return { authenticated: false, user: null };
    }

    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return { authenticated: false, user: null };
    }

    const user = await profileModel.findById(session.userId);
    if (!user || !user.is_active) {
      activeSessions.delete(token);
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  /**
   * Terminate Session (Logout)
   */
  async logout(token: string | undefined): Promise<void> {
    if (token) {
      activeSessions.delete(token);
    }
  }

  /**
   * Resolve user from token for authorization checks
   */
  async verifyUser(token: string | undefined): Promise<UserRecord> {
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      throw new UnauthorizedError("Session expired or invalid");
    }

    const user = await profileModel.findById(session.userId);
    if (!user || !user.is_active) {
      throw new AccountInactiveError();
    }

    return user;
  }
}

export const authService = new AuthService();
