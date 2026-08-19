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

/** POST /api/events/:id/register — Authenticated member registers for an event. */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { response, status } = await eventController.handleRegister(getToken(req), id);
  return NextResponse.json(response, { status });
}
