'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import DataTable from '@/components/dashboard/DataTable';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

interface AnimeGenre {
  id: string,
  animeId: string;
  genreId: string;
  anime: {
    id: string;
    title: string;
  };
  genre: {
    id: string;
    name: string;
  };
}
interface AnimeGrouped {
  id: string;
  animeId: string;
  animeTitle: string;
  genres: string[];
}
export default function AnimeGenreOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AnimeGrouped[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/anime-genre");
        const result: AnimeGenre[] = await res.json();

        // Nhóm theo animeId
        const grouped: Record<string, AnimeGrouped> = {};

        for (const record of result) {
          const { anime, genre } = record;

          // Nếu animeId chưa có trong grouped thì khởi tạo
          if (!grouped[anime.id]) {
            grouped[anime.id] = {
              id: anime.id,
              animeId: anime.id,
              animeTitle: anime.title,
              genres: [],
            };
          }
          // Thêm genre vào mảng
          grouped[anime.id].genres.push(genre.name);
        }

        // Convert sang mảng
        const groupedData = Object.values(grouped);
        setData(groupedData);
      } catch (error) {
        console.error("Lỗi khi fetch anime-genre:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/anime-genre/${id}`, { method: "DELETE" });
    setData((prev) => prev.filter((anime) => anime.id !== id));
  };
  const columns: ColumnDef<AnimeGrouped>[] = [
    {
      accessorKey: "animeTitle",
      header: "Tiêu đề Anime",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.animeTitle || "No Anime"}</p>
        </div>
        )
      },
    },
    {
      accessorKey: "genres",
      header: "Thể loại",
      cell: ({ row }) => {
        return (
          <div className='text-center line-clamp-1 px-2'>
            <p>{row.original.genres.join(", ")}</p>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Link href={`dashboard/anime/update/${row.original.id}`} className='bg-green-500 py-2 px-3 rounded-lg hover:bg-green-600'>
            <Pencil className="w-4 h-4" />
          </Link>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)} className='bg-red-600'>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Thể loại của Anime' />
        <div className="flex-1 p-6">
          <div className="bg-[#303953] p-6 rounded-lg shadow-md">
          <div className='flex justify-end items-center'>
            <Link href="/dashboard/anime-genre/new" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
              Thêm mới Thể loại Anime
            </Link>
          </div>
            {/* Total Anime Table */}
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}