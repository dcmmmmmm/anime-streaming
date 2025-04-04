"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface RatingProps {
  slug: string;
  animeId: string;
}

export default function AnimeRating({ slug }: RatingProps) {
  const { data: session } = useSession();
  const [score, setScore] = useState<number>(0);
  const [hoveredScore, setHoveredScore] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [averageScore, setAverageScore] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<{score: number, review: string} | null>(null);

  // Lấy thông tin đánh giá khi component được mount
  useEffect(() => {
    fetchRatings();
  }, [slug]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/animes/anime/${slug}/rating`);
      const data = await response.json();
      setAverageScore(data.averageScore);
      setTotalRatings(data.totalRatings);
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error);
    }
  };

  const handleSubmitRating = async () => {
    if (!session) {
      alert('Vui lòng đăng nhập để đánh giá!');
      return;
    }

    try {
      const response = await fetch(`/api/animes/anime/${slug}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score, review }),
      });

      if (response.ok) {
        alert('Đánh giá thành công!');
        fetchRatings();
        setUserRating({ score, review });
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá!');
    }
  };

  const handleDeleteRating = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/animes/${slug}/rating`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Xóa đánh giá thành công!');
        setScore(0);
        setReview('');
        setUserRating(null);
        fetchRatings();
      }
    } catch (error) {
      console.error('Lỗi khi xóa đánh giá:', error);
      toast.error('Có lỗi xảy ra khi xóa đánh giá!');
    }
  };

  return (
    <div className="bg-[#29223a] p-4 rounded shadow-md space-y-4">
      <h3 className="font-semibold text-lg">Đánh giá Anime</h3>
      
      {/* Hiển thị điểm trung bình */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= (averageScore || 0)/2
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold">
          {typeof averageScore === 'number' ? averageScore.toFixed(1) : '0'}/10
          <span className="text-sm text-gray-400 ml-2">
            ({totalRatings || 0} đánh giá)
          </span>
        </span>
      </div>

      {session ? (
        <div className="space-y-4">
          {/* Chọn điểm */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                className={`w-8 h-8 rounded ${
                  value <= (hoveredScore || score)
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-700'
                }`}
                onMouseEnter={() => setHoveredScore(value)}
                onMouseLeave={() => setHoveredScore(0)}
                onClick={() => setScore(value)}
              >
                {value}
              </button>
            ))}
          </div>

          {/* Nhập nhận xét */}
          <Textarea
            placeholder="Nhập nhận xét của bạn..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full bg-[#1f1a2e] text-white"
          />

          <Button
            onClick={handleSubmitRating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gửi đánh giá
          </Button>
        </div>
      ) : (
        <p className="text-gray-400">
          Vui lòng đăng nhập để đánh giá anime này
        </p>
      )}

      {/* Xóa đánh giá */}
      {session && userRating && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-300">Đánh giá của bạn:</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= userRating.score/2
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">({userRating.score}/10)</span>
          </div>
          {userRating.review && (
            <p className="text-sm text-gray-300">{userRating.review}</p>
          )}
          <Button
            onClick={handleDeleteRating}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa đánh giá
          </Button>
        </div>
      )}
    </div>
  );
}