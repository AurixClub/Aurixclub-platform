import { NextRequest, NextResponse } from "next/server";
import { profileController, extractTokenFromRequest } from "@aurix/backend";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const token =
    req.cookies.get("aurix_session")?.value ||
    extractTokenFromRequest(
      req.headers.get("cookie") || undefined,
      req.headers.get("authorization") || undefined
    );

  const { id } = await params;
  const { response, status } = await profileController.handleGetMemberById(token, id);

  return NextResponse.json(response, { status });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const token =
      req.cookies.get("aurix_session")?.value ||
      extractTokenFromRequest(
        req.headers.get("cookie") || undefined,
        req.headers.get("authorization") || undefined
      );

    const { id } = await params;
    const body = await req.json();

    const { response, status } = await profileController.handleUpdateMember(token, id, body);

    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_REQUEST", message: "Invalid JSON body" },
      },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const token =
    req.cookies.get("aurix_session")?.value ||
    extractTokenFromRequest(
      req.headers.get("cookie") || undefined,
      req.headers.get("authorization") || undefined
    );

  const { id } = await params;
  const { response, status } = await profileController.handleDeleteMember(token, id);

  return NextResponse.json(response, { status });
}
