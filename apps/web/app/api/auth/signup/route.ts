import { NextRequest, NextResponse } from "next/server";
import { authController, signupRateLimiter, getClientIp, verifyCsrfOrigin } from "@aurix/backend";

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

    // SECURITY: Rate limiting — 3 signups per hour per IP
    const clientIp = getClientIp(req.headers);
    const rateCheck = signupRateLimiter.check(clientIp, 3, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: `Too many signup attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          },
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();
    const { response, status, token } = await authController.handleSignup(body);

    const res = NextResponse.json(response, { status });

    if (response.success && token) {
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
