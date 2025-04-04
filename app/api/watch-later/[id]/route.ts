import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// API để xóa một mục khỏi danh sách xem sau
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // ID của record WatchLater
    
    // Lấy thông tin người dùng đang đăng nhập từ session
    const session = await getServerSession(authOptions);
    
    // Kiểm tra nếu không có session (chưa đăng nhập)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để sử dụng chức năng này' },
        { status: 401 }
      );
    }

    // Tìm user dựa trên email trong session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Kiểm tra xem mục này có tồn tại và thuộc về user không
    const watchLaterItem = await prisma.watchLater.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!watchLaterItem) {
      return NextResponse.json(
        { error: 'Không tìm thấy mục trong danh sách xem sau hoặc bạn không có quyền xóa' },
        { status: 404 }
      );
    }

    // Xóa mục khỏi danh sách xem sau
    await prisma.watchLater.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'Đã xóa khỏi danh sách xem sau' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi khi xóa khỏi danh sách xem sau:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa khỏi danh sách xem sau' },
      { status: 500 }
    );
  }
}