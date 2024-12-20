import React from 'react';
import { ExternalLink, Youtube } from 'lucide-react';
import { StreamData } from '../types';
import { extractYoutubeId, getYoutubeThumbnail } from '../utils/youtube';

interface StreamCardProps {
  stream: StreamData;
}

export function StreamCard({ stream }: StreamCardProps) {
  const videoId = extractYoutubeId(stream.stream_link);
  const thumbnailUrl = getYoutubeThumbnail(videoId);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform 
                    hover:scale-102 transition-all duration-300 border border-gray-700/50 
                    hover:border-purple-500/50 group">
      <a 
        href={stream.stream_link}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video relative overflow-hidden bg-gray-900 group cursor-pointer"
      >
        <img
          src={thumbnailUrl}
          alt={stream.stream_name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <Youtube className="w-12 h-12 text-red-500" />
        </div>
      </a>
      
      <div className="p-4">
        <div className="flex items-center text-gray-400 text-sm mb-2">
          {stream.date}
        </div>
        
        <h3 className="text-gray-100 font-medium mb-3 line-clamp-2 min-h-[3rem]">
          {stream.stream_name}
        </h3>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-400 break-all">
            {stream.covered_link}
          </div>
          <div className="flex gap-4 mt-2">
            <a
              href={stream.covered_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm 
                       hover:translate-x-1 transition-transform"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Resource
            </a>
            <a
              href={stream.stream_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-red-400 hover:text-red-300 text-sm
                       hover:translate-x-1 transition-transform"
            >
              <Youtube className="w-4 h-4 mr-1" />
              Watch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}