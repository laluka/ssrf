import React from 'react';
import {
  Coffee,
  CookingPot,
  ChefHat,
  Utensils,
  Croissant,
  Terminal,
  Container,
} from 'lucide-react';

export function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Abstract shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-cuistops-brown/5 rounded-full blur-3xl" />
      </div>

      {/* Floating cook & devops icons */}
      <div className="absolute top-20 -left-10 opacity-5 animate-float-slow">
        <Coffee size={100} />
      </div>
      <div className="absolute top-40 right-20 opacity-5 animate-float-medium">
        <CookingPot size={80} />
      </div>
      <div className="absolute bottom-20 -right-10 opacity-5 animate-float-fast">
        <ChefHat size={120} />
      </div>
      <div className="absolute bottom-40 left-20 opacity-5 animate-float-medium">
        <Terminal size={90} />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-5 animate-float-slow">
        <Utensils size={70} />
      </div>
      <div className="absolute top-2/3 right-1/4 opacity-5 animate-float-fast">
        <Container size={60} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 animate-float-medium">
        <Croissant size={200} />
      </div>
    </div>
  );
}
