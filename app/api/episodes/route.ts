// app/api/episode/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateAnimeStatus } from '@/utils/updateAnimeStatus';

export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      include: { 
        comments: true,
        anime: true,
      },
    });
    return NextResponse.json(episodes);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Không lấy được dữ liệu từ bảng Episode' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {title, slug, number, season, videoUrl, duration, animeId} = await request.json();
    const episode = await prisma.episode.create({
      data: {
        animeId: animeId,
        title: title,
        slug: slug,
        number: parseInt(number),
        season: parseInt(season),
        videoUrl: videoUrl,
        duration: parseInt(duration),
      },
      include: { anime: true },
    });
    // Cập nhật trạng thái của anime sau khi thêm tập mới
    await updateAnimeStatus(episode.animeId);
    console.log("Tạo thành công")
    return NextResponse.json(episode, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Tạo thất bại' }, { status: 500 });
  }
}
