import React from 'react';
import { Search, BookOpen } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onGuidelinesClick: () => void;
}

export function SearchBar({ searchTerm, onSearch, onGuidelinesClick }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
      <button
        onClick={onGuidelinesClick}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 
                   hover:bg-gray-700 transition-colors rounded-lg text-gray-300 
                   border border-gray-700 md:w-auto w-full"
      >
        <BookOpen className="w-5 h-5" />
        <span>Guidelines</span>
      </button>
      
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