// Import các thư viện cần thiết
import { NextResponse } from "next/server";  // Dùng để tạo response API
import prisma from "@/lib/prisma";          // Client Prisma để tương tác với database

// API endpoint để lấy thông tin chi tiết anime theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }    // params chứa id từ dynamic route
) {
  try {
    // Tìm kiếm anime trong database theo ID kèm theo các quan hệ
    const anime = await prisma.anime.findUnique({ 
      where: { id: params.id },
      include: {
        episodes: true,  // Lấy danh sách tập phim
        animeGenres: {   // Lấy thông tin thể loại
          include: {
            genre: true, // Bao gồm chi tiết của từng thể loại
          },
        },
      },
    });

    // Nếu không tìm thấy anime, trả về lỗi 404
    if (!anime)
      return NextResponse.json({ error: "Không tìm thấy Anime" }, { status: 404 });

    // Trả về thông tin anime nếu tìm thấy
    return NextResponse.json(anime);
  } catch (error) {
    // Xử lý lỗi kết nối database
    console.log("Kiểm tra lại kết nối mạng")
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

// API endpoint để cập nhật thông tin anime
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Lấy dữ liệu từ body request
    const {
      title,      // Tên anime
      slug,       // Đường dẫn URL
      exTitle,    // Tên khác
      releasYear, // Năm phát hành
      imageUrl,   // URL ảnh poster
      description,// Mô tả
      totalEpisode,// Tổng số tập
      status      // Trạng thái phát sóng
    } = await req.json();

    // Cập nhật thông tin anime trong database
    const updatedAnime = await prisma.anime.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        exTitle,
        imageUrl,
        description,
        totalEpisode: parseInt(totalEpisode), // Chuyển đổi sang số
        releaseYear: parseInt(releasYear),    // Chuyển đổi sang số
        status,
      },
    });

    // Log thông báo thành công
    console.log("Cập nhật Anime Thành Công")
    return NextResponse.json(updatedAnime);
  } catch (error) {
    // Xử lý lỗi và trả về status 500
    return NextResponse.json({ error }, { status: 500 });
  }
}

// API endpoint để xóa anime
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Kiểm tra xem anime có tồn tại không
    const anime = await prisma.anime.findUnique({
      where: { id: params.id },
    });

    // Nếu không tìm thấy, trả về lỗi 404
    if (!anime) 
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Thực hiện xóa anime khỏi database
    const deletedAnime = await prisma.anime.delete({
      where: { id: params.id },
    });

    // Log thông báo thành công
    console.log("Xóa Thành Công")
    return NextResponse.json(deletedAnime);
  } catch (error) {
    // Xử lý lỗi kết nối hoặc xóa
    console.log("Kiểm tra kết nối mạng")
    return NextResponse.json({ error }, { status: 500 });
  }
}
