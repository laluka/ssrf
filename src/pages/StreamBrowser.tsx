import React, { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { StreamCard } from '../components/StreamCard';
import { Pagination } from '../components/Pagination';
import { Background } from '../components/Background';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Title } from '../components/Title';
import { searchStreams } from '../utils/search';
import { useStreamData } from '../hooks/useStreamData';
import { ArrowUpDown, ArrowDownUp, BookOpen, MessageCircle, Heart } from 'lucide-react';
import { IconButton } from '../components/common/IconButton';

const ITEMS_PER_PAGE = 12;

// Sort options
type SortOption = 'newest' | 'oldest';

export function StreamBrowser() {
  const { streams, loading, error } = useStreamData();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('query') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const highlightParam = searchParams.get('highlight');
  const [currentPage, setCurrentPage] = React.useState(pageParam);
  const [filteredStreams, setFilteredStreams] = React.useState(streams);
  const highlightedStreamRef = useRef<boolean>(false);

  // Sort streams by date - wrapped in useCallback to avoid recreating on each render
  const sortStreams = useCallback((streams: typeof filteredStreams, sortOption: SortOption) => {
    return [...streams].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, []);

  useEffect(() => {
    let result = searchStreams(streams, searchTerm);

    // Apply sorting
    result = sortStreams(result, sortParam);

    setFilteredStreams(result);
    
    // If there's a page parameter, use it, otherwise reset to page 1
    if (pageParam && !searchTerm) {
      setCurrentPage(pageParam);
    } else {
      setCurrentPage(1);
    }
  }, [searchTerm, streams, sortParam, sortStreams, pageParam]);

  const totalPages = Math.ceil(filteredStreams.length / ITEMS_PER_PAGE);

  // Handle highlighting and scrolling to a specific stream
  useEffect(() => {
    if (highlightParam && !loading && !searchTerm && !highlightedStreamRef.current) {
      highlightedStreamRef.current = true;
      
      // Use a timeout to ensure the DOM is ready
      setTimeout(() => {
        const streamId = `stream-${highlightParam}`;
        const element = document.getElementById(streamId);
        
        if (element) {
          // Scroll to the element with smooth behavior
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add highlight animation
          element.classList.add('ring-2', 'ring-purple-500', 'ring-offset-2', 'ring-offset-gray-900');
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-purple-500', 'ring-offset-2', 'ring-offset-gray-900');
            
            // Clean up the highlight parameter from URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('highlight');
            setSearchParams(newParams, { replace: true });
            highlightedStreamRef.current = false;
          }, 3000);
        }
      }, 100);
    }
  }, [highlightParam, loading, searchTerm, searchParams, setSearchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't handle if user is typing in an input

      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('query', value);
    } else {
      newParams.delete('query');
    }
    setSearchParams(newParams);
  };

  const toggleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    const newSortValue = sortParam === 'newest' ? 'oldest' : 'newest';
    newParams.set('sort', newSortValue);
    setSearchParams(newParams);
  };

  const currentStreams = filteredStreams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                    text-white p-6 relative overflow-hidden"
    >
      <Background />

      <div className="max-w-[1400px] mx-auto relative">
        <div className="text-center mb-8">
          <Title />
          <p className="text-gray-400">
            Search through {filteredStreams.length} episodes and{' '}
            {filteredStreams.reduce((total, stream) => total + stream.covered_links.length, 0)}{' '}
            links
          </p>
        </div>

        {/* Navigation and Search Section */}
        <div className="mb-8">
          {/* Mobile: Buttons on top, Search below */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buttons - On mobile: full width at top, On desktop: right-aligned */}
            <div className="flex justify-center gap-3 order-1 md:order-2 md:ml-auto">
              <Link to="/guidelines">
                <IconButton icon={BookOpen} title="Guidelines" />
              </Link>
              <IconButton
                icon={MessageCircle}
                href="https://discord.com/invite/tH8wEpNKWS"
                title="Join Discord"
              />
              <IconButton icon={Heart} href="https://linktr.ee/TheLaluka" title="Social Links" />
              <IconButton
                icon={sortParam === 'newest' ? ArrowDownUp : ArrowUpDown}
                onClick={toggleSortOrder}
                title={
                  sortParam === 'newest'
                    ? 'Newest First (click to change)'
                    : 'Oldest First (click to change)'
                }
              />
            </div>

            {/* Search Bar - On mobile: below buttons, On desktop: left-aligned */}
            <div className="flex-grow order-2 md:order-1">
              <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentStreams.map((stream, index) => (
              <StreamCard
                key={`${stream.date}-${index}`}
                stream={stream}
                allStreams={streams}
                sortOption={sortParam}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
