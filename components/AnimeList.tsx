import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Anime {
  id: string;
  title: string;
  exTitle: string;
  slug: string;
  imageUrl: string;
  views: number;
  rating: number;
  genres: string[];
  status: string;
  releaseYear: number;
}

interface AnimeListProps {
  title: string;
  animes: Anime[];
  type: 'views' | 'rating' | 'new';
}

export default function AnimeList({ title, animes, type }: AnimeListProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-2xl font-bold text-[#ff025b] ">{title}</h2>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="anime-swiper"
      >
        {animes.map((anime) => (
          <SwiperSlide key={anime.id}>
            <Link href={`/anime-detail/${anime.slug}`}>
              <div className="bg-[#29223a] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="relative h-[250px]">
                  <Image
                    src={anime.imageUrl || '/images/placeholder.png'}
                    alt={anime.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold truncate">{anime.title}</h3>
                    <p className="text-gray-300 text-sm truncate">{anime.exTitle}</p>
                  </div>
                  {/* Badge hiển thị views/rating/new tùy theo type */}
                  <div className="absolute top-2 right-2 bg-blue-600/80 text-white px-2 py-1 rounded text-sm">
                    {type === 'views' && (
                      <span>{anime.views.toLocaleString()} lượt xem</span>
                    )}
                    {type === 'rating' && (
                      <span>⭐ {anime.rating.toFixed(1)}</span>
                    )}
                    {type === 'new' && (
                      <span className="text-yellow-300">Mới</span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {anime.genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="bg-[#1f1b2e] text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{anime.releaseYear}</span>
                    <span>{anime.status}</span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 