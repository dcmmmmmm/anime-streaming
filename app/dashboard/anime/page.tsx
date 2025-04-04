"use client"
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link';
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Anime {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  status: string;
  totalEpisode: number;
  releaseYear: number;
  genres: string[]; // Danh sách tên thể loại
}


export default function AnimeDashboard() {
  const [data, setData] = useState<Anime[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/animes");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/animes/${id}`, { method: "DELETE" });
      if(res.ok) {
        toast.success("Xóa thành công")
      } else {
        toast.error("Xóa thất bại")
      }
      setData((prev) => prev.filter((anime) => anime.id !== id));
      
    } catch (error) {
      console.log(error)
      toast.error("Lỗi kết nối mạng")
    }
  };

  const columns: ColumnDef<Anime>[] = [
    {
      accessorKey: "imageUrl",
      header: "Ảnh",
      cell: ({ row }) => {
        const img = row.original.imageUrl;
        return img ? (
          <Image
            priority
            src={img}
            alt={row.original.title}
            width={500} height={500}className="shrink-0 w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.title}</p>
        </div>
        )
      },
    },
    {
      accessorKey: "totalEpisode",
      header: "Tổng tập",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.totalEpisode}</p>
        </div>
        )
      },
    },
    {
      accessorKey: "releaseYear",
      header: "Năm phát hành",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.releaseYear}</p>
        </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.status}</p>
        </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.description}</p>
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
            <p>{row.original.genres.join(", ")},</p>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        return(
          <div className="flex item-center gap-2">
            <Link href={`/dashboard/anime/update/${row.original.id}`} className='bg-green-500 py-2 px-3 rounded-lg hover:bg-green-600'>
              <Pencil className="w-4 h-4" />
            </Link>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)} className='bg-red-600'>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )
      },
    },
  ];
  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Animes' />
        <div className="flex-1 p-6">
          <div className="bg-[#303953] p-6 rounded-lg shadow-md">
          <div className='flex justify-end items-center'>
            <Link href="/dashboard/anime/new" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
              Thêm mới Anime
            </Link>
          </div>
            {/* Total Anime Table */}
            <DataTable columns={columns} data={data}/>
          </div>
        </div>
      </div>
    </div>
  );
}
