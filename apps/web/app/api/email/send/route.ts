import { NextRequest, NextResponse } from "next/server";
import { emailController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * POST /api/email/send
 * Super Admin only: dispatch an email broadcast/campaign.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { response, status } = await emailController.handleSend(getToken(req), body);
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
