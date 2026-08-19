import { NextRequest, NextResponse } from "next/server";
import { authController, extractTokenFromRequest } from "@aurix/backend";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("aurix_session")?.value ||
    extractTokenFromRequest(
      req.headers.get("cookie") || undefined,
      req.headers.get("authorization") || undefined
    );

  const { response, status } = await authController.handleSession(token);
  return NextResponse.json(response, { status });
}
