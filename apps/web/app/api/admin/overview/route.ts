import { NextRequest, NextResponse } from "next/server";
import { adminController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * GET /api/admin/overview
 * Super Admin only: aggregated analytics, counts, and recent submissions.
 */
export async function GET(req: NextRequest) {
  const { response, status } = await adminController.handleOverview(getToken(req));
  return NextResponse.json(response, { status });
}
