import React from 'react';
import { MessageCircle, Share2 } from 'lucide-react';

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      <a
        href="https://discord.com/invite/tH8wEpNKWS"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 
                   hover:bg-gray-700 transition-colors rounded-lg text-gray-300 
                   border border-gray-700"
        title="Join Discord"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
      <a
        href="https://linktr.ee/TheLaluka"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 
                   hover:bg-gray-700 transition-colors rounded-lg text-gray-300 
                   border border-gray-700"
        title="Social Links"
      >
        <Share2 className="w-5 h-5" />
      </a>
    </div>
  );
}