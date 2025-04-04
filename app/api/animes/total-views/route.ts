import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Lấy tất cả anime và tính tổng lượt xem
    const animes = await prisma.anime.findMany({
      select: {
        views: true
      }
    });

    // Tính tổng lượt xem
    const totalViews = animes.reduce((sum, anime) => sum + (anime.views || 0), 0);

    return NextResponse.json({ totalViews });
  } catch (error) {
    console.error("Lỗi khi lấy tổng lượt xem:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy tổng lượt xem" },
      { status: 500 }
    );
  }
} 