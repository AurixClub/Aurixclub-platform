import { NextRequest, NextResponse } from "next/server";
import { profileController, extractTokenFromRequest } from "@aurix/backend";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("aurix_session")?.value ||
    extractTokenFromRequest(
      req.headers.get("cookie") || undefined,
      req.headers.get("authorization") || undefined
    );

  const { response, status } = await profileController.handleGetProfile(token);
  return NextResponse.json(response, { status });
}

export async function PATCH(req: NextRequest) {
  try {
    const token =
      req.cookies.get("aurix_session")?.value ||
      extractTokenFromRequest(
        req.headers.get("cookie") || undefined,
        req.headers.get("authorization") || undefined
      );

    const body = await req.json();
    const { response, status } = await profileController.handleUpdateProfile(token, body);
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
