import React from 'react';
import { Loader } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader className="w-8 h-8 animate-spin text-twitch-purple" />
    </div>
  );
}