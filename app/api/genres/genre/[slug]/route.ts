import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const genreName = slug.split('-').join(' ');
    
    // Tìm thể loại theo tên
    const genre = await prisma.genre.findFirst({
      where: {
        name: {
          equals: genreName,
          mode: 'insensitive', // Tìm kiếm không phân biệt hoa thường
        },
      },
    });
    
    if (!genre) {
      return NextResponse.json(
        { error: 'Không tìm thấy thể loại' },
        { status: 404 }
      );
    }
    
    // Tìm tất cả anime thuộc thể loại này
    const animesByGenre = await prisma.animeGenre.findMany({
      where: {
        genreId: genre.id,
      },
      include: {
        anime: {
          include: {
            animeGenres: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
    });
    
    // Format dữ liệu trả về
    const formattedAnimes = animesByGenre.map((ag) => ({
      id: ag.anime.id,
      title: ag.anime.title,
      slug: ag.anime.slug,
      imageUrl: ag.anime.imageUrl,
      description: ag.anime.description,
      releaseYear: ag.anime.releaseYear,
      views: ag.anime.views,
      genres: ag.anime.animeGenres.map((ag) => ag.genre.name),
    }));
    
    return NextResponse.json({
      genre: genre,
      animes: formattedAnimes,
    });
  } catch (error) {
    console.log("Lỗi khi lấy anime theo thể loại:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}