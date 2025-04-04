import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Tìm anime theo slug
    const anime = await prisma.anime.findUnique({
      where: { slug: params.slug },
      include: {
        ratings: true
      }
    });

    if (!anime) {
      return NextResponse.json(
        { message: 'Không tìm thấy anime' },
        { status: 404 }
      );
    }

    // Tính điểm trung bình
    const totalScore = anime.ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageScore = anime.ratings.length > 0 
      ? Math.round((totalScore / anime.ratings.length) * 10) / 10 
      : 0;
    const totalRatings = anime.ratings.length;

    return NextResponse.json({
      averageScore,
      totalRatings
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi khi lấy thông tin đánh giá' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Bạn cần đăng nhập để đánh giá' },
        { status: 401 }
      );
    }

    const { score, review } = await request.json();
    
    // Tìm anime theo slug
    const anime = await prisma.anime.findUnique({
      where: { slug: params.slug }
    });

    if (!anime) {
      return NextResponse.json(
        { message: 'Không tìm thấy anime' },
        { status: 404 }
      );
    }

    // Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Không tìm thấy thông tin người dùng' },
        { status: 404 }
      );
    }

    // Tạo hoặc cập nhật đánh giá
    const rating = await prisma.rating.upsert({
      where: {
        userId_animeId: {
          userId: user.id,
          animeId: anime.id,
        },
      },
      update: {
        score,
        review,
      },
      create: {
        userId: user.id,
        animeId: anime.id,
        score,
        review,
      },
    });

    // Trả về kết quả bao gồm cả thông tin đánh giá hiện tại
    const updatedRatings = await prisma.rating.findMany({
      where: { animeId: anime.id }
    });

    const totalScore = updatedRatings.reduce((sum, r) => sum + r.score, 0);
    const averageScore = updatedRatings.length > 0 
      ? Math.round((totalScore / updatedRatings.length) * 10) / 10 
      : 0;

    return NextResponse.json({
      rating,
      averageScore,
      totalRatings: updatedRatings.length
    });
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error);
    return NextResponse.json(
      { message: 'Lỗi khi tạo đánh giá' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Bạn cần đăng nhập để xóa đánh giá' },
        { status: 401 }
      );
    }

    // Tìm anime theo slug
    const anime = await prisma.anime.findUnique({
      where: { slug: params.slug }
    });

    if (!anime) {
      return NextResponse.json(
        { message: 'Không tìm thấy anime' },
        { status: 404 }
      );
    }

    // Xóa đánh giá
    await prisma.rating.deleteMany({
      where: {
        userId: session.user.id,
        animeId: anime.id,
      },
    });

    return NextResponse.json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi khi xóa đánh giá' },
      { status: 500 }
    );
  }
} 