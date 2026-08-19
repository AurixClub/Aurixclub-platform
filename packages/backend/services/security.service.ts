/**
 * SECURITY: In-memory IP-based rate limiter for authentication endpoints.
 * Prevents brute-force attacks and signup spam.
 *
 * Also includes CSRF Origin verification helper.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  constructor() {
    // Periodic cleanup of expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetAt) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request is within rate limits.
   * @returns { allowed: boolean, remaining: number, retryAfterSeconds: number }
   */
  check(
    key: string,
    maxAttempts: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      // First request or window expired — reset
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
    }

    if (entry.count >= maxAttempts) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    entry.count++;
    return { allowed: true, remaining: maxAttempts - entry.count, retryAfterSeconds: 0 };
  }

  /**
   * Reset the rate limit for a specific key (e.g., after successful login)
   */
  reset(key: string): void {
    this.store.delete(key);
  }
}

// Singleton instances preserved across Next.js HMR
const globalForRateLimiter = globalThis as unknown as {
  loginLimiter: RateLimiter | undefined;
  signupLimiter: RateLimiter | undefined;
  apiLimiter: RateLimiter | undefined;
};

/** Login rate limiter: 5 failed attempts per 15 minutes per IP */
export const loginRateLimiter =
  globalForRateLimiter.loginLimiter ?? new RateLimiter();

/** Signup rate limiter: 3 attempts per hour per IP */
export const signupRateLimiter =
  globalForRateLimiter.signupLimiter ?? new RateLimiter();

/** General API rate limiter: 100 requests per minute per IP */
export const apiRateLimiter =
  globalForRateLimiter.apiLimiter ?? new RateLimiter();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimiter.loginLimiter = loginRateLimiter;
  globalForRateLimiter.signupLimiter = signupRateLimiter;
  globalForRateLimiter.apiLimiter = apiRateLimiter;
}

/**
 * CSRF protection: Verify that the Origin or Referer header matches the application host.
 * For Next.js API routes that use `sameSite: "lax"` cookies.
 */
export function verifyCsrfOrigin(
  requestUrl: string,
  origin: string | null,
  referer: string | null
): boolean {
  try {
    const appUrl = new URL(requestUrl);
    const expectedHost = appUrl.host;

    if (origin) {
      const originUrl = new URL(origin);
      return originUrl.host === expectedHost;
    }

    if (referer) {
      const refererUrl = new URL(referer);
      return refererUrl.host === expectedHost;
    }

    // No origin or referer — could be server-to-server or curl.
    // Block by default for browser requests (which always send Origin on POST).
    return false;
  } catch {
    return false;
  }
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
