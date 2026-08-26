import { NextResponse } from "next/server";
import { announcementController } from "@aurix/backend/controllers/announcement.controller";
import { authService } from "@aurix/backend/services/auth.service";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const { user } = await authService.getSession(token);
    
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const announcements = await announcementController.listAll();
    return NextResponse.json(announcements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const { user } = await authService.getSession(token);
    
    if (!user || user.role !== "super_admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const result = await announcementController.create(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
