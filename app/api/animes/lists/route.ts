import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface AnimeGenre {
  genre: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  id: string;
  createdAt: Date;
  updatedAt: Date;
  animeId: string;
  genreId: string;
}

interface Rating {
  id: string;
  score: number;
  userId: string;
  animeId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AnimeWithRelations {
  id: string;
  title: string;
  exTitle: string;
  slug: string;
  imageUrl: string | null;
  views: number | null;
  status: string;
  releaseYear: number;
  createdAt: Date;
  updatedAt: Date;
  animeGenres: AnimeGenre[];
  ratings?: Rating[];
}

export async function GET() {
  try {
    // Lấy 5 anime xem nhiều nhất
    const mostViewed = await prisma.anime.findMany({
      take: 5,
      orderBy: {
        views: 'desc'
      },
      include: {
        animeGenres: {
          include: {
            genre: true
          }
        }
      }
    });

    // Lấy 5 anime có rating cao nhất
    const topRated = await prisma.anime.findMany({
      take: 5,
      include: {
        ratings: true,
        animeGenres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: [
        {
          ratings: {
            _count: 'desc'
          }
        }
      ]
    });

    // Lấy 5 anime mới nhất
    const newReleases = await prisma.anime.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        animeGenres: {
          include: {
            genre: true
          }
        }
      }
    });

    // Xử lý dữ liệu trước khi trả về
    const processAnime = (anime: AnimeWithRelations) => {
      // Lấy danh sách thể loại
      const genres = anime.animeGenres.map((ag) => ag.genre.name);

      // Tính rating trung bình nếu có
      const averageRating = anime.ratings && anime.ratings.length > 0
        ? anime.ratings.reduce((acc: number, curr: Rating) => acc + curr.score, 0) / anime.ratings.length
        : 0;

      return {
        id: anime.id,
        title: anime.title,
        exTitle: anime.exTitle,
        slug: anime.slug,
        imageUrl: anime.imageUrl,
        views: anime.views || 0,
        rating: averageRating,
        genres,
        status: anime.status,
        releaseYear: anime.releaseYear
      };
    };

    return NextResponse.json({
      mostViewed: mostViewed.map(processAnime),
      topRated: topRated.map(processAnime),
      newReleases: newReleases.map(processAnime)
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách anime:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy danh sách anime' },
      { status: 500 }
    );
  }
} 