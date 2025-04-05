'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import toast from 'react-hot-toast';

interface WatchLaterItem {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
  episodeSeason: number;
  episodeSlug: string;
  animeId: string;
  animeTitle: string;
  animeSlug: string;
  animeImageUrl: string;
  createdAt: string;
}

const WatchLaterList = () => {
  const { data: session } = useSession();
  const [watchLaterItems, setWatchLaterItems] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cấu hình dayjs
  dayjs.extend(relativeTime);
  dayjs.locale('vi');

  // Hàm để lấy danh sách xem sau
  const fetchWatchLater = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/watch-later');
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách xem sau');
      }
      
      const data = await response.json();
      setWatchLaterItems(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách xem sau:', error);
      toast.error('Không thể tải danh sách xem sau');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount và khi session thay đổi
  useEffect(() => {
    if (session) {
      fetchWatchLater();
    }
  }, [session]);

  // Hàm xóa khỏi danh sách xem sau
  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/watch-later/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Cập nhật state để xóa item khỏi UI
        setWatchLaterItems(prevItems => 
          prevItems.filter(item => item.id !== id)
        );
        
        toast.success('Đã xóa khỏi danh sách xem sau');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Không thể xóa khỏi danh sách xem sau');
      }
    } catch (error) {
      console.error('Lỗi khi xóa khỏi danh sách xem sau:', error);
      toast.error('Không thể xóa khỏi danh sách xem sau');
    }
  };

  // Hiển thị thông báo nếu chưa đăng nhập
  if (!session) {
    return (
      <div className="bg-[#1a1a2e]/50 rounded-lg p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Danh sách xem sau</h2>
        <div className="flex flex-col items-center justify-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-base sm:text-lg text-gray-300 mb-2">Vui lòng đăng nhập để sử dụng tính năng này</p>
          <p className="text-sm text-gray-400 mb-6">Đăng nhập để lưu và quản lý danh sách xem sau của bạn</p>
        </div>
      </div>
    );
  }

  // Hiển thị loading
  if (loading) {
    return (
      <div className="bg-[#1a1a2e]/50 rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-12 after:bg-purple-500 text-white">
          Danh sách xem sau
        </h2>
        <div className="animate-pulse space-y-4 mt-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex gap-3 sm:gap-4 border border-gray-700 p-3 sm:p-4 rounded-md bg-[#252538]/30">
              <div className="bg-gray-700 w-24 sm:w-32 h-16 sm:h-20 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="hidden sm:flex flex-col gap-2 w-24">
                <div className="h-8 bg-gray-700 rounded"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hiển thị khi không có item
  if (watchLaterItems?.length === 0) {
    return (
      <div className="bg-[#1a1a2e]/50 rounded-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-12 after:bg-purple-500 text-white">
          Danh sách xem sau
        </h2>
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-base sm:text-lg text-gray-300 mb-2">Bạn chưa thêm tập phim nào vào danh sách xem sau</p>
          <p className="text-sm text-gray-400 mb-6">Thêm tập phim vào danh sách để xem sau khi bạn có thời gian</p>
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
            Khám phá anime
          </Link>
        </div>
      </div>
    );
  }
 
  // render
  return (
    <div className="bg-[#1a1a2e]/50 rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-12 after:bg-purple-500 text-white">
        Danh sách xem sau
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {watchLaterItems?.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 border border-gray-700 p-3 sm:p-4 rounded-md bg-[#252538]/30 hover:bg-[#252538]/60 transition-colors">
            <div className="relative w-full sm:w-32 h-32 sm:h-20 flex-shrink-0">
              <Image
                src={item.animeImageUrl || '/placeholder.png'}
                alt={item.animeTitle}
                fill
                className="object-cover rounded-md"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Tập {item.episodeNumber}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-sm text-white">
                <Link href={`/anime-detail/${item.animeSlug}`} className="hover:text-purple-400 transition-colors">
                  {item.animeTitle}
                </Link>
              </h3>
              <p className="text-sm sm:text-xs text-gray-300 mt-1">
                <Link href={`/stream/${item.episodeSlug}`} className="hover:text-purple-400 transition-colors">
                  {item.episodeTitle}
                </Link>
              </p>
              <div className="flex items-center text-xs text-gray-400 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Đã thêm: {dayjs(item.createdAt).fromNow()}</span>
              </div>
              <div className="flex gap-2 mt-3 sm:hidden">
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <Link href={`/stream/${item.episodeSlug}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    <span>Xem</span>
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span>Xóa</span>
                </Button>
              </div>
            </div>
            <div className="hidden sm:flex flex-col gap-2 w-24">
              <Button 
                variant="default" 
                size="sm"
                asChild
              >
                <Link href={`/stream/${item.episodeSlug}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  <span>Xem</span>
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Xóa</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLaterList;