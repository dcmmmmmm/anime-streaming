import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      );
    }

    const animeId = params.id;
    const userId = session.user.id;

    // Kiểm tra xem anime có tồn tại không
    const anime = await prisma.anime.findUnique({
      where: { id: animeId },
    });

    if (!anime) {
      return NextResponse.json(
        { error: "Không tìm thấy anime" },
        { status: 404 }
      );
    }

    // Tạo hoặc cập nhật lượt xem
    await prisma.animeView.upsert({
      where: {
        animeId_userId: {
          animeId,
          userId,
        },
      },
      create: {
        animeId,
        userId,
      },
      update: {}, // Không cần cập nhật gì vì chỉ cần đảm bảo có một bản ghi
    });

    // Cập nhật tổng lượt xem của anime
    const totalViews = await prisma.animeView.count({
      where: { animeId },
    });

    await prisma.anime.update({
      where: { id: animeId },
      data: { views: totalViews },
    });

    return NextResponse.json({
      message: "Cập nhật lượt xem thành công",
      totalViews,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật lượt xem:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật lượt xem" },
      { status: 500 }
    );
  }
}

