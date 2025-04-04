// app/api/visits/daily/increment/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Lấy ngày hiện tại và đặt thời gian về 00:00:00 để so sánh theo ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedVisit = await prisma.dailyVisit.upsert({
      where: { date: today },
      update: { count: { increment: 1 } },
      create: { date: today, count: 1 },
    });

    return NextResponse.json({ message: "Daily visit updated", visit: updatedVisit });
  } catch (error) {
    console.error("Error updating daily visit:", error);
    return NextResponse.json({ error: "Error updating daily visit" }, { status: 500 });
  }
}
