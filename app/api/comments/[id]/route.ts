// Import các thư viện và dependencies cần thiết
import { NextResponse } from "next/server";         // Xử lý response API của Next.js
import { getServerSession } from "next-auth";       // Lấy thông tin phiên đăng nhập
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Cấu hình auth
import prisma from "@/lib/prisma";                  // Client Prisma để tương tác DB

// API endpoint xóa bình luận
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }           // ID bình luận từ URL params
) {
  try {
    // Kiểm tra người dùng đã đăng nhập chưa
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Tìm bình luận trong database và lấy userId
    const comment = await prisma.comment.findUnique({
      where: { 
        id: params.id 
      },
      select: { 
        userId: true // Chỉ lấy userId để kiểm tra quyền
      }
    });

    // Kiểm tra bình luận có tồn tại không
    if (!comment) {
      return NextResponse.json(
        { message: "Bình luận không tồn tại" }, 
        { status: 404 }
      );
    }

    // Kiểm tra người dùng có quyền xóa không
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Không có quyền xóa bình luận này" }, 
        { status: 403 }
      );
    }

    // Thực hiện xóa bình luận
    await prisma.comment.delete({
      where: { id: params.id }
    });

    // Trả về thông báo thành công
    return NextResponse.json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    // Xử lý lỗi và log
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Lỗi server" }, 
      { status: 500 }
    );
  }
}

// API endpoint cập nhật bình luận
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }           // ID bình luận từ URL params
) {
  try {
    // Kiểm tra người dùng đã đăng nhập chưa
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Lấy nội dung mới từ request body
    const { content } = await req.json();
    
    // Kiểm tra nội dung có rỗng không
    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Nội dung không được để trống" }, 
        { status: 400 }
      );
    }

    // Tìm bình luận trong database
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    // Kiểm tra bình luận có tồn tại không
    if (!comment) {
      return NextResponse.json(
        { message: "Bình luận không tồn tại" }, 
        { status: 404 }
      );
    }

    // Kiểm tra người dùng có quyền sửa không
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Không có quyền sửa bình luận này" }, 
        { status: 403 }
      );
    }

    // Cập nhật bình luận với nội dung mới
    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true // Lấy thông tin user để hiển thị
          }
        }
      }
    });

    // Trả về bình luận đã cập nhật
    return NextResponse.json(updatedComment);
  } catch (error) {
    // Xử lý lỗi và log
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Lỗi server" }, 
      { status: 500 }
    );
  }
}