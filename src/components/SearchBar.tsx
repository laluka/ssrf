import React from 'react';
import { Search, BookOpen, MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IconButton } from './common/IconButton';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
      <div className="flex justify-center gap-4 md:w-auto">
        <Link to="/guidelines">
          <IconButton
            icon={BookOpen}
            title="Guidelines"
          />
        </Link>
        <IconButton
          icon={MessageCircle}
          href="https://discord.com/invite/tH8wEpNKWS"
          title="Join Discord"
        />
        <IconButton
          icon={Heart}
          href="https://linktr.ee/TheLaluka"
          title="Social Links"
        />
      </div>
      
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search streams, links, or dates..."
          className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg 
                   text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 focus:border-transparent"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
}