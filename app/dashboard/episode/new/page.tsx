// app/episode/create/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Anime {
  id: string;
  title: string;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
};
export default function CreateEpisode() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState(1);
  const [season, setSeason] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(24);
  const [loading, setLoading] = useState(false);
  const [animeId, setAnimeId] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const router = useRouter();

   // fectch anime list
    useEffect(() => {
      fetch('/api/animes')
        .then(res => res.json())
        .then(data => setAnimeList(data));
    }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = generateSlug(title);
    try {
      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animeId,
          title,
          number,
          season,
          videoUrl,
          duration,
          slug,
        }),
      });
      if (res.ok) {
        toast.success('Tạo thành công');
        router.push('/dashboard/episode');
      }
    } catch (error) {
      toast.error('tạo thất bại');
      console.log(error);
    }
    console.log("title:",title,"slug:", slug, "number", number, "season", season );
    setLoading(false);
  };

  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Tạo tập mới"/>
        <div className="flex-1 p-6">
          <div className="p-6 rounded-lg shadow-2xl shadow-[#ff025b]">
            <div className='flex justify-end items-center'>
              <Link href="/dashboard/episode" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
                Trở lại 
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {/* danh sách anime */}
                <label htmlFor="animeID" className="block text-sm font-medium text-gray-700">
                  Chọn Anime:
                </label>
                <select
                  id="animeID"
                  className="w-full p-2 mt-1 border rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring focus:ring-yellow-300"
                  value={animeId}
                  onChange={e => setAnimeId(e.target.value)}
                  required
                >
                  <option value="">-- Chọn Anime --</option>
                  {animeList.map(anime => (
                    <option key={anime.id} value={anime.id}>
                      {anime.title}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tiêu đề */}
              <label  htmlFor="title" className="block text-sm font-medium ">
                Tiêu đề:
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </label>
              {/* tập số */}
              <label>
                Tập Số:
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={number}
                  onChange={e => setNumber(Number(e.target.value))}
                  required
                />
              </label>
              <label>
                Mùa:
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={season}
                  onChange={e => setSeason(Number(e.target.value))}
                  required
                />
              </label>
              <label>
                Link Video:
                <input
                  type="url"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  required
                />
              </label>
              <label>
                Thời gian (tính theo phút):
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  required
                />
              </label>
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
