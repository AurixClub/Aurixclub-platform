import { NextRequest, NextResponse } from "next/server";
import { programController } from "@aurix/backend";

interface RouteParams { params: Promise<{ id: string }> }

function getToken(req: NextRequest): string | undefined {
  return req.cookies.get("aurix_session")?.value || req.headers.get("authorization")?.replace("Bearer ", "") || undefined;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { response, status } = await programController.handleGetById(getToken(req), id);
  return NextResponse.json(response, { status });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { response, status } = await programController.handleUpdate(getToken(req), id, body);
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json({ success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { response, status } = await programController.handleDelete(getToken(req), id);
  return NextResponse.json(response, { status });
}
