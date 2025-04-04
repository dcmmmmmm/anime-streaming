'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function CreateGenrePage() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/genres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        toast.success('Tạo Thể loại Thành Công');
        router.push('/dashboard/genre');
      } else {
        toast.error('Tạo thất bại');
      }
    } catch (error) {
      toast.error('Lỗi Kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Thêm mới Thể loại' />
        <div className="flex-1 p-6">
          <div className="p-6 rounded-lg shadow-2xl shadow-[#ff025b]">
            <div className='flex justify-end items-center'>
              <Link href="/dashboard/genre" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
                Trở lại 
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium ">
                  Tên Thể loại
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-[#ff025b]  rounded-lg hover:bg-[#d8064b] focus:outline-none focus:ring focus:ring-yellow-300"
              >
                {loading ? "Đang tạo..." : "Thêm mới"}
              </Button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}