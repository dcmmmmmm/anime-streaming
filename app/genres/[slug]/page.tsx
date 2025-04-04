"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';

interface Anime {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description?: string;
  releaseYear: number;
  genres: string[];
  views?: number;
}

interface Genre {
  id: string;
  name: string;
}

export default function GenreDetailPage() {
  const { slug } = useParams();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenreDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/genres/genre/${slug}`);
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin thể loại');
        }
        
        const data = await response.json();
        setGenre(data.genre);
        setAnimes(data.animes);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGenreDetails();
    }
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (error || !genre) {
    return (
      <div className="polka-dot text-white min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-500 text-xl">{error || 'Không tìm thấy thể loại này'}</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition">
            Quay về trang chủ
          </Link>
        </div>
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

  return (
    <div className="polka-dot text-white min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Thể loại: {genre.name}</h1>
          <p className="text-gray-400 mt-2">Tổng số anime: {animes.length}</p>
        </div>

        {animes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Không có anime nào thuộc thể loại này</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {animes.map((anime) => (
              <Link key={anime.id} href={`/anime-detail/${anime.slug}`}>
                <div className="relative h-[250px] rounded-md overflow-hidden group">
                  <Image
                    src={anime.imageUrl || '/placeholder.png'}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-semibold line-clamp-2">{anime.title}</p>
                    <p className="text-gray-300 text-xs mt-1">{anime.releaseYear}</p>
                    {anime.views !== undefined && (
                      <p className="text-gray-300 text-xs mt-1">{anime.views.toLocaleString()} lượt xem</p>
                    )}
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium line-clamp-1 texxt-center">{anime.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
      
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