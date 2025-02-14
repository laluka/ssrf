import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  title: string;
}

export function IconButton({ icon: Icon, onClick, href, title }: IconButtonProps) {
  const className =
    'flex items-center justify-center px-4 py-3 bg-gray-800 \
                    hover:bg-gray-700 transition-colors rounded-lg text-gray-300 \
                    border border-gray-700';

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} title={title}>
        <Icon className="w-5 h-5" />
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className} title={title}>
      <Icon className="w-5 h-5" />
    </button>
  );
}
