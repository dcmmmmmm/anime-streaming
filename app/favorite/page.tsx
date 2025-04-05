"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import { toast } from "react-hot-toast";
import Breadcrumb from "@/components/Breadcumb";
import Link from "next/link";

interface Episode {
  id: string;
  title: string;
  // Thêm các thuộc tính khác nếu cần
}
interface Anime {
  id: string;
  title: string;
  exTitle: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  totalEpisode: number;
  releaseYear: number;
  status: "ONGOING" | "COMPLETED";
  episodes: Episode[]; // Mảng các tập, có thể định nghĩa chi tiết hơn nếu cần
  genres?: string[];
  rating?: string;
  views?: string;
}

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchFavorites() {
      try {
        // Lấy danh sách anime yêu thích (mảng anime IDs) từ API
        const res = await fetch("/api/favorites");
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const favoriteIds: string[] = await res.json();

        // Nếu mảng rỗng, set favorites = []
        if (favoriteIds.length === 0) {
          setFavorites([]);
          return;
        }

        // Fetch chi tiết của mỗi anime
        const animePromises = favoriteIds.map((id) =>
          fetch(`/api/animes/${id}`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch anime details");
            return res.json();
          })
        );
        const animeDetails: Anime[] = await Promise.all(animePromises);
        setFavorites(animeDetails);
      } catch (error) {
        console.error("Error fetching favorite anime:", error);
        toast.error("Không thể lấy danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <Breadcrumb/>
        
        <div className="mt-4 sm:mt-6">
          <h2 className="text-xl text-center sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:w-12 after:bg-purple-500">
            Anime Yêu Thích
          </h2>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-base sm:text-lg text-gray-300 mb-2">Bạn chưa có anime yêu thích nào.</p>
              <p className="text-sm text-gray-400 mb-6">Hãy thêm anime vào danh sách yêu thích để xem sau!</p>
              <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                Khám phá anime
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {favorites.map((anime) => (
                <div key={anime.id} className="transform transition-all duration-300 hover:scale-105">
                  <AnimeCard anime={{ ...anime, imageUrl: anime.imageUrl || "", description: anime.description || "No description available" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
