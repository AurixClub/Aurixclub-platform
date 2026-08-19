export type UserRole = "super_admin" | "member";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  createdAt: string;
}

export interface SessionData {
  user: SessionUser;
  token: string;
  isSuperAdmin: boolean;
  redirectUrl: string;
}

export interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}
