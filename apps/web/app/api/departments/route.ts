import { NextRequest, NextResponse } from "next/server";
import { departmentController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * GET /api/departments
 * Public: active departments only.
 * Super Admin: all departments (including inactive).
 */
export async function GET(req: NextRequest) {
  const { response, status } = await departmentController.handleList(getToken(req));
  return NextResponse.json(response, { status });
}

/**
 * POST /api/departments
 * Super Admin only.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { response, status } = await departmentController.handleCreate(getToken(req), body);
    return NextResponse.json(response, { status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
}
