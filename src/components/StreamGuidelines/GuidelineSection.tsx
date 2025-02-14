import React from 'react';

interface GuidelineItem {
  text: string;
  emoji?: string;
  link?: string;
}

interface GuidelineSectionProps {
  title: string;
  items: GuidelineItem[];
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
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-400/30 hover:decoration-purple-300"
                >
                  {item.text}
                </a>
              ) : (
                item.text
              )}
              {item.emoji && <span className="ml-1">{item.emoji}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
