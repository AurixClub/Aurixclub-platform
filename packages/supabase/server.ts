import { createServerClient, type CookieOptions } from "@supabase/ssr";

export type CookieStore = {
  get(name: string): { name: string; value: string } | undefined;
  set(options: { name: string; value: string } & CookieOptions): void;
  delete(name: string): void;
};

export function createServerSupabaseClient(cookieStore?: CookieStore) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value, ...options });
        } catch {
          // Handled for server components where cookies can only be read
        }
      },
      remove(name: string, _options: CookieOptions) {
        try {
          cookieStore?.delete(name);
        } catch {
          // Handled for server components where cookies can only be read
        }
      },
    },
  });
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Admin actions will fail.");
  }

  return createServerClient(supabaseUrl, serviceRoleKey || "placeholder-service-role-key", {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {},
    },
  });
}
