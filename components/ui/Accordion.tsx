"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-md"
        >
          {/* Question Button */}
          <button
            onClick={() => toggleItem(index)}
            className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50"
            aria-expanded={openIndex === index}
          >
            <span className="pr-8 font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
              {item.question}
            </span>

            {/* Icon */}
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 transition-all duration-300 group-hover:bg-blue-600 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              <svg
                className={`h-4 w-4 transition-colors duration-300 ${
                  openIndex === index ? "text-white" : "text-blue-600 group-hover:text-white"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* Answer Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 pb-5 pt-2">
              <p className="leading-relaxed text-gray-600">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
