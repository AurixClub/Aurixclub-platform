import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@aurix/supabase/server";
import { verifyCsrfOrigin } from "@aurix/backend";
import { z } from "zod";

const requestSchema = z.object({ email: z.string().email() });

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
    const body = requestSchema.parse(await req.json());
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(body.email.trim().toLowerCase(), {
      redirectTo: `${new URL(req.url).origin}/login?reset=1`,
    });
    if (error) console.error("[Auth] Password reset provider error:", error.message);

    // Do not disclose whether an account exists.
    return NextResponse.json({ success: true, data: { message: "Password reset request accepted" } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Please provide a valid email address" } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "RESET_REQUEST_FAILED", message: "Unable to process password reset" } },
      { status: 500 }
    );
  }
}
