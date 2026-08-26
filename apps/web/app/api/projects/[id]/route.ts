import { NextRequest, NextResponse } from "next/server";
import { projectController } from "@aurix/backend";
import { authService } from "@aurix/backend";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const { response, status } = await projectController.updateProject(id, body);
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("API PATCH /projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("aurix_session")?.value;
    const { user } = await authService.getSession(token);

    if (!user || user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized. Super Admin access required." } },
        { status: 403 }
      );
    }

    const { response, status } = await projectController.deleteProject(id);
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("API DELETE /projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
