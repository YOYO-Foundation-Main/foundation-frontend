"use client";

import { useState } from "react";
import CauseCard from "@/components/ui/CauseCard";
import { causes } from "@/constants/causes";

const ITEMS_PER_PAGE = 6;

export default function CausesListSection() {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const selectedCauses = causes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(causes.length / ITEMS_PER_PAGE);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">
            Latest Causes
          </h2>

          <button className="border border-black text-[#282828] px-5 py-2 rounded-md text-sm hover:bg-black hover:text-white transition">
            ALL CAUSES
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-10">
          
          {["Today", "Yesterday", "Last 7 days", "Last 30 days"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 border border-gray-300 rounded text-sm text-[#282828] hover:bg-[#D2252B] hover:text-white transition"
            >
              {item}
            </button>
          ))}

          <input
            placeholder="Search..."
            className="border border-gray-300 px-4 py-2 rounded text-sm text-[#282828] placeholder:text-gray-400 outline-none focus:border-[#D2252B]"
          />

          <button className="bg-[#D2252B] text-white px-5 py-2 rounded text-sm hover:bg-[#b91f24] transition">
            Search
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {selectedCauses.map((cause) => (
            <CauseCard
              key={cause.id} // ✅ FIXED
              id={String(cause.id)} // ✅ IMPORTANT for routing
              title={cause.title}
              image={cause.image}
              description={cause.description}
              goal={cause.goal}
              raised={cause.raised}
              donations={cause.donations}
            />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-12 gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded transition ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "text-[#282828] border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}