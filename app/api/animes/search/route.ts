export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({ message: "Vui lòng nhập từ khóa tìm kiếm" }, { status: 400 });
    }

    // Lấy tổng số kết quả
    const total = await prisma.anime.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { exTitle: { contains: query, mode: 'insensitive' } }
        ],
        NOT: {
          imageUrl: null
        }
      }
    });

    const animes = await prisma.anime.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { exTitle: { contains: query, mode: 'insensitive' } }
        ],
        NOT: {
          imageUrl: null
        }
      },
      distinct: ['id'],
      include: {
        animeGenres: {
          include: {
            genre: true
          }
        },
        episodes: true,
        ratings: true
      },
      orderBy: {
        views: 'desc'
      },
      skip,
      take: limit
    });

    const uniqueAnimes = new Map();

    animes.forEach(anime => {
      if (!uniqueAnimes.has(anime.id)) {
        uniqueAnimes.set(anime.id, {
          id: anime.id,
          title: anime.title,
          exTitle: anime.exTitle,
          slug: anime.slug,
          imageUrl: anime.imageUrl,
          description: anime.description,
          totalEpisode: anime.totalEpisode,
          releaseYear: anime.releaseYear,
          status: anime.status,
          views: anime.views,
          genres: anime.animeGenres.map(g => ({
            id: g.genre.id,
            name: g.genre.name,
            slug: g.genre.name.toLowerCase().replace(/\s+/g, '-')
          })),
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
          }))
        });
      }
    });

    const formattedAnimes = Array.from(uniqueAnimes.values());

    return NextResponse.json({
      animes: formattedAnimes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error("Lỗi khi tìm kiếm anime:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi tìm kiếm anime" },
      { status: 500 }
    );
  }
} 