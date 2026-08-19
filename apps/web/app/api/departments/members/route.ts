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
 * POST /api/departments/members
 * Add a Lead / Co-Lead / Member to a department with name, role, description, and avatar_url.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { response, status } = await departmentController.handleAddMember(
      getToken(req),
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
