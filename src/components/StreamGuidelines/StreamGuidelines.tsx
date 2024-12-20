import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { GuidelineSection } from './GuidelineSection';
import { guidelines } from './guidelinesData';
import { useClickOutside } from '../../hooks/useClickOutside';

interface StreamGuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StreamGuidelines({ isOpen, onClose }: StreamGuidelinesProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Stream Guidelines</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {Object.entries(guidelines).map(([title, items]) => (
            <GuidelineSection key={title} title={title} items={items} />
          ))}
        </div>

        <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg 
                     transition-colors shadow-lg font-medium"
          >
            Gotcha!
          </button>
        </div>
      </div>
    </div>
  );
}