// utils/updateAnimeStatus.ts
import prisma from "@/lib/prisma";

export async function updateAnimeStatus(animeId: string) {
  // Lấy anime kèm theo danh sách tập hiện có
  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    include: { episodes: true },
  });
  if (!anime) return;

  // Đếm số tập hiện có trong mảng episodes
  const currentCount = anime.episodes.length;
  
  // So sánh với totalEpisode và quyết định trạng thái mới
  const newStatus = currentCount === anime.totalEpisode ? "COMPLETED" : "ONGOING";

  // Nếu trạng thái hiện tại khác với trạng thái mới, cập nhật lại
  if (anime.status !== newStatus) {
    await prisma.anime.update({
      where: { id: animeId },
      data: { status: newStatus },
    });
  }
}
