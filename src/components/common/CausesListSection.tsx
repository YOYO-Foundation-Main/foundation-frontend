"use client";

import { useState } from "react";
import CauseCard from "@/components/ui/CauseCard";
import { useCauses } from "@/features/causes/hooks/useCauses";

const ITEMS_PER_PAGE = 6;

export default function CausesPage() {
  const { causes, loading, error } = useCauses();
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = causes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(causes.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">

      {/* HERO */}
      <div className="text-center py-16 border-b border-gray-200">
        <p className="text-sm text-gray-500 mb-3">Home &gt; Causes</p>
        <h1 className="text-4xl font-bold text-black mb-4">Our Causes</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Support a cause that matters. Every donation makes a difference.
        </p>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">

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
              className="border border-gray-300 px-4 py-2 rounded text-sm outline-none focus:border-[#D2252B]"
            />
            <button className="bg-[#D2252B] text-white px-5 py-2 rounded text-sm hover:bg-[#b91f24] transition">
              Search
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-8 bg-gray-200 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-center text-red-500 py-10">{error}</p>
          )}

          {/* GRID */}
          {!loading && !error && (
            <>
              {paginated.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No causes found</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {paginated.map((cause) => (
                    <CauseCard
                      key={cause.id}
                      id={String(cause.id)}
                      name={cause.name}
                      image={cause.image}
                      description={cause.description}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
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
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

