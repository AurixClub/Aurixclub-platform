import { NextRequest, NextResponse } from "next/server";
import { applicationController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * GET /api/applications
 * Super Admin only — list all applications.
 * Query: ?status=pending|approved|rejected|waitlisted, ?search=...
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { response, status } = await applicationController.handleList(getToken(req), {
    status: searchParams.get("status") || undefined,
    search: searchParams.get("search") || undefined,
  });
  return NextResponse.json(response, { status });
}

/**
 * POST /api/applications
 * Authenticated member — submit a join application.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { response, status } = await applicationController.handleSubmit(getToken(req), body);
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
