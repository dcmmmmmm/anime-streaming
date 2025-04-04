// app/api/anime-genre/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Exporting an asynchronous POST function to handle HTTP POST requests
export async function POST(request: Request) {
  try {
    // Extracting 'animeId' and 'genres' from the JSON body of the request
    const { animeId, genres } = await request.json();

    // Validating the input: 'animeId' and 'genres' must be provided, and 'genres' cannot be empty
    if (!animeId || !genres || genres.length === 0) {
      // Returning a 400 Bad Request response with an error message if validation fails
      return NextResponse.json({ error: 'Anime ID and genres là bắt buộc' }, { status: 400 });
    }

    // Using Prisma ORM to create multiple anime-genre associations in the database
    const animeGenreAssociations = await prisma.animeGenre.createMany({
      // Mapping each genreId to an object containing 'animeId' and 'genreId'
      data: genres.map((genreId: string) => ({
        animeId,
        genreId,
      })),
    });

    // Logging success messages and the created associations to the console
    console.log("Tạo thành công");
    console.log(animeGenreAssociations);

    // Returning a 201 Created response with the created associations
    return NextResponse.json(animeGenreAssociations, { status: 201 });
  } catch (error) {
    // Logging any errors that occur during the process
    console.log(error);

    // Returning a 500 Internal Server Error response with an error message
    return NextResponse.json({ error: 'Error creating anime-genre associations' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const animeGenreList = await prisma.animeGenre.findMany({
      include: {
        anime: true,
        genre: true,
      },
    });
    console.log("Lấy dữ liệu thành công")
    return NextResponse.json(animeGenreList);
  } catch (error) {
    console.log("Không lấy được dữ liệu từ bảng AnimeGenre")
    return NextResponse.json({ error }, { status: 500 });
  }
}
