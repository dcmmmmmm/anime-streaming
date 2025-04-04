"use client"
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Trash} from "lucide-react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}


export default function UserDashboard() {
  const [data, setData] = useState<User[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if(res.ok) {
        toast.success("Xóa thành công")
      } else {
        toast.error("Xóa thất bại")
      }
      setData((prev) => prev.filter((user) => user.id !== id));
      
    } catch (error) {
      console.log(error)
      toast.error("Lỗi kết nối mạng")
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "imageUrl",
      header: "Ảnh",
      cell: ({ row }) => {
        const img = row.original.imageUrl;
        return img ? (
          <Image
            priority
            src={img}
            alt={row.original.name}
            width={500} height={500}className="shrink-0 w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Tên người dùng",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.name}</p>
        </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => {
        return(
        <div className='text-center line-clamp-1 px-2'>
          <p>{row.original.email}</p>
        </div>
        )
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        return(
          <div className="flex item-center justify-center gap-2">
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
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='NGƯỜI DÙNG' />
        <div className="flex-1 p-6">
          <div className="bg-[#303953] p-6 rounded-lg shadow-md">
            {/* Total Anime Table */}
            <DataTable columns={columns} data={data}/>
          </div>
        </div>
      </div>
    </div>
  );
}
