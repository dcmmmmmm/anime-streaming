import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.log("Không lấy được dữ liệu từ bảng Genre");
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const genre = await prisma.genre.create({
      data: { name },
    });
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create genre' }, { status: 500 });
  }
}