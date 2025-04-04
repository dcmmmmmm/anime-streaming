import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateAnimeStatus } from "@/utils/updateAnimeStatus";


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const episode = await prisma.episode.findUnique({ where: { id: params.id } });
    if (!episode)
      return NextResponse.json({ error: "Không tìm thấy tập có ID này" }, { status: 404 });
    return NextResponse.json(episode);
  } catch (error) {
    console.log("Kiểm tra lại kết nối mạng")
    return NextResponse.json(
      {error},
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {title, slug, season, number, videoUrl, duration, animeId} = await req.json();
    const updatedEpisode = await prisma.episode.update({
      where: { id: params.id },
      data: {
        animeId: animeId,
        title: title,
        slug: slug,
        season: parseInt(season),
        number: parseInt(number),
        videoUrl: videoUrl,
        duration: parseInt(duration),
      },
    });
    await updateAnimeStatus(updatedEpisode.animeId);
    console.log("Cập nhật Thành Công")
    return NextResponse.json(updatedEpisode, {status:200});
  } catch (error) {
    console.log("Cập nhật thất bại")
    return NextResponse.json({error},{ status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: params.id },
    });
    if (!episode) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const deletedEpisode = await prisma.episode.delete({
      where: { id: params.id },
    });

    // Cập nhật trạng thái của anime sau khi xoá tập
    await updateAnimeStatus(episode.animeId);
    console.log("Xóa Thành Công")
    return NextResponse.json(deletedEpisode);
  } catch (error) {
    console.log("Xóa Thất bại")
    return NextResponse.json({error},{ status: 500 });
  }
}
