import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await prisma.user.findMany({
      where: {
        role: "ADMIN"
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi không thể lấy Được Dữ liệu Quản trị viên", error },
      { status: 500 }
    );
  }
}