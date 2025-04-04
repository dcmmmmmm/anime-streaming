import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

interface AnimeViewButtonProps {
  animeId: string;
  episodeSlug: string;
  className?: string;
}

export default function AnimeViewButton({ animeId, episodeSlug,  }: AnimeViewButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/animes/${animeId}/view`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi cập nhật lượt xem");
      }

      // Chuyển hướng đến trang xem anime với slug của episode đầu tiên
      router.push(`/stream/${episodeSlug}`);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleView}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2
        bg-green-600 hover:bg-green-700
        text-white font-medium
        rounded-lg
        shadow-lg hover:shadow-xl
        transform hover:-translate-y-0.5
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Play className="w-5 h-5" />
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Đang xử lý...
        </span>
      ) : (
        "Xem ngay"
      )}
    </button>
  );
} 