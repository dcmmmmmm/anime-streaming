'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Bookmark, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
interface WatchLaterButtonProps {
  episodeId: string;
}

const WatchLaterButton = ({ episodeId }: WatchLaterButtonProps) => {
  const { data: session } = useSession();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý thêm/xóa khỏi danh sách xem sau
  const handleToggleWatchLater = async () => {
    // Kiểm tra đăng nhập
    if (!session) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách xem sau');
      return;
    }

    try {
      setIsLoading(true);

      // Gọi API để thêm vào danh sách xem sau
      const response = await fetch('/api/watch-later', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ episodeId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdded(true);
        toast.success('Đã thêm vào danh sách xem sau');
      } else {
        toast.error(data.error || 'Đã xảy ra lỗi khi thêm vào danh sách xem sau');
      }
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi khi thêm vào danh sách xem sau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isAdded ? "secondary" : "default"}
      size="sm"
      onClick={handleToggleWatchLater}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isAdded ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>Đã thêm vào xem sau</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span>Xem sau</span>
        </>
      )}
    </Button>
  );
};

export default WatchLaterButton;