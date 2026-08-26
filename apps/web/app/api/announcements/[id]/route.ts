import { NextResponse } from "next/server";
import { announcementController } from "@aurix/backend/controllers/announcement.controller";
import { authService } from "@aurix/backend/services/auth.service";
import { cookies } from "next/headers";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const { user } = await authService.getSession(token);
    
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const result = await announcementController.update(id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const { user } = await authService.getSession(token);
    
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    await announcementController.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
