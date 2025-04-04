"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

interface Anime {
  id: string;
  title: string;
}

interface Episode {
  id: string;
  animeId: string;
  title: string;
  slug: string;
  number: number;
  season: number;
  videoUrl: string;
  duration: number;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
};

const UpdateEpisodePage = ({ params }: { params: { id: string } }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState(1);
  const [season, setSeason] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(24);
  const [animeId, setAnimeId] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    // Fetch danh sách anime để hiển thị trong select
    async function fetchAnimeList() {
      try {
        const res = await fetch('/api/animes');
        const data = await res.json();
        setAnimeList(data);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách anime:", error);
      }
    }
    fetchAnimeList();

    // Fetch dữ liệu của tập phim cần cập nhật theo id
    async function fetchEpisode() {
      try {
        const res = await fetch(`/api/episodes/${id}`);
        const data = await res.json();
        setEpisode(data);
        setTitle(data.title);
        setNumber(data.number);
        setSeason(data.season);
        setVideoUrl(data.videoUrl);
        setDuration(data.duration);
        setAnimeId(data.animeId); // Gán animeId của tập phim hiện tại
      } catch (error) {
        console.error("Lỗi khi fetch tập phim:", error);
      }
    }
    fetchEpisode();
  }, [id]);

  if (!episode) return <Loading />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(title);
    setLoading(true);
    try {
      const res = await fetch(`/api/episodes/${id}`, {
        method: 'PUT',
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
        toast.success('Cập nhật thành công');
        router.push('/dashboard/episode');
      } else {
        toast.error('Cập nhật không thành công');
      }
      console.log(animeId, title, number, season, videoUrl, duration, slug)
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối mạng');
    }
    setLoading(false);
  };

  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Cập nhật Tập phim" />
        <div className="flex-1 p-6">
          <div className="p-6 rounded-lg shadow-2xl shadow-[#ff025b]">
            <div className='flex justify-end items-center'>
              <Link href="/dashboard/episode" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
                Trở lại 
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {/* Danh sách Anime trong select */}
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
              <div>
                <label htmlFor="title" className="block text-sm font-medium">
                  Tiêu đề:
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              {/* Tập số */}
              <div>
                <label className="block text-sm font-medium">
                  Tập Số:
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={number}
                  onChange={e => setNumber(Number(e.target.value))}
                  required
                />
              </div>
              {/* Mùa */}
              <div>
                <label className="block text-sm font-medium">
                  Mùa:
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={season}
                  onChange={e => setSeason(Number(e.target.value))}
                  required
                />
              </div>
              {/* Link Video */}
              <div>
                <label className="block text-sm font-medium">
                  Link Video:
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  required
                />
              </div>
              {/* Thời gian */}
              <div>
                <label className="block text-sm font-medium">
                  Thời gian (phút):
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  required
                />
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-[#ff025b] rounded-md hover:bg-[#d8064b] focus:outline-none focus:ring focus:ring-yellow-300"
              >
                {loading ? 'Đang tạo...' : 'Cập nhật'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEpisodePage;
