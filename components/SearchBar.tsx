'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mobile Search Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
      >
        <FaSearch size={20} />
      </button>

      {/* Search Form */}
      <form 
        onSubmit={handleSearch} 
        className={`
          ${isExpanded ? 'block' : 'hidden'} 
          md:block 
          absolute md:relative 
          top-full md:top-auto 
          left-0 md:left-auto 
          right-0 md:right-auto 
          w-full md:w-auto 
          bg-white md:bg-transparent 
          p-2 md:p-0 
          shadow-lg md:shadow-none 
          z-50
        `}
      >
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm anime..."
            className="text-black w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            <FaSearch size={16} />
          </button>
        </div>
      </form>
    </div>
  );
} 