import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const genre = await prisma.genre.findUnique({ 
      where: { id: params.id }, 
      include: {
        animeGenres: { include: { genre: true, anime: true } },
      }, 
  });
    if (!genre)
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    return NextResponse.json(genre);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {name} = await req.json();
    const updatedGenre = await prisma.genre.update({
      where: { id: params.id },
      data: {
        name:name
      },
    });
    return NextResponse.json(updatedGenre);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedGenre = await prisma.genre.delete({
      where: { id: params.id },
    });
    return NextResponse.json(deletedGenre);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: 500 });
  }
}
