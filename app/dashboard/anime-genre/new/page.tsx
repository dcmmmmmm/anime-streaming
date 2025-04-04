'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface Anime {
  id: string;
  title: string;
}

interface Genre {
  id: string;
  name: string;
}

export default function CreateAnimeGenre() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animeId, setAnimeId] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [genreList, setGenreList] = useState<Genre[]>([]);
  const router = useRouter();

  // fectch anime and genre list
  useEffect(() => {
    fetch('/api/animes')
      .then(res => res.json())
      .then(data => setAnimeList(data));

    fetch('/api/genres')
      .then(res => res.json())
      .then(data => setGenreList(data));
  }, []);

  // handle genre selection
  const handleGenreChange = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!animeId || selectedGenres.length === 0) {
        alert('Please select an anime and at least one genre.');
        return;
      }

      const res = await fetch('/api/anime-genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeId, genres: selectedGenres }),
      });

      if (res.ok) {
        toast.success('Tạo thành công');
        router.push('/dashboard/anime-genre');
      } else {
        toast.error('Tạo thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi kết nối mạng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-[#303953] via-[#29223a] to-[#0e0011] text-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title='Tạo mới Thể loại Anime' />
        <div className="flex-1 p-6">
          <div className="p-6 rounded-lg shadow-2xl shadow-[#ff025b]">
            <div className='flex justify-end items-center'>
              <Link href="/dashboard/anime" className="mb-4 bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]">
                Trở lại 
              </Link>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="animeID" className="block text-sm font-medium text-gray-700">
                  Select Anime:
                </label>
                <select
                  id="animeID"
                 className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                  value={animeId}
                  onChange={e => setAnimeId(e.target.value)}
                  required
                >
                  <option value="">-- Select Anime --</option>
                  {animeList.map(anime => (
                    <option key={anime.id} value={anime.id}>
                      {anime.title}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 border p-4 rounded">
                <legend className="font-semibold">Select Genres:</legend>
                {genreList.map(genre => (
                  <div key={genre.id} className="">
                    <label className="flex items-center gap-2">
                      <input
                      type="checkbox"
                      value={genre.id}
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => handleGenreChange(genre.id)}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      {genre.name}
                    </label>
                  </div>
                ))}
              </fieldset>

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