import { NextRequest, NextResponse } from "next/server";
import { eventController } from "@aurix/backend";

interface RouteParams {
  params: Promise<{ id: string; regId: string }>;
}

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/** PATCH /api/events/:id/registrations/:regId — Super Admin only: mark attended/cancel. */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, regId } = await params;
    const body = await req.json();
    const { response, status } = await eventController.handleUpdateRegistration(
      getToken(req),
      id,
      regId,
      body
    );
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
