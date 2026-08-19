import { NextRequest, NextResponse } from "next/server";
import { applicationController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * GET /api/applications/my
 * Authenticated member — returns their own submitted applications.
 */
export async function GET(req: NextRequest) {
  const { response, status } = await applicationController.handleGetMy(getToken(req));
  return NextResponse.json(response, { status });
}
