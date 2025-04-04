'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface Anime {
  id: string;
  title: string;
  exTitle: string;
  slug: string;
  imageUrl: string;
  description: string;
  totalEpisode: number;
  releaseYear: number;
  status: string;
  views: number;
  genres: Genre[];
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AnimePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/animes/paginated?page=${currentPage}&limit=5`);
        if (!response.ok) {
          throw new Error('Không thể tải danh sách anime');
        }
        const data = await response.json();
        setAnimes(data.animes);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Lỗi:', err);
        setError('Đã xảy ra lỗi khi tải danh sách anime');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/anime?page=${page}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="polka-dot text-white min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Danh sách Anime</h1>
        
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {/* Hiển thị thông tin phân trang */}
        <div className="text-center mb-6 text-gray-400">
          Trang {currentPage} / {pagination?.totalPages || 1} 
          (Tổng số: {pagination?.total || 0} anime)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {animes.map((anime) => (
            <Link key={anime.id} href={`/anime-detail/${anime.slug}`}>
              <div className="bg-[#303953] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
                <div className="relative h-[250px]">
                  <Image
                    src={anime.imageUrl}
                    alt={anime.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-3">
                      <p className="text-sm text-gray-300">{anime.releaseYear}</p>
                      {anime.views !== undefined && (
                        <p className="text-sm text-gray-300">{anime.views.toLocaleString()} lượt xem</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-1 text-center hover:text-[#ff025b] transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {anime.genres.slice(0, 2).map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/genres/${genre.slug}`}
                        className="text-xs bg-[#ff025b] text-white px-2 py-0.5 rounded hover:bg-[#ff025b]/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Phân trang */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-[#303953] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#404c6e] transition-colors"
            >
              Trước
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                const diff = Math.abs(page - currentPage);
                return diff === 0 || diff === 1 || page === 1 || page === pagination.totalPages;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <span key={`ellipsis-${page}`} className="px-4 py-2">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-[#ff025b] text-white'
                        : 'bg-[#303953] text-white hover:bg-[#404c6e]'
                    } transition-colors`}
                  >
                    {page}
                  </button>
                );
              })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 rounded-md bg-[#303953] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#404c6e] transition-colors"
            >
              Sau
            </button>
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
