import Image from "next/image";
import Link from "next/link";

/** Component hiển thị 1 Anime Card */
interface AnimeCardProps {
  anime: {
    id: string;
    title: string;
    exTitle: string;
    slug: string;
    imageUrl: string;
    description: string;
    status: string;
    totalEpisode: number;
  };
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <div className="relative bg-[#303953] rounded overflow-hidden shadow-md 
        hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group"
    >
      {/* Episode badge */}
      <div className="absolute top-2 right-2 z-10 bg-[#ff025b] px-2 py-1 rounded text-xs font-semibold shadow-lg">
        {anime.totalEpisode} Tập
      </div>

      {/* Ảnh anime */}
      <div className="relative w-full h-64">
        <Image
          src={anime.imageUrl}
          alt={anime.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Thông tin anime */}
      <div className="p-4 text-center">
        <Link 
          href={`/anime-detail/${anime.slug}`} 
          className="text-sm font-semibold mb-2 uppercase line-clamp-1 hover:text-[#ff025b] transition-colors"
        >
          {anime.title}
        </Link>
      </div>
    </div>
  );
}

export default AnimeCard;