import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Đảm bảo bạn đã cấu hình NextAuth

// Get
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // tìm user theo email và trỏ đến trường mục yêu thích
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { favorites: true },
    });
    
    // Trả về mảng danh sách yêu thích
    // or you could include more details if needed.
    return NextResponse.json(user?.favorites || []);
  } catch (error: any) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Thêm anime vào favorites
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { animeId } = await req.json();
  try {
    // Cập nhật favorites: thêm animeId vào mảng (nếu chưa có)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.favorites.includes(animeId)) {
      return NextResponse.json({ message: "Already favorited" }, { status: 200 });
    }
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { favorites: { push: animeId } },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Xoá anime khỏi favorites
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { animeId } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Loại bỏ animeId khỏi favorites
    const updatedFavorites = user.favorites.filter((fav) => fav !== animeId);
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { favorites: updatedFavorites },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
