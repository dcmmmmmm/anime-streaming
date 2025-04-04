'use client'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import AnimeList from '@/components/AnimeList';

interface Anime {
  id: string;
  title: string;
  exTitle: string;
  slug: string;
  imageUrl: string;
  description: string;
  status: string;
  totalEpisode: number;
  releaseYear: number;
  views: number;
  rating: number;
  genres: string[];
}

interface Genre {
  id: string;
  name: string;
  animes?: Anime[];
}

interface AnimeLists {
  mostViewed: Anime[];
  topRated: Anime[];
  newReleases: Anime[];
}

export default function Home() {
  const [randomGenres, setRandomGenres] = useState<Genre[]>([]);
  const [animeLists, setAnimeLists] = useState<AnimeLists>({
    mostViewed: [],
    topRated: [],
    newReleases: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch anime lists
  useEffect(() => {
    async function fetchAnimeLists() {
      try {
        const response = await fetch('/api/animes/lists');
        if (response.ok) {
          const data = await response.json();
          setAnimeLists(data);
        } else {
          console.error('Lỗi khi lấy danh sách anime');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách anime:', error);
      }
    }

    fetchAnimeLists();
  }, []);

  // Tăng lượt truy cập web
  useEffect(() => {
    async function updateDailyVisit() {
      try {
        await fetch("/api/daily-visit/increment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error updating daily visit:", error);
      }
    }
    updateDailyVisit();
  }, []);

  // Fetch random genres
  useEffect(() => {
    async function fetchRandomGenresWithAnimes() {
      try {
        setLoading(true);
        // Lấy tất cả thể loại
        const genresRes = await fetch("/api/genres");
        if (!genresRes.ok) throw new Error("Lỗi lấy dữ liệu thể loại");
        const genresData = await genresRes.json();
        
        // Lấy danh sách anime
        const animesRes = await fetch("/api/animes");
        if (!animesRes.ok) throw new Error("Lỗi lấy dữ liệu anime");
        const animesData = await animesRes.json();
        
        // Tạo map giữa thể loại và anime
        const genresWithAnimes = genresData.map((genre: Genre) => {
          // Lọc anime thuộc về thể loại này
          const animesInGenre = animesData.filter((anime: Anime) => 
            anime.genres && anime.genres.includes(genre.name)
          );
          
          return {
            ...genre,
            animes: animesInGenre
          };
        });
        
        // Lọc các thể loại có ít nhất 1 anime
        const genresWithAnimesList = genresWithAnimes.filter(
          (genre: Genre) => genre.animes && genre.animes.length > 0
        );
        
        if (genresWithAnimesList.length === 0) {
          setRandomGenres([]);
          return;
        }
        
        // Shuffle danh sách thể loại
        const shuffledGenres = [...genresWithAnimesList].sort(() => 0.5 - Math.random());
        
        // Lấy 2 thể loại đầu tiên (hoặc ít hơn nếu không đủ)
        const selectedGenres = shuffledGenres.slice(0, Math.min(2, shuffledGenres.length));
        
        // Giới hạn số lượng anime mỗi thể loại xuống còn 5 (và shuffle chúng)
        const limitedGenres = selectedGenres.map((genre: Genre) => {
          const shuffledAnimes = [...(genre.animes || [])].sort(() => 0.5 - Math.random());
          return {
            ...genre,
            animes: shuffledAnimes.slice(0, 5)
          };
        });
        
        setRandomGenres(limitedGenres);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setRandomGenres([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRandomGenresWithAnimes();
  }, []);

  //  dùng component loading
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen p-4">
      {/* Navbar */}
      <Navbar/>
      
      {/* Hero Section */}
      <Banner/>
      
      {/* Anime Lists Section */}
      <section className="container mx-auto py-8">
        <AnimeList
          title="Đánh Giá Cao Nhất"
          animes={animeLists.topRated}
          type="rating"
        />
        <AnimeList
          title="Mới Cập Nhật"
          animes={animeLists.newReleases}
          type="new"
        />
      </section>
      
      {/* Genre Sections */}
      {/* heading: 1 số thể loại anime */}
      <div className="container mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-[#ff025b]">MỘT SỐ THỂ LOẠI ANIME</h2>
      </div>
      <section className="py-8 px-4 text-white">
        {randomGenres.length === 0 ? (
          <div className="container mx-auto text-center py-12">
            <p className="text-xl text-gray-400">Không tìm thấy thể loại với anime</p>
          </div>
        ) : (
          randomGenres.map((genre) => (
            <div key={genre.id} className="container mx-auto mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase relative inline-block">
                  {genre.name}
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#ff025b] transform origin-left"></span>
                </h2>
              </div>

              {genre.animes && genre.animes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {genre.animes.map((anime) => (
                    <div key={anime.id}>
                      <AnimeCard anime={anime} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">Chưa có Anime trong thể loại này</p>
                </div>
              )}
              
              <div className="mt-6 text-right">
                <Link 
                  href={`/genre/${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block text-[#ff025b] hover:underline font-medium"
                >
                  Xem tất cả anime {genre.name} →
                </Link>
              </div>
            </div>
          ))
        )}

        <div className="text-center mt-12">
          <Link
            href="/genres"
            className="inline-block bg-[#ff025b] px-6 py-3 rounded-lg hover:bg-[#d8064b] transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Xem toàn bộ thể loại
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <Footer/>
    </div>
  );
}