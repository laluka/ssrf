import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { StreamCard } from './components/StreamCard';
import { Pagination } from './components/Pagination';
import { Background } from './components/Background';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { StreamGuidelines } from './components/StreamGuidelines';
import { searchStreams } from './utils/search';
import { useStreamData } from './hooks/useStreamData';

const ITEMS_PER_PAGE = 12; // Show 12 items per page (4 rows × 3 columns)

function App() {
  const { streams, loading, error } = useStreamData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [filteredStreams, setFilteredStreams] = useState(streams);

  React.useEffect(() => {
    setFilteredStreams(searchStreams(streams, searchTerm));
    setCurrentPage(1);
  }, [searchTerm, streams]);

  const totalPages = Math.ceil(filteredStreams.length / ITEMS_PER_PAGE);
  const currentStreams = filteredStreams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                    text-white p-6 relative overflow-hidden">
      <Background />
      
      <StreamGuidelines isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
      
      <div className="max-w-[1400px] mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text 
                         bg-gradient-to-r from-purple-400 via-twitch-purple to-blue-500">
            SSRF - Simple Stream Resource Finder
          </h1>
          <p className="text-gray-400">
            Search through {filteredStreams.length} resources from past streams
          </p>
        </div>
        
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={setSearchTerm}
          onGuidelinesClick={() => setShowGuidelines(true)}
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

export default App;