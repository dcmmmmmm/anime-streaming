import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const episode = await prisma.episode.findUnique({
      where: { 
        slug: params.slug 
      },
      include: {
        anime: {
          include: {
            episodes: {
              orderBy: {
                number: 'asc'
              }
            }
          }
        }
      }
    });

    if (!episode) {
      return NextResponse.json(
        { error: "Không tìm thấy tập phim này" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(episode);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}