import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const anime = await prisma.anime.findUnique({
      where: { slug: params.slug },
      include: {
        episodes: {
          orderBy: [
            { season: "asc" },
            { number: "asc" }
          ],
        },
        animeGenres: {
          include: {
            genre: true, // Include genre details
          },
        },
      },
    });
    if (!anime)
      return NextResponse.json({ error: "Không tìm thấy Anime" }, { status: 404 });

    // Map genres to a flat array of genre names
    const genres = anime.animeGenres.map((ag) => ag.genre.name);

    const relatedAnimes = await prisma.anime.findMany({
      where: {
        id: { not: anime.id },
        animeGenres: {
          some: {
            genreId: { in: anime.animeGenres.map((ag) => ag.genreId) },
          },
        },
      },
      take: 10, // Limit the number of related animes
    });

    return NextResponse.json({ ...anime, genres, relatedAnimes });
  } catch (error) {
    console.log("Kiểm tra lại kết nối mạng");
    return NextResponse.json({ error }, { status: 500 });
  }
}