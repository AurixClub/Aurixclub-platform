import { NextRequest, NextResponse } from "next/server";
import { projectController } from "@aurix/backend";
import { authService } from "@aurix/backend";
import { cookies } from "next/headers";

export async function GET() {
  const { response, status } = await projectController.getAllProjects();
  return NextResponse.json(response, { status });
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aurix_session")?.value;
    const { user } = await authService.getSession(token);

    if (!user || user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Super Admin access required." } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { response, status } = await projectController.createProject(body);
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("API POST /projects error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
