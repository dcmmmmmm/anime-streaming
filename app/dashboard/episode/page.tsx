"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

interface Episode {
  id: string;
  animeId: string;
  title: string;
  season: number;
  number: number;
  videoUrl: string;
}

interface GroupedAnime {
  animeId: string;
  episodes: Episode[];
}

export default function EpisodeDashboard() {
  const [grouped, setGrouped] = useState<GroupedAnime[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(grouped.length / pageSize);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/episodes");
      const episodes: Episode[] = await res.json();
      
      episodes.sort((a, b) => {
        const compareId = a.animeId.localeCompare(b.animeId);
        if (compareId !== 0) return compareId;
        if (a.season !== b.season) return a.season - b.season;
        return a.number - b.number;
      });

      const map = new Map<string, Episode[]>();
      episodes.forEach((ep) => {
        if (!map.has(ep.animeId)) {
          map.set(ep.animeId, []);
        }
        map.get(ep.animeId)!.push(ep);
      });

      setGrouped(Array.from(map, ([animeId, episodes]) => ({ animeId, episodes })));
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleDelete = async (episodeId: string) => {
    try {
      const res = await fetch(`/api/episodes/${episodeId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Xóa thành công");
        setGrouped((prev) =>
          prev
            .map((group) => ({
              ...group,
              episodes: group.episodes.filter((ep) => ep.id !== episodeId),
            }))
            .filter((group) => group.episodes.length > 0)
        );
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const paginatedGroups = grouped.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Tập Phim" />
        <div className="flex-1 p-6">
          <div className="bg-[#303953] p-6 rounded-lg shadow-md">
            <div className="flex justify-end mb-4">
              <Link href="/dashboard/episode/new" className="bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
                Thêm mới Tập phim
              </Link>
            </div>

            {/* Responsive table container */}
            <div className="relative rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="text-xs uppercase bg-gray-800/50">
                    <tr>
                      <th className="p-3 text-center border-x-2 border-t-2 whitespace-nowrap min-w-[200px]">Anime ID</th>
                      <th className="p-3 text-center border-x-2 border-t-2 whitespace-nowrap min-w-[300px]">Tiêu đề</th>
                      <th className="p-3 text-center border-x-2 border-t-2 whitespace-nowrap min-w-[100px]">Mùa</th>
                      <th className="p-3 text-center border-x-2 border-t-2 whitespace-nowrap min-w-[100px]">Tập số</th>
                      <th className="p-3 text-center border-x-2 border-t-2 whitespace-nowrap min-w-[100px]">Link Video</th>
                      <th className="p-3 text-center border-x-2 border-t-2 whitespace-nowrap min-w-[150px]">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedGroups.map((group) =>
                      group.episodes.map((ep, index) => (
                        <tr key={ep.id} className="border-b border-white hover:bg-gray-800/50">
                          {index === 0 ? (
                            <td rowSpan={group.episodes.length} className="p-3 text-center border-x-2 whitespace-nowrap">
                              {group.animeId}
                            </td>
                          ) : null}
                          <td className="p-3 text-center border-x-2">{ep.title}</td>
                          <td className="p-3 text-center border-x-2 whitespace-nowrap">{ep.season}</td>
                          <td className="p-3 text-center border-x-2 whitespace-nowrap">{ep.number}</td>
                          <td className="p-3 text-center border-x-2 whitespace-nowrap">{ep.videoUrl}</td>
                          <td className="p-3 text-center border-x-2 whitespace-nowrap">
                            <div className="flex gap-2 justify-center">
                              <Link 
                                href={`/dashboard/episode/update/${ep.id}`} 
                                className="bg-green-500 p-2 rounded hover:bg-green-600"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDelete(ep.id)} 
                                className="bg-red-600"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination - unchanged */}
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]"
              >
                Trang trước
              </Button>
              <span>
                Trang {currentPage + 1} của {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                className="bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]"
              >
                Trang sau
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
