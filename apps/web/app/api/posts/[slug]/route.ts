import { NextRequest, NextResponse } from "next/server";
import { postController } from "@aurix/backend";

interface RouteParams { params: Promise<{ slug: string }> }

function getToken(req: NextRequest): string | undefined {
  return req.cookies.get("aurix_session")?.value || req.headers.get("authorization")?.replace("Bearer ", "") || undefined;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const { response, status } = await postController.handleGetBySlug(getToken(req), slug);
  return NextResponse.json(response, { status });
}
