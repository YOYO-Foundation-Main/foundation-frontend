"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How to learn digital marketing?",
    a: "You can start with online courses and practice real projects.",
  },
  {
    q: "Can I use the demos made by Ewboot?",
    a: "Yes, you can use them for learning and personal projects.",
  },
  {
    q: "Why didn't you showcase my submission?",
    a: "Due to limited space, only selected works are displayed.",
  },
  {
    q: "What everybody ought to know about digital marketing?",
    a: "Consistency, analytics, and user understanding are key.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <div className="mt-12 text-black">
      {faqs.map((item, index) => (
        <div
          key={index}
          className="border-[#04121F14] mb-3 bg-white"
        >
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-bold"
          >
            {item.q}
            <span>{openIndex === index ? "−" : "+"}</span>
          </button>

          {openIndex === index && (
            <p className="px-4 pb-4 text-sm text-gray-600">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}