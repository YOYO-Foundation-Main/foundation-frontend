// export default function Pagination({ pagination, setFilters }: any) {
//   if (!pagination) return null;

//   return (
//     <div className="flex justify-between items-center">
//       <p>Page {pagination.page} of {pagination.pages}</p>

//       <div className="flex gap-2">
//         <button
//           disabled={pagination.page === 1}
//           onClick={() =>
//             setFilters((p: any) => ({ ...p, page: p.page - 1 }))
//           }
//         >
//           Prev
//         </button>

//         <button
//           disabled={pagination.page === pagination.pages}
//           onClick={() =>
//             setFilters((p: any) => ({ ...p, page: p.page + 1 }))
//           }
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

//new pagination component

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ pagination, setFilters }: any) {
  if (!pagination) return null;

  const { page, pages, total } = pagination;

  const goTo = (p: number) => setFilters((prev: any) => ({ ...prev, page: p }));

  // Build page number list with ellipsis
  const getPageNumbers = () => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", pages];
    if (page >= pages - 2) return [1, "...", pages - 3, pages - 2, pages - 1, pages];
    return [1, "...", page - 1, page, page + 1, "...", pages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-3.5">

      {/* Left — record info */}
      <p className="text-xs text-gray-400 font-medium">
        Page{" "}
        <span className="text-gray-700 font-bold">{page}</span>
        {" "}of{" "}
        <span className="text-gray-700 font-bold">{pages}</span>
        {total && (
          <>
            {" "}·{" "}
            <span className="text-rose-500 font-bold">{total}</span>
            {" "}records
          </>
        )}
      </p>

      {/* Right — controls */}
      <div className="flex items-center gap-1.5">

        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => goTo(page - 1)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            enabled:border-gray-200 enabled:text-gray-600 enabled:bg-gray-50 enabled:hover:bg-gray-100 enabled:hover:border-gray-300"
        >
          <FiChevronLeft size={13} />
          Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-gray-400 font-medium">
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(p as number)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  p === page
                    ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          disabled={page === pages}
          onClick={() => goTo(page + 1)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            enabled:border-gray-200 enabled:text-gray-600 enabled:bg-gray-50 enabled:hover:bg-gray-100 enabled:hover:border-gray-300"
        >
          Next
          <FiChevronRight size={13} />
        </button>

      </div>
    </div>
  );
}
