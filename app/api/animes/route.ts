// app/api/anime/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Lấy tất cả anime có ảnh và sắp xếp theo lượt xem (giảm dần)
    const animes = await prisma.anime.findMany({
      where: {
        NOT: {
          imageUrl: null
        },
      },
      include: {
        animeGenres: {
          include: {
            genre: true
          }
        },
        episodes: true,
        ratings: true,
        animeViews: true
      },
      orderBy: {
        views: 'desc'
      }
    });

    // Chuyển đổi dữ liệu để phù hợp với giao diện Anime
    const formattedAnimes = animes.map(anime => ({
      id: anime.id,
      title: anime.title,
      exTitle: anime.exTitle,
      slug: anime.slug,
      imageUrl: anime.imageUrl,
      description: anime.description,
      totalEpisode: anime.totalEpisode,
      releaseYear: anime.releaseYear,
      status: anime.status,
      genres: anime.animeGenres.map(g => g.genre.name),
      episodes: anime.episodes.map(episode => ({
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        episodeNumber: episode.number,
        season: episode.season,
      })),
      ratings: anime.ratings.map(rating => ({
        id: rating.id,
        score: rating.score,
        review: rating.review,
      })),
      views: anime.animeViews.length
    }));

    return NextResponse.json(formattedAnimes);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách anime:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi lấy danh sách anime" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {title, exTitle, slug, description, totalEpisode, imageUrl, releaseYear} = await request.json();
    const anime = await prisma.anime.create({
      data: {
        title: title,
        exTitle: exTitle,
        description: description,
        imageUrl: imageUrl,
        totalEpisode: parseInt(totalEpisode),
        slug: slug,
        releaseYear: parseInt(releaseYear)
      },
      include: {
        episodes: true,
        animeGenres: { include: { genre: true } },
      },
    });
    console.log("Tạo Mới Anime Thành Công")
    console.log(anime);
    return NextResponse.json(anime, { status: 201 } );
  } catch (error) {
    console.log("Tạo Anime Thất bại")
    return NextResponse.json({ error}, { status: 500 });
  }
}
