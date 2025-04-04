"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface FavoriteButtonProps {
  animeId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  animeId,
}) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  // (Optional) Fetch trạng thái hiện tại nếu cần, hoặc nhận từ props
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session) return;
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const favoriteList: string[] = await res.json();
          setIsFavorite(favoriteList.includes(animeId));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [session, animeId]);

  const handleFavorite = async () => {
    if (!session) {
      toast.error("Bạn cần đăng nhập để sử dụng tính năng này.");
      return;
    }
    try {
      const method = isFavorite ? "DELETE" : "POST";
      const res = await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId }),
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        toast.success(
          isFavorite ? "Đã xoá khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích"
        );
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (loading) return <Button disabled>Loading...</Button>;

  return (
    <Button onClick={handleFavorite} className="
      bg-pink-500 hover:bg-pink-600 flex items-center justify-center gap-2
        px-4 py-6
        text-white font-medium
        rounded-lg
        shadow-lg hover:shadow-xl
        transform hover:-translate-y-0.5
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed">
      {isFavorite ? "💖 Yêu thích" : "🤍 Thêm vào yêu thích"}
    </Button>
  );
};

export default FavoriteButton;
