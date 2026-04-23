// import { useEffect, useState } from "react";

// export default function DonationsFilters({ filters, setFilters }: any) {
//   const [search, setSearch] = useState(filters.search);

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setFilters((prev: any) => ({ ...prev, search, page: 1 }));
//     }, 500);

//     return () => clearTimeout(delay);
//   }, [search]);

//   return (
//     <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">

//       <input
//         placeholder="Search donor..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="border px-3 py-2 rounded"
//       />

//       <select
//         onChange={(e) =>
//           setFilters((p: any) => ({ ...p, status: e.target.value, page: 1 }))
//         }
//         className="border px-3 py-2 rounded"
//       >
//         <option value="">All Status</option>
//         <option value="SUCCESS">Success</option>
//         <option value="PENDING">Pending</option>
//         <option value="FAILED">Failed</option>
//       </select>

//       <input
//         type="date"
//         onChange={(e) =>
//           setFilters((p: any) => ({ ...p, fromDate: e.target.value }))
//         }
//         className="border px-3 py-2 rounded"
//       />

//       <input
//         type="date"
//         onChange={(e) =>
//           setFilters((p: any) => ({ ...p, toDate: e.target.value }))
//         }
//         className="border px-3 py-2 rounded"
//       />
//     </div>
//   );
// }

//new updated componenet 

import { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiCalendar, FiChevronDown, FiX } from "react-icons/fi";

export default function DonationsFilters({ filters, setFilters }: any) {
  const [search, setSearch] = useState(filters.search);

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters((prev: any) => ({ ...prev, search, page: 1 }));
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const hasActiveFilters =
    search || filters.status || filters.fromDate || filters.toDate;

  const clearAll = () => {
    setSearch("");
    setFilters((prev: any) => ({
      ...prev,
      search: "",
      status: "",
      fromDate: "",
      toDate: "",
      page: 1,
    }));
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">

        {/* Filter label */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-100 shrink-0">
          <div className="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center">
            <FiFilter size={13} className="text-rose-500" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:block">
            Filters
          </span>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <FiSearch
            size={13}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
            >
              <FiX size={13} />
            </button>
          )}
          <input
            placeholder="Search donor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Status select */}
        <div className="relative shrink-0">
          <FiChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={filters.status || ""}
            onChange={(e) =>
              setFilters((p: any) => ({ ...p, status: e.target.value, page: 1 }))
            }
            className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-8 py-2.5 text-sm text-gray-700 font-medium outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="SUCCESS">✅ Success</option>
            <option value="PENDING">🕐 Pending</option>
            <option value="FAILED">❌ Failed</option>
          </select>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <FiCalendar
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="date"
              value={filters.fromDate || ""}
              onChange={(e) =>
                setFilters((p: any) => ({ ...p, fromDate: e.target.value }))
              }
              className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition cursor-pointer"
            />
          </div>

          <span className="text-xs text-gray-400 font-medium shrink-0">to</span>

          <div className="relative">
            <FiCalendar
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="date"
              value={filters.toDate || ""}
              onChange={(e) =>
                setFilters((p: any) => ({ ...p, toDate: e.target.value }))
              }
              className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition cursor-pointer"
            />
          </div>
        </div>

        {/* Clear all button */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3.5 py-2.5 rounded-xl transition shrink-0"
          >
            <FiX size={12} />
            Clear
          </button>
        )}

      </div>
    </div>
  );
}
