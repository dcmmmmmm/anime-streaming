'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AnimeData {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  views: number;
  genres: string[];
  releaseYear: number;
}

const PopularAnime = ({ limit = 5 }: { limit?: number }) => {
  const [animes, setAnimes] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularAnimes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/animes/popular?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Không thể tải danh sách anime phổ biến');
        }
        const data = await response.json();
        setAnimes(data);
      } catch (error) {
        console.error('Lỗi khi tải anime phổ biến:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAnimes();
  }, [limit]);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Anime Phổ Biến</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="bg-gray-300 w-20 h-28 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Anime Phổ Biến</h2>
      <div className="space-y-4">
        {animes.map((anime) => (
          <Link href={`/anime/${anime.slug}`} key={anime.id}>
            <div className="flex gap-3 hover:bg-gray-100 p-2 rounded transition">
              <div className="relative w-20 h-28">
                <Image
                  src={anime.imageUrl || '/placeholder.png'}
                  alt={anime.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{anime.title}</h3>
                <p className="text-xs text-gray-600">{anime.releaseYear}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {anime.genres?.slice(0, 3).join(', ')}
                </p>
                <p className="text-xs text-gray-600 mt-2 flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1 text-gray-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    />
                  </svg>
                  {anime.views.toLocaleString()} lượt xem
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularAnime; 