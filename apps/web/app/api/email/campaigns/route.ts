import { NextRequest, NextResponse } from "next/server";
import { emailController } from "@aurix/backend";

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("aurix_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    undefined
  );
}

/**
 * GET /api/email/campaigns
 * Super Admin only: list all sent campaigns.
 */
export async function GET(req: NextRequest) {
  const { response, status } = await emailController.handleListCampaigns(getToken(req));
  return NextResponse.json(response, { status });
}
