import React from 'react';

interface GuidelineSectionProps {
  title: string;
  items: Array<{ text: string; emoji?: string }>;
}

export function GuidelineSection({ title, items }: GuidelineSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-purple-300">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <span className="mr-2">•</span>
            <span>
              {item.text}
              {item.emoji && <span className="ml-1">{item.emoji}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}