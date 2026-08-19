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
 * DELETE /api/departments/members/:id
 * Remove a member/lead from a department.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { response, status } = await departmentController.handleRemoveMember(
    getToken(req),
    id
  );
  return NextResponse.json(response, { status });
}
