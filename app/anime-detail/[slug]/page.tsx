"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import AnimeCard from "@/components/AnimeCard";
import Loading from "@/components/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import FavoriteButton from "@/components/FavoriteButton";
import AnimeRating from "@/components/AnimeRating";
import AnimeViewButton from "@/components/AnimeViewButton";
import ShareButton from "@/components/ShareButton";


interface Episode {
  id: number;
  slug: string;
  number: number;
  season: number | null;
  // ... các trường khác
}


interface Anime {
  id: number;
  title: string;
  slug: string;
  exTitle?: string;
  releaseYear?: number;
  views?: number;
  genres?: string[];
  status?: string;
  description?: string;
  imageUrl?: string;
  episodes?: Episode[];
  relatedAnimes?: Anime[];
  totalEpisode?: number;
}

export default function AnimeDetail({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [ratingInfo, setRatingInfo] = useState<{ averageScore: number; totalRatings: number }>({
    averageScore: 0,
    totalRatings: 0
  });
  // Lấy thông tin anime
  useEffect(() => {
    async function fetchAnime() {
      try {
        // Gọi API lấy thông tin anime theo slug
        const response = await fetch(`/api/animes/anime/${params.slug}`);
        if (!response.ok) {
          // Xử lý nếu API trả về 404 hoặc 500
          console.error("Anime not found or server error");
          setAnime(null);
        } else {
          const data = await response.json();
          setAnime(data);
        }
      } catch (error) {
        console.error("Failed to fetch anime data:", error);
        setAnime(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, [params.slug]);

  

   // Lấy thông tin đánh giá
   useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch(`/api/animes/anime/${params.slug}/rating`);
        const data = await response.json();
        setRatingInfo(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đánh giá:', error);
      }
    }
    fetchRating();
  }, [params.slug]);

  if (loading) {
    return <Loading />;
  }

  // Nếu anime null hoặc undefined, hiển thị thông báo
  if (!anime) {
    return (
      <div className="text-white text-center mt-10">
        Anime not found or server error.
      </div>
    );
  }

  // Nếu chưa có episodes, ta có thể set mặc định mảng rỗng
  const episodes = anime.episodes ?? [];

  // Group episodes theo season
  // Giả sử field season có thể null => mặc định = 1
  const episodesBySeason = episodes.reduce((acc: Record<number, Episode[]>, ep) => {
    const season = ep.season || 1;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(ep);
    return acc;
  }, {});

  // Lấy danh sách season, rồi sắp xếp tăng dần
  const seasonNumbers = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  console.log('Current anime state:', anime); // Thêm vào trước phần return JSX
  

  return (
    <div className="polka-dot text-white min-h-screen">
      <Navbar />

      {/* Container chính */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tiêu đề chính */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#ff025b]">
          {anime.title}
        </h1>

        {/* Tên khác (exTitle) */}
        {anime.exTitle && (
          <p className="text-gray-200 italic mb-4">{anime.exTitle}</p>
        )}

        {/* Bố cục 2 cột (trên md:) */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cột trái: Thông tin & Summary */}
          <div className="flex-1 space-y-4">
            {/* Card thông tin cơ bản */}
            <div className="bg-[#29223a] p-4 rounded shadow-md space-y-2">
              <p>
                <span className="font-semibold">Năm phát hành:</span>{" "}
                {anime.releaseYear || "N/A"}
              </p>
              {/* Lượt xem */}
              <p>
                <span className="font-semibold">Lượt xem:</span>{" "}
                <span className="text-blue-400">{anime.views?.toLocaleString() || 0}</span>
              </p>
              {/* Đánh giá */}
              <p className="flex items-center gap-2">
                <span className="font-semibold">Đánh giá:</span>{" "}
                <span className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">
                    {ratingInfo?.averageScore ? ratingInfo.averageScore.toFixed(1) : "0"}/10
                  </span>
                  <span className="text-sm text-gray-400">
                    ({ratingInfo?.totalRatings || 0} đánh giá)
                  </span>
                </span>
              </p>
              {/* Thể loại */}
              <p>
                <span className="font-semibold">Thể loại:</span>{" "}
                {anime.genres && anime.genres.length > 0
                  ? anime.genres.join(", ")
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {anime.status || "N/A"}
              </p>
            </div>

            {/* Card giới thiệu */}
            <div className="bg-[#29223a] p-4 rounded shadow-md">
              <h3 className="font-semibold mb-2 text-lg">Giới thiệu</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                {anime.description || "No description available."}
              </p>
            </div>

            {/* Thêm component đánh giá */}
            <AnimeRating 
              animeId={anime.id.toString()}
              slug={params.slug} 
              key={params.slug}
            />

            {/* Card các nút tương tác */}
            <div className="bg-[#29223a] p-4 rounded shadow-md flex flex-wrap gap-2">
              {/* Xem ngay */}
              <AnimeViewButton animeId={anime.id.toString()} episodeSlug={episodes[0].slug} />
              {/* Thêm vào yêu thích */}
              <FavoriteButton animeId={anime.id.toString()} />
              {/* Chia sẻ */}
              <ShareButton 
                title={anime.title}
                url={`${window.location.origin}/anime-detail/${params.slug}`}
              />
            </div>

            {/* Banner Discord (tuỳ chọn) */}
            <div className="bg-[#303953] p-4 rounded shadow-md flex items-center justify-between">
              <div className="flex flex-col">
                <h4 className="text-lg font-bold uppercase">Tham gia nhóm chat</h4>
                <p className="text-sm text-gray-200">Cộng đồng</p>
              </div>
              <Link
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5865F2] px-4 py-2 rounded flex items-center gap-2 hover:bg-[#4752c4] transition"
              >
                <FaDiscord />
                <span className="uppercase font-semibold">Discord</span>
              </Link>
            </div>
          </div>

          {/* Cột phải: Ảnh bìa + Danh sách tập (nhiều season) */}
          <div className="w-full md:w-1/3 space-y-4">
            {/* Ảnh anime */}
            <div className="bg-[#29223a] p-2 rounded shadow-md">
              {anime.imageUrl ? (
                <Image
                  src={anime.imageUrl}
                  alt={anime.title}
                  width={400}
                  height={600}
                  className="rounded w-full h-auto shadow-lg"
                />
              ) : (
                <div className="w-full h-[600px] flex items-center justify-center bg-black">
                  <span>Không có ảnh</span>
                </div>
              )}
            </div>

            {/* Render danh sách season và tập */}
            {seasonNumbers.map((season) => (
              <div
                key={season}
                className="bg-[#29223a] p-4 rounded shadow-md mb-4"
              >
                <h3 className="font-semibold mb-2 text-lg">Season {season}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {episodesBySeason[season].map((episode) => (
                    <Link
                      key={episode.id}
                      href={`/stream/${episode.slug}`}
                      className="p-2 text-sm rounded bg-[#303953] hover:bg-blue-500 transition text-center"
                    >
                      Tập {episode.number}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Anime Slider (nếu có) */}
        {anime.relatedAnimes && anime.relatedAnimes.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-2">Anime Gợi ý</h3>
            <div className="bg-[#29223a] p-4 rounded shadow-md">
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 3000 }}
                spaceBetween={10}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
              >
                {anime.relatedAnimes.map((related) => (
                  <SwiperSlide key={related.id}>
                    <AnimeCard anime={{
                      id: String(related.id),
                      title: related.title,
                      exTitle: related.exTitle || '',
                      slug: related.slug,
                      imageUrl: related.imageUrl || '',
                      description: related.description || '',
                      status: related.status || '',
                      totalEpisode: related.totalEpisode || 0
                    }} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* CSS nền chấm bi (polka-dot) */}
      <style jsx>{`
        .polka-dot {
          background-color: #0e0011;
          background-image: radial-gradient(#29223a 1px, transparent 1px);
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
}

