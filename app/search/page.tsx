'use client';

import { Suspense, useEffect, useState } from 'react';
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

export default function SearchWrapper() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <SearchPage />
    </Suspense>
  );
}


 function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    const p = parseInt(searchParams.get('page') || '1');
    setQuery(q);
    setPage(p);
  }, [searchParams]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setError('Vui lòng nhập từ khóa tìm kiếm');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/animes/search?q=${encodeURIComponent(query)}&page=${page}`);
        if (!response.ok) {
          throw new Error('Không thể tìm kiếm anime');
        }
        const data = await response.json();
        setAnimes(data.animes);
        setPagination(data.pagination);
        setError('');
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
        setError('Đã xảy ra lỗi khi tìm kiếm');
      } finally {
        setLoading(false);
      }
    };

    if (query !== null) {
      fetchSearchResults();
    }
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="polka-dot text-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Kết quả tìm kiếm cho{' '}
          <span className="text-[#ff025b]">&ldquo;{query}&rdquo;</span>
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {animes.length === 0 ? (
          <div className="text-center text-gray-300">
            Không tìm thấy anime nào phù hợp với từ khóa &ldquo;{query}&rdquo;
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {animes.map((anime) => (
                <Link href={`/anime/${anime.slug}`} key={anime.id}>
                  <div className="bg-[#303953] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
                    <div className="relative h-48">
                      <Image
                        src={anime.imageUrl}
                        alt={anime.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-lg mb-2 text-white hover:text-[#ff025b] transition-colors">
                        {anime.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-2">
                        {anime.exTitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.map((genre) => (
                          <Link
                            key={genre.id}
                            href={`/genres/${genre.slug}`}
                            className="bg-[#ff025b] text-white px-2 py-1 rounded text-xs hover:bg-[#ff025b]/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        <span>{anime.totalEpisode} tập</span>
                        <span className="mx-2">•</span>
                        <span>{anime.releaseYear}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded ${
                    page === 1
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#ff025b] hover:bg-[#ff025b]/80'
                  }`}
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className={`px-4 py-2 rounded ${
                    page === pagination.totalPages
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#ff025b] hover:bg-[#ff025b]/80'
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </>
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

