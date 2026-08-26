import { NextResponse } from "next/server";
import { announcementController } from "@aurix/backend/controllers/announcement.controller";

export async function GET() {
  try {
    const active = await announcementController.getActive();
    return NextResponse.json({ active });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
