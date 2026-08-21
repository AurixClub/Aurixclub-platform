import type { UserProfile, UserRole } from "@aurix/types";
import { passwordService } from "../services/password.service";

function getSeedAdminPassword(): string {
  const configuredPassword = process.env.ADMIN_SEED_PASSWORD?.trim();
  if (configuredPassword) return configuredPassword;

  // Never allow a predictable credential in a production deployment.
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SEED_PASSWORD must be configured in production");
  }

  return "Aurixclub@123";
}

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string | null;
  college: string | null;
  branch: string | null;
  year: number | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class MockUserStore {
  private users: Map<string, UserRecord> = new Map();
  private isInitialized = false;

  public async ensureInitialized() {
    if (this.isInitialized) return;

    // Super Admin Credentials
    const seedAdminPassword = getSeedAdminPassword();
    const defaultAdminHash = await passwordService.hash(seedAdminPassword);

    const initialUsers: UserRecord[] = [
      {
        id: "admin_aurix_001",
        email: "aurixclub.drait@gmail.com",
        password_hash: defaultAdminHash,
        full_name: "AURIX Super Admin",
        phone: "+91 98765 43210",
        college: "Dr. Ambedkar Institute of Technology",
        branch: "Computer Science & Engineering",
        year: 4,
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        bio: "Founding Super Administrator of AURIX club.",
        role: "super_admin",
        department_id: "dept_tech_01",
        is_active: true,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    ];

    this.users.clear();
    for (const u of initialUsers) {
      this.users.set(u.id, u);
    }
    this.isInitialized = true;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    await this.ensureInitialized();
    const normalizedEmail = email.trim().toLowerCase();

    // Ensure Super Admin aurixclub.drait@gmail.com is always up-to-date
    if (normalizedEmail === "aurixclub.drait@gmail.com") {
      const seedAdminPassword = getSeedAdminPassword();
      const adminHash = await passwordService.hash(seedAdminPassword);
      const adminUser: UserRecord = {
        id: "admin_aurix_001",
        email: "aurixclub.drait@gmail.com",
        password_hash: adminHash,
        full_name: "AURIX Super Admin",
        phone: "+91 98765 43210",
        college: "Dr. Ambedkar Institute of Technology",
        branch: "Computer Science & Engineering",
        year: 4,
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        bio: "Founding Super Administrator of AURIX club.",
        role: "super_admin",
        department_id: "dept_tech_01",
        is_active: true,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      };
      this.users.set(adminUser.id, adminUser);
      return { ...adminUser };
    }

    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return { ...user };
      }
    }
    return null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    await this.ensureInitialized();
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async create(userData: {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string | null;
    college?: string | null;
    branch?: string | null;
    year?: number | null;
    avatar_url?: string | null;
    bio?: string | null;
    role?: UserRole;
    department_id?: string | null;
    is_active?: boolean;
  }): Promise<UserRecord> {
    await this.ensureInitialized();
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newUser: UserRecord = {
      id,
      email: userData.email.trim().toLowerCase(),
      password_hash: userData.password_hash,
      full_name: userData.full_name.trim(),
      phone: userData.phone || null,
      college: userData.college || null,
      branch: userData.branch || null,
      year: userData.year !== undefined ? userData.year : null,
      avatar_url: userData.avatar_url || null,
      bio: userData.bio || null,
      role: userData.role || "member",
      department_id: userData.department_id || null,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
      created_at: now,
      updated_at: now,
    };

    this.users.set(id, newUser);
    return { ...newUser };
  }

  async update(id: string, partial: Partial<Omit<UserRecord, "id" | "email" | "created_at">>): Promise<UserRecord | null> {
    await this.ensureInitialized();
    const existing = this.users.get(id);
    if (!existing) return null;

    const updated: UserRecord = {
      ...existing,
      ...partial,
      updated_at: new Date().toISOString(),
    };

    this.users.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.users.delete(id);
  }

  async list(filters?: {
    search?: string;
    role?: UserRole;
    is_active?: boolean;
    department_id?: string;
  }): Promise<UserRecord[]> {
    await this.ensureInitialized();
    let records = Array.from(this.users.values());

    if (filters?.role) {
      records = records.filter((u) => u.role === filters.role);
    }

    if (filters?.is_active !== undefined) {
      records = records.filter((u) => u.is_active === filters.is_active);
    }

    if (filters?.department_id) {
      records = records.filter((u) => u.department_id === filters.department_id);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (u) =>
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.college && u.college.toLowerCase().includes(q)) ||
          (u.branch && u.branch.toLowerCase().includes(q))
      );
    }

    return records.map((u) => ({ ...u }));
  }

  toProfile(record: UserRecord): UserProfile {
    return {
      id: record.id,
      email: record.email,
      full_name: record.full_name,
      phone: record.phone,
      college: record.college,
      branch: record.branch,
      year: record.year,
      avatar_url: record.avatar_url,
      bio: record.bio,
      role: record.role,
      department_id: record.department_id,
      is_active: record.is_active,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  async reset(): Promise<void> {
    this.isInitialized = false;
    await this.ensureInitialized();
  }
}

const globalForStore = globalThis as unknown as {
  mockUserStore: MockUserStore | undefined;
};

export const userStore = globalForStore.mockUserStore ?? new MockUserStore();
if (process.env.NODE_ENV !== "production") {
  globalForStore.mockUserStore = userStore;
}

export const profileModel = userStore;
export const authModel = userStore;
export type AuthUserRecord = UserRecord;
