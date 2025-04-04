"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  views?: number;
  genres?: string[];
}

interface FallbackSlide {
  label: string;
  subTitle: string;
  title: string;
  slug: string;
  image: string;
  description: string;
}

// Danh sách cố định để fallback nếu không lấy được dữ liệu từ API
const fallbackSlides: FallbackSlide[] = [
  {
    label: "TRENDING",
    subTitle: "COMPLETE FULL SERIES",
    title: "The Testament of Sister New Devil",
    slug: "the-testament-of-sister-new-devil",
    image: "/product-01.jpg",
    description: "A high school student Basara Toujou discovers he has two stepsisters with dark secrets that lead to an unexpected adventure.",
  },
  {
    label: "HOT",
    subTitle: "NEW RELEASE",
    title: "Another Anime Title",
    slug: "another-anime-title",
    image: "/product-01.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam vel tincidunt ultricies.",
  },
];

export default function BannerSlider() {
  const [featuredAnimes, setFeaturedAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/animes');
        if (!response.ok) throw new Error('Không thể tải danh sách anime');
        
        const animeData = await response.json();
        
        // Lọc anime có hình ảnh
        const animesWithImages = animeData.filter((anime: Anime) => anime.imageUrl);
        
        if (animesWithImages.length > 0) {
          // Lấy ngẫu nhiên 3 anime (hoặc tất cả nếu có ít hơn 3)
          const shuffled = [...animesWithImages].sort(() => 0.5 - Math.random());
          const randomAnimes = shuffled.slice(0, Math.min(3, shuffled.length));
          setFeaturedAnimes(randomAnimes);
        }
      } catch (error) {
        console.error('Lỗi khi tải anime:', error);
        // Fallback khi có lỗi
        setFeaturedAnimes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  // Nếu không có anime từ API, sử dụng fallback
  const slidesToDisplay = featuredAnimes.length > 0 
    ? featuredAnimes 
    : fallbackSlides;

  // Hiển thị skeleton trong khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-12 lg:px-24 space-y-3 sm:space-y-4 max-w-3xl">
          <Skeleton className="h-6 w-24 bg-gray-800" />
          <Skeleton className="h-4 w-40 bg-gray-800" />
          <Skeleton className="h-10 w-64 sm:w-96 bg-gray-800" />
          <Skeleton className="h-16 w-full bg-gray-800" />
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-10 w-28 bg-gray-800" />
            <Skeleton className="h-10 w-28 bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay, EffectFade, Navigation]}
      slidesPerView={1}
      loop
      effect="fade"
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      navigation={true}
      className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px]"
    >
      {slidesToDisplay.map((slide, index) => (
        <SwiperSlide key={index} className="relative">
          <Image
            src={
              "imageUrl" in slide 
                ? slide.imageUrl 
                : ("image" in slide ? slide.image : '/placeholder.jpg')
            }
            alt={slide.title}
            fill
            className="object-cover object-center brightness-75"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-12 lg:px-24 text-white space-y-3 sm:space-y-4 max-w-3xl">
            {'label' in slide ? (
              <span className="bg-[#ff025b] text-white px-2 py-1 sm:px-3 text-[10px] sm:text-xs rounded uppercase tracking-wider">
                {slide.label}
              </span>
            ) : (
              <span className="bg-[#ff025b] text-white px-2 py-1 sm:px-3 text-[10px] sm:text-xs rounded uppercase tracking-wider">
                {slide.status === "ONGOING" ? "ĐANG CHIẾU" : "HOÀN THÀNH"}
              </span>
            )}
            
            {'subTitle' in slide ? (
              <span className="uppercase text-xs sm:text-sm font-semibold text-gray-200">
                {slide.subTitle}
              </span>
            ) : (
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-200">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  {slide.views?.toLocaleString() || '100'} lượt xem
                </span>
                <span>{slide.releaseYear}</span>
                <span>{slide.totalEpisode} tập</span>
              </div>
            )}
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {slide.title}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 md:line-clamp-4 mb-2">
              {slide.description?.substring(0, 180) || "Không có mô tả"}
              {slide.description && slide.description.length > 180 ? "..." : ""}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4">
              {'slug' in slide && (
                <>
                  <Link href={`/stream/${slide.slug}`} className="bg-[#ff025b] px-4 py-2 rounded font-semibold hover:bg-[#d8064b] transition text-center sm:text-left">
                    Xem Ngay!
                  </Link>
                  <Link href={`/anime-detail/${slide.slug}`} className="border border-[#ff025b] px-4 py-2 rounded font-semibold text-[#ff025b] hover:bg-[#ff025b] hover:text-white transition text-center sm:text-left">
                    Chi tiết
                  </Link>
                </>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
