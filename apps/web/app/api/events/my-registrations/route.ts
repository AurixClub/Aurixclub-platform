import { NextRequest, NextResponse } from "next/server";
import { eventController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/** GET /api/events/my-registrations — Authenticated member's own registrations. */
export async function GET(req: NextRequest) {
  const { response, status } = await eventController.handleGetMyRegistrations(getToken(req));
  return NextResponse.json(response, { status });
}
