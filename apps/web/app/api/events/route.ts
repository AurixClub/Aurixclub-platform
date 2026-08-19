import { NextRequest, NextResponse } from "next/server";
import { eventController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/** GET /api/events — Public: published. Admin: all. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { response, status } = await eventController.handleList(getToken(req), {
    department_id: searchParams.get("department_id") || undefined,
  });
  return NextResponse.json(response, { status });
}

/** POST /api/events — Super Admin only. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { response, status } = await eventController.handleCreate(getToken(req), body);
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
