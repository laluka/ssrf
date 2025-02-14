import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Background } from '../components/Background';
import { GuidelineSection } from '../components/StreamGuidelines/GuidelineSection';
import { guidelines } from '../components/StreamGuidelines/guidelinesData';

export function Guidelines() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                    text-white p-6 relative overflow-hidden"
    >
      <Background />

      <div className="max-w-2xl mx-auto relative">
        <Link
          to="/search"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 
                     transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Search
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
          <h1 className="text-2xl font-bold mb-6">Stream Guidelines</h1>

          {Object.entries(guidelines).map(([title, items]) => (
            <GuidelineSection key={title} title={title} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
}
