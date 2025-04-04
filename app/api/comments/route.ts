// Import các dependencies cần thiết
import { NextResponse } from "next/server";         // Xử lý response API của Next.js
import prisma from "@/lib/prisma";                  // Prisma client để tương tác với DB
import { getServerSession } from "next-auth";       // Kiểm tra session người dùng
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Config auth

// API endpoint để tạo bình luận mới
export async function POST(req: Request) {
  try {
    // Kiểm tra xác thực người dùng
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy nội dung và ID tập phim từ request body
    const { content, episodeId } = await req.json();

    // Tạo bình luận mới trong database
    const comment = await prisma.comment.create({
      data: {
        content,          // Nội dung bình luận
        episodeId,        // ID của tập phim
        userId: session.user.id, // ID người dùng từ session
      },
      include: {
        user: {
          select: {
            name: true,     // Tên người dùng
            imageUrl: true, // Avatar người dùng
          },
        },
      },
    });

    // Trả về bình luận đã tạo
    return NextResponse.json(comment);
  } catch (error) {
    // Xử lý lỗi server
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// API endpoint để lấy danh sách bình luận
export async function GET(req: Request) {
  // Lấy episodeId từ query params
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get("episodeId");

  // Validate episodeId
  if (!episodeId) {
    return NextResponse.json({ error: "Missing episodeId" }, { status: 400 });
  }

  try {
    // Truy vấn danh sách bình luận từ database
    const comments = await prisma.comment.findMany({
      where: { episodeId },  // Lọc theo episodeId
      include: {
        user: {
          select: {
            name: true,     // Tên người bình luận
            imageUrl: true, // Avatar người bình luận
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Sắp xếp theo thời gian mới nhất
    });

    // Trả về danh sách bình luận
    return NextResponse.json(comments);
  } catch (error) {
    // Xử lý lỗi server
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}