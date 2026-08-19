import { NextRequest, NextResponse } from "next/server";
import { requireRole, extractTokenFromRequest, AuthError } from "@aurix/backend";

/**
 * Example Admin Endpoint protected by requireRole("super_admin")
 */
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("aurix_session")?.value ||
      extractTokenFromRequest(
        req.headers.get("cookie") || undefined,
        req.headers.get("authorization") || undefined
      );

    // Enforce Super Admin authorization
    const superAdminUser = await requireRole(token, "super_admin");

    return NextResponse.json({
      success: true,
      data: {
        message: "Super Admin authorization verified successfully",
        user: {
          id: superAdminUser.id,
          email: superAdminUser.email,
          role: superAdminUser.role,
        },
      },
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: err.code, message: err.message },
        },
        { status: err.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
