export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const skip = (page - 1) * limit;

    // Lấy tổng số anime không trùng lặp
    const uniqueAnimes = await prisma.anime.findMany({
      where: {
        NOT: {
          imageUrl: null
        }
      },
      distinct: ['id'], // Đảm bảo không trùng lặp ID
      select: {
        id: true
      }
    });

    const total = uniqueAnimes.length;

    // Lấy danh sách anime theo trang, sử dụng distinct để tránh trùng lặp
    const animes = await prisma.anime.findMany({
      where: {
        NOT: {
          imageUrl: null
        }
      },
      distinct: ['id'], // Đảm bảo không trùng lặp ID
      include: {
        animeGenres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: {
        views: 'desc'
      },
      skip,
      take: limit
    });

    // Sử dụng Map để đảm bảo không có trùng lặp
    const uniqueAnimeMap = new Map();
    animes.forEach(anime => {
      if (!uniqueAnimeMap.has(anime.id)) {
        uniqueAnimeMap.set(anime.id, {
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
          }))
        });
      }
    });

    const formattedAnimes = Array.from(uniqueAnimeMap.values());

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
    console.error("Lỗi khi lấy danh sách anime:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi lấy danh sách anime" },
      { status: 500 }
    );
  }
} 