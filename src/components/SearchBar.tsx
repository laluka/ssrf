import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full">
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
  );
}
