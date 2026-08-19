import { NextRequest, NextResponse } from "next/server";
import { mediaController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * GET /api/media
 * Super Admin only: list uploaded media items with category and search filter.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { response, status } = await mediaController.handleList(getToken(req), {
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
  });
  return NextResponse.json(response, { status });
}

/**
 * POST /api/media
 * Super Admin only: record an uploaded media item.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { response, status } = await mediaController.handleCreate(getToken(req), body);
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
