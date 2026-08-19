import { NextRequest, NextResponse } from "next/server";
import { profileController, extractTokenFromRequest } from "@aurix/backend";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("aurix_session")?.value ||
    extractTokenFromRequest(
      req.headers.get("cookie") || undefined,
      req.headers.get("authorization") || undefined
    );

  const searchParams = req.nextUrl.searchParams;
  const filters = {
    search: searchParams.get("search") || undefined,
    role: searchParams.get("role") || undefined,
    is_active: searchParams.get("is_active") || undefined,
  };

  const { response, status } = await profileController.handleListMembers(token, filters);
  return NextResponse.json(response, { status });
}
