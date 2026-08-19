import { NextRequest, NextResponse } from "next/server";
import { authController, extractTokenFromRequest } from "@aurix/backend";

export async function POST(req: NextRequest) {
  const token =
    req.cookies.get("aurix_session")?.value ||
    extractTokenFromRequest(
      req.headers.get("cookie") || undefined,
      req.headers.get("authorization") || undefined
    );

  const { response, status } = await authController.handleLogout(token);
  const res = NextResponse.json(response, { status });

  // Clear cookie
  res.cookies.set("aurix_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
