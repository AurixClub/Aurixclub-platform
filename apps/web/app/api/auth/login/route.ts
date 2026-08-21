import { NextRequest, NextResponse } from "next/server";
import { authController, loginRateLimiter, getClientIp, verifyCsrfOrigin } from "@aurix/backend";
import { createServerSupabaseClient } from "@aurix/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // SECURITY: CSRF Origin verification
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    if (!verifyCsrfOrigin(req.url, origin, referer)) {
      return NextResponse.json(
        { success: false, error: { code: "CSRF_REJECTED", message: "Request origin not allowed" } },
        { status: 403 }
      );
    }

    // SECURITY: Rate limiting — 5 attempts per 15 minutes per IP
    const clientIp = getClientIp(req.headers);
    const rateCheck = loginRateLimiter.check(clientIp, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: `Too many login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          },
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();

    // If this email belongs to Supabase Auth, enforce its confirmation state.
    // Legacy/super-admin accounts can still use the application auth store.
    const supabase = createServerSupabaseClient();
    const { error: supabaseLoginError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    if (supabaseLoginError && /confirm/i.test(supabaseLoginError.message)) {
      return NextResponse.json(
        { success: false, error: { code: "EMAIL_NOT_CONFIRMED", message: "Please confirm your email address before signing in." } },
        { status: 403 }
      );
    }
    const { response, status, token } = await authController.handleLogin(body);

    const res = NextResponse.json(response, { status });

    if (response.success && token) {
      // Reset rate limiter on successful login
      loginRateLimiter.reset(clientIp);

      res.cookies.set("aurix_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return res;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_REQUEST", message: "Invalid JSON body" },
      },
      { status: 400 }
    );
  }
}
