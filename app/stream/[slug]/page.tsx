"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";
import WatchLaterButton from "@/components/WatchLaterButton";

interface Episode {
  id: string;
  animeId: string;
  title: string;
  slug: string;
  number: number;
  season: number;
  videoUrl: string;
  duration: number;
  anime: {
    id: string;
    title: string;
    slug: string;
    totalEpisode: number;
    episodes: Episode[];
  };
}

export default function WatchAnime({ params }: { params: { slug: string } }) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisode() {
      try {
        const response = await fetch(`/api/episodes/episode/${params.slug}`);
        const data = await response.json();
        setEpisode(data);
      } catch (error) {
        console.error("Lỗi không lấy được dữ liệu", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisode();
  }, [params.slug]);

  if (loading) {
    return <Loading />;
  }

  if (!episode) {
    return (
      <div className="polka-dot min-h-screen text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl text-center text-red-500">
            Không tìm thấy tập phim
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  // Lấy danh sách tất cả các tập của anime
  const allEpisodes = episode.anime.episodes || [];

  // Nhóm các tập theo season
  const episodesBySeason = allEpisodes.reduce<Record<number, Episode[]>>(
    (acc, ep) => {
      const s = ep.season || 1; // nếu season null/undefined, mặc định = 1
      if (!acc[s]) {
        acc[s] = [];
      }
      acc[s].push(ep);
      return acc;
    },
    {}
  );

  // Lấy danh sách season, rồi sắp xếp tăng dần
  const seasonNumbers = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="polka-dot min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-4">
          <Link href="/" className="hover:text-[#ff025b]">
            Trang chủ
          </Link>
          <span>/</span>
          <Link
            href={`/anime-detail/${episode.anime.slug}`}
            className="hover:text-[#ff025b]"
          >
            {episode.anime.title}
          </Link>
          <span>/</span>
          <span className="text-[#ff025b]">Tập {episode.number}</span>
        </div>

        {/* Tiêu đề phim + tập */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#ff025b] mb-2">
          {episode.anime.title} - Tập {episode.number}
        </h1>

        {/* Thông tin tập phim */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
          <p>Mùa {episode.season}</p>
          <p>•</p>
          <p>{episode.duration} phút</p>
          <p>•</p>
          <p>Tổng số tập: {episode.anime.totalEpisode}</p>
          {/* Watch Later Button */}
          <WatchLaterButton episodeId={episode.id} />
        </div>

        {/* Video Player */}
        <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-lg bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={episode.videoUrl}
            title={`${episode.anime.title} - Tập ${episode.number}`}
            allowFullScreen
          />
        </div>
        {/* Danh sách tập (tách theo season) */}
        <section className="mt-8 bg-[#29223a] p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Danh sách tập</h2>

          {seasonNumbers.map((season) => (
            <div key={season} className="mb-6">
              <h3 className="text-lg font-bold mb-2">
                Season {season}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {episodesBySeason[season].map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/stream/${ep.slug}`}
                    className={`p-2 rounded text-sm text-center transition-colors duration-300
                      ${
                        ep.id === episode.id
                          ? "bg-[#ff025b] text-white"
                          : "bg-[#303953] hover:bg-[#ff025b]"
                      }`}
                  >
                    Tập {ep.number}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Comment Section */}
        <CommentSection episodeId={episode.id} />
      </main>

      <Footer />

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
