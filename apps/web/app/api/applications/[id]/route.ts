import { NextRequest, NextResponse } from "next/server";
import { applicationController } from "@aurix/backend";

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

/**
 * GET /api/applications/:id
 * Super Admin only.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { response, status } = await applicationController.handleGetById(getToken(req), id);
  return NextResponse.json(response, { status });
}

/**
 * PATCH /api/applications/:id
 * Super Admin only — review (approve / reject / waitlist).
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { response, status } = await applicationController.handleReview(
      getToken(req),
      id,
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

/**
 * DELETE /api/applications/:id
 * Super Admin only.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { response, status } = await applicationController.handleDelete(getToken(req), id);
  return NextResponse.json(response, { status });
}
