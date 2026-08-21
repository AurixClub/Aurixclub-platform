import { NextRequest, NextResponse } from "next/server";
import { authService, verifyCsrfOrigin } from "@aurix/backend";
import { createServerSupabaseClient } from "@aurix/supabase/server";
import { z } from "zod";

const requestSchema = z.object({ access_token: z.string().min(20) });

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  if (!verifyCsrfOrigin(req.url, origin, referer)) {
    return NextResponse.json(
      { success: false, error: { code: "CSRF_REJECTED", message: "Request origin not allowed" } },
      { status: 403 }
    );
  }

  try {
    const { access_token } = requestSchema.parse(await req.json());
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error || !data.user?.email) {
      return NextResponse.json(
        { success: false, error: { code: "OAUTH_INVALID", message: "Google identity could not be verified" } },
        { status: 401 }
      );
    }

    const result = await authService.loginWithOAuth(
      data.user.email,
      String(data.user.user_metadata?.full_name || data.user.user_metadata?.name || "")
    );
    const response = NextResponse.json(
      { success: true, data: { user: result.user, redirect: result.redirect } },
      { status: 200 }
    );
    response.cookies.set("aurix_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid OAuth callback" } },
        { status: 400 }
      );
    }
    console.error("[Auth] OAuth session error:", error);
    return NextResponse.json(
      { success: false, error: { code: "OAUTH_FAILED", message: "Unable to complete Google sign-in" } },
      { status: 500 }
    );
  }
}
