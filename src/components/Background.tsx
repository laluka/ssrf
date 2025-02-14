import React from 'react';
import { Code2, Shield, Globe, Lock, Server, Wifi, Database } from 'lucide-react';

export function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Abstract shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-twitch-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Icons */}
      <div className="absolute top-20 -left-10 opacity-5 animate-float-slow">
        <Shield size={100} />
      </div>
      <div className="absolute top-40 right-20 opacity-5 animate-float-medium">
        <Globe size={80} />
      </div>
      <div className="absolute bottom-20 -right-10 opacity-5 animate-float-fast">
        <Lock size={120} />
      </div>
      <div className="absolute bottom-40 left-20 opacity-5 animate-float-medium">
        <Server size={90} />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-5 animate-float-slow">
        <Wifi size={70} />
      </div>
      <div className="absolute top-2/3 right-1/4 opacity-5 animate-float-fast">
        <Database size={60} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 animate-float-medium">
        <Code2 size={200} />
      </div>
    </div>
  );
}