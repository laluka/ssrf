import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { StreamCard } from '../components/StreamCard';
import { Pagination } from '../components/Pagination';
import { Background } from '../components/Background';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Title } from '../components/Title';
import { searchStreams } from '../utils/search';
import { useStreamData } from '../hooks/useStreamData';

const ITEMS_PER_PAGE = 12;

export function StreamBrowser() {
  const { streams, loading, error } = useStreamData();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('query') || '';
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filteredStreams, setFilteredStreams] = React.useState(streams);

  useEffect(() => {
    setFilteredStreams(searchStreams(streams, searchTerm));
    setCurrentPage(1);
  }, [searchTerm, streams]);

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ query: value });
    } else {
      setSearchParams({});
    }
  };

  const totalPages = Math.ceil(filteredStreams.length / ITEMS_PER_PAGE);
  const currentStreams = filteredStreams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                    text-white p-6 relative overflow-hidden">
      <Background />
      
      <div className="max-w-[1400px] mx-auto relative">
        <div className="text-center mb-8">
          <Title />
          <p className="text-gray-400">
            Search through {filteredStreams.length} resources from past streams
          </p>
        </div>
        
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={handleSearch}
        />
        
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentStreams.map((stream, index) => (
              <StreamCard key={`${stream.date}-${index}`} stream={stream} />
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