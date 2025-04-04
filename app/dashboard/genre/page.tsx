'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import DataTable from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';

interface Genre {
  id: string;
  name: string;
  
}

export default function GenreOverviewPage() {
  const [data, setData] = useState<Genre[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/genres");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);
  
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/genres/${id}`, { method: "DELETE" });
      if(res.ok) {
        toast.success("Xóa thành công")
      } else {
        toast.error("Xóa thất bại")
      }
      setData((prev) => prev.filter((genre) => genre.id !== id));
      
    } catch (error) {
      console.log(error)
      toast.error("Lỗi kết nối mạng")
    }
  };

  const columns: ColumnDef<Genre>[] = [
    {
      accessorKey: "name",
      header: "Tên Thể loại",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1'>
          <p>{row.original.name}</p>
        </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({row}) => (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/genre/update/${row.original.id}`} className='bg-green-500 hover:bg-green-600 py-2 px-3 rounded-lg '>
            <Pencil className="w-4 h-4" />
          </Link>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)} className='hover:bg-red-600'>
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
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Thể loại' />
        <div className="flex-1 p-6">
          <div className="bg-[#303953] p-6 rounded-lg shadow-md">
          <div className='flex justify-end items-center'>
            <Link href="/dashboard/genre/new" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
              Thêm mới Thể loại
            </Link>
          </div>
            {/* Total Anime Table */}
            <DataTable columns={columns} data={data}  />
          </div>
        </div>
      </div>
    </div>
  );
}