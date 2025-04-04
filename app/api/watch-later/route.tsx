import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// API để lấy danh sách xem sau của người dùng
export async function GET() {
  try {
    // Lấy thông tin người dùng đang đăng nhập từ session
    const session = await getServerSession(authOptions);
    
    // Kiểm tra nếu không có session (chưa đăng nhập)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để sử dụng chức năng này' },
        { status: 401 }
      );
    }

    // Tìm user dựa trên email trong session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Lấy danh sách tập phim trong watchLater của user
    const watchLaterList = await prisma.watchLater.findMany({
      where: { userId: user.id },
      include: {
        episode: {
          include: {
            anime: true,
          },
        },
      },
      orderBy: {
        watchedAt: 'desc', // Sắp xếp theo thời gian thêm mới nhất
      },
    });

    // Format dữ liệu để trả về
    const formattedList = watchLaterList.map((item) => ({
      id: item.id,
      episodeId: item.episodeId,
      episodeTitle: item.episode.title,
      episodeNumber: item.episode.number,
      episodeSeason: item.episode.season,
      episodeSlug: item.episode.slug,
      animeId: item.episode.animeId,
      animeTitle: item.episode.anime.title,
      animeSlug: item.episode.anime.slug,
      animeImageUrl: item.episode.anime.imageUrl,
      addedAt: item.watchedAt,
    }));

    return NextResponse.json(formattedList);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xem sau:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách xem sau' },
      { status: 500 }
    );
  }
}

// API để thêm một tập phim vào danh sách xem sau
export async function POST(request: Request) {
  try {
    // Lấy thông tin episodeId từ request body
    const { episodeId } = await request.json();
    
    // Kiểm tra nếu không có episodeId
    if (!episodeId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin tập phim' },
        { status: 400 }
      );
    }
    
    // Lấy thông tin người dùng đang đăng nhập từ session
    const session = await getServerSession(authOptions);
    
    // Kiểm tra nếu không có session (chưa đăng nhập)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để sử dụng chức năng này' },
        { status: 401 }
      );
    }

    // Tìm user dựa trên email trong session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Kiểm tra xem episode có tồn tại không
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode) {
      return NextResponse.json(
        { error: 'Không tìm thấy tập phim' },
        { status: 404 }
      );
    }

    // Kiểm tra xem đã có trong danh sách xem sau chưa
    const existingItem = await prisma.watchLater.findFirst({
      where: {
        userId: user.id,
        episodeId: episodeId,
      },
    });

    // Nếu đã có, trả về thông báo
    if (existingItem) {
      return NextResponse.json(
        { message: 'Tập phim đã có trong danh sách xem sau' },
        { status: 200 }
      );
    }

    // Thêm vào danh sách xem sau
    const watchLaterItem = await prisma.watchLater.create({
      data: {
        userId: user.id,
        episodeId: episodeId,
      },
    });

    return NextResponse.json(
      { 
        message: 'Đã thêm vào danh sách xem sau',
        data: watchLaterItem 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi khi thêm vào danh sách xem sau:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi thêm vào danh sách xem sau' },
      { status: 500 }
    );
  }
}

