'use client';

import { useState, useEffect } from 'react';
import GenreSlider from './GenreSlider';

interface Genre {
  id: string;
  name: string;
  slug?: string;
}

interface Anime {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description?: string;
  releaseYear: number;
  genres: string[];
  views?: number;
}

interface GenreWithAnimes {
  genre: Genre;
  animes: Anime[];
}

const Genre = () => {
  const [genreWithAnimes, setGenreWithAnimes] = useState<GenreWithAnimes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách thể loại
        const genreResponse = await fetch('/api/genres');
        if (!genreResponse.ok) {
          throw new Error('Không thể tải danh sách thể loại');
        }
        const genreData = await genreResponse.json();
        
        // Lấy danh sách anime
        const animeResponse = await fetch('/api/animes');
        if (!animeResponse.ok) {
          throw new Error('Không thể tải danh sách anime');
        }
        const animeData = await animeResponse.json();
        
        // Tạo mapping từ thể loại đến danh sách anime
        const genreAnimeMap: GenreWithAnimes[] = genreData.map((genre: Genre) => {
          // Lọc anime thuộc về thể loại này
          const animesInGenre = animeData.filter((anime: Anime) => 
            anime.genres.includes(genre.name)
          );
          
          return {
            genre: {
              ...genre,
              slug: genre.name.toLowerCase().replace(/\s+/g, '-')
            },
            animes: animesInGenre
          };
        });
        
        // Lọc bỏ các thể loại không có anime nào
        const filteredGenres = genreAnimeMap.filter(item => item.animes.length > 0);
        
        setGenreWithAnimes(filteredGenres);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-8">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="flex space-x-4 overflow-x-hidden">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="flex-shrink-0 w-[180px]">
                    <div className="h-[250px] bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thể loại Anime</h1>
      
      {genreWithAnimes.length === 0 ? (
        <p className="text-center text-gray-400">Không có thể loại nào có anime</p>
      ) : (
        genreWithAnimes.map((item) => (
          <GenreSlider 
            key={item.genre.id} 
            title={item.genre.name} 
            animes={item.animes}
            slug={item.genre.slug || ''}
          />
        ))
      )}
    </div>
  );
};

export default Genre;