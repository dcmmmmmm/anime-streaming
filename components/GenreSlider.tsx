'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface GenreSliderProps {
  title: string;
  animes: Anime[];
  slug: string;
}

const GenreSlider = ({ title, animes, slug }: GenreSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Kiểm tra xem có cần hiển thị các nút điều hướng không
  useEffect(() => {
    const checkOverflow = () => {
      if (sliderRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = sliderRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [animes]);

  // Xử lý sự kiện khi cuộn
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Xử lý cuộn sang trái
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Xử lý cuộn sang phải
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Không hiển thị nếu không có anime
  if (animes.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <Link href={`/genres/${slug}`} className="ml-3 text-sm text-purple-400 hover:underline">
            Xem tất cả
          </Link>
        </div>
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full text-white opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
          onScroll={handleScroll}
        >
          {animes.map((anime) => (
            <div key={anime.id} className="flex-shrink-0 w-[180px]">
              <Link href={`/anime-detail/${anime.slug}`}>
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
              </Link>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full text-white opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default GenreSlider;