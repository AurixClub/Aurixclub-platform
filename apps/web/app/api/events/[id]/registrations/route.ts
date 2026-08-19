import { NextRequest, NextResponse } from "next/server";
import { eventController } from "@aurix/backend";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/** GET /api/events/:id/registrations — Super Admin only: view all registrations. */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { response, status } = await eventController.handleGetRegistrations(getToken(req), id);
  return NextResponse.json(response, { status });
}
