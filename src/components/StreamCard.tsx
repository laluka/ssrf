import React, { useState } from 'react';
import { Youtube, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { StreamData } from '../types';
import { extractYoutubeId, getYoutubeThumbnail } from '../utils/youtube';

interface StreamCardProps {
  stream: StreamData;
}

export function StreamCard({ stream }: StreamCardProps) {
  const videoId = extractYoutubeId(stream.stream_link);
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string>('');
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [searchParams] = useSearchParams();
  const [showLinks, setShowLinks] = useState(false);

  React.useEffect(() => {
    getYoutubeThumbnail(videoId).then(setThumbnailUrl);
  }, [videoId]);

  const searchTerm = searchParams.get('query')?.toLowerCase() || '';

  const filteredLinks = searchTerm
    ? stream.covered_links.filter((link) => link.toLowerCase().includes(searchTerm))
    : stream.covered_links;

  const searchLen = searchTerm.length;

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform 
                    hover:scale-102 transition-all duration-300 border border-gray-700/50 
                    hover:border-purple-500/50 group"
    >
      <a
        href={stream.stream_link}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video relative overflow-hidden bg-gray-900 group cursor-pointer"
      >
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={thumbnailUrl}
          alt={stream.stream_name}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <Youtube className="w-12 h-12 text-red-500" />
        </div>
      </a>

      <div className="p-4">
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <Calendar size={14} className="mr-1 text-purple-400" />
          <span className="font-medium">{stream.date}</span>
        </div>

        <h3 className="text-gray-100 font-medium mb-3 line-clamp-2 min-h-[3rem]">
          {stream.stream_name}
        </h3>

        {searchLen === 0 && (
          <button
            onClick={() => setShowLinks(!showLinks)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mt-2 mx-auto"
          >
            {showLinks ? (
              <>
                Hide links <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show links <ChevronDown size={16} />
              </>
            )}
          </button>
        )}

        {(searchLen > 0 || showLinks) && (
          <div className="space-y-2">
            {filteredLinks.map((link, index) => (
              <div key={index} className="transition-all duration-100 hover:pl-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-300 hover:text-purple-200 block 
                           whitespace-nowrap overflow-hidden text-ellipsis"
                  title={link}
                >
                  {link}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
