import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const visits = await prisma.dailyVisit.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching daily visits:", error);
    return NextResponse.json({ error: "Error fetching daily visits" }, { status: 500 });
  }
}