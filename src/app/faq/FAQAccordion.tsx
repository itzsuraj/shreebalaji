'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            {openItems.includes(index) ? (
              <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
            )}
          </button>
          {openItems.includes(index) && (
            <div className="px-6 pb-4">
              <p className="text-gray-900 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 