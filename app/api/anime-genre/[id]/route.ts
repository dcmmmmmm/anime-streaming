// Import các thư viện cần thiết
import { NextResponse } from "next/server";  // Dùng để tạo response API
import prisma from "@/lib/prisma";          // Client Prisma để tương tác với database

// API endpoint để lấy thông tin thể loại anime theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }    // params chứa id từ dynamic route
) {
  try {
    // Tìm kiếm thể loại anime trong database theo ID
    const animeGenre = await prisma.animeGenre.findUnique({ 
      where: { id: params.id } 
    });

    // Nếu không tìm thấy, trả về lỗi 404
    if (!animeGenre)
      return NextResponse.json(
        { error: "Không tìm thấy thể loại của Anime này" }, 
        { status: 404 }
      );

    // Trả về dữ liệu nếu tìm thấy
    return NextResponse.json(animeGenre);
  } catch (error) {
    // Xử lý lỗi kết nối database
    console.log("Kiểm tra Kết nối mạng")
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

// API endpoint để cập nhật thể loại anime
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Lấy dữ liệu từ body request
    const { animeId, genres } = await req.json();

    // Cập nhật nhiều bản ghi thể loại anime cùng lúc
    const updatedAnimeGenre = await prisma.animeGenre.updateMany({
      where: {
        id: params.id    // Điều kiện tìm kiếm theo ID
      },
      data: genres.map((genreId: string) => ({
        animeId,        // ID của anime
        genreId,        // ID của từng thể loại
      })),
    });

    // Log thông báo thành công
    console.log("Cập nhật thành công")
    console.log(updatedAnimeGenre)

    // Trả về kết quả cập nhật
    return NextResponse.json(updatedAnimeGenre);
  } catch (error) {
    // Xử lý lỗi và trả về status 500
    return NextResponse.json({ error }, { status: 500 });
  }
}

// API endpoint để xóa thể loại anime
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Thực hiện xóa bản ghi theo ID
    const deletedAnimeGenre = await prisma.animeGenre.delete({
      where: { id: params.id },
    });

    // Trả về thông tin bản ghi đã xóa
    return NextResponse.json(deletedAnimeGenre);
  } catch (error) {
    // Xử lý lỗi kết nối hoặc xóa
    console.log("Kiểm tra kết nối mạng")
    return NextResponse.json({ error }, { status: 500 });
  }
}
