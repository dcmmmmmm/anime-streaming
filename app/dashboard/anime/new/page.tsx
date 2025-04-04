"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link';
import { UploadDropzone } from '@/utils/uploadthing';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
};

function NewAnimePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState('');
  const [exTitle, setExTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalEpisode, setTotalEpisode] = useState(0);
  const [releaseYear, setReleaseYear] = useState(2000);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(title);
    setLoading(true);
    try {
      const res = await fetch('/api/animes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, exTitle, releaseYear, description, totalEpisode, imageUrl, slug }),
      });

      if (res.ok) {
        toast.success('Thêm Mới Thành Công.');
        router.push('/dashboard/anime');
      } else {
        toast.error('Thêm Mới Anime Không Thành Công.');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred.');
    }
    console.log("title:",title, "exTitle", exTitle, "release year",releaseYear, "description:",description, "totalEpisode:", totalEpisode, "imageUrl:", imageUrl, "slug:", slug);
    setLoading(false);
  
  };

  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Thêm mới Anime'  />
        <div className="flex-1 p-6">
          <div className="p-6 rounded-lg shadow-2xl shadow-[#ff025b]">
            <div className='flex justify-end items-center'>
              <Link href="/dashboard/anime" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
                Trở lại 
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Label */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium ">
                  Tiêu đề Anime
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              {/* Tên khác */}
              <div>
                <label htmlFor="exTitle" className="block text-sm font-medium ">
                  Tên khác
                </label>
                <input
                  type="text"
                  id="exTitle"
                  value={exTitle}
                  onChange={(e) => {
                    setExTitle(e.target.value);
                  }}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              {/* năm phát hành */}
              <label htmlFor="releaseYear" className="block text-sm font-medium ">
                Năm phát hành:
                <input
                  type="number"
                  id="releaseYear"
                  value={releaseYear}
                  onChange={(e) => {
                    setReleaseYear(Number(e.target.value));
                  }}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </label>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium ">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              {/* Total EpiSode */}
              <div>
                <label htmlFor="totalEpisode" className="block text-sm font-medium ">
                  Tổng số tập
                </label>
                <input
                  type="number"
                  id="totalEpisode"
                  value={totalEpisode}
                  onChange={(e) => setTotalEpisode(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>

              {/* Component Upload Image */}

              <div className="grid grid-cols-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold  tracking-wide">
                    Dán ảnh
                  </label>
                  {imageUrl && (
                    <Button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="py-1 px-3 focus:outline-none hover:bg-gray-200"
                    >
                      + Sửa ảnh
                    </Button>
                  )}
                </div>
                {imageUrl ? (
                  <div className="col-span-6 sm:col-span-4">
                    <Image
                      src={imageUrl}
                      alt="animeImage"
                      width="1000"
                      height="100"
                      className="object-cover w-full h-[250px]"
                    />
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint={"imageUploader"}
                    onClientUploadComplete={(ufsUrl: any) => {
                      console.log("files", ufsUrl);
                      setImageUrl(ufsUrl?.[0].ufsUrl);
                      toast.success("Tải ảnh thành công");
                    }}
                    onUploadError={(error) => {
                      console.log(error)
                      toast.error("Tải ảnh thất bại");
                    }}
                  />
                )}
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

export default NewAnimePage;