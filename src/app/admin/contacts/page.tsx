"use client";

import { useEffect, useState } from "react";
import { getContactQueries } from "@/features/admin/api/admin.api";

export default function ContactQueriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  // ✅ FETCH FROM ADMIN API (CORRECT WAY)
  useEffect(() => {
    (async () => {
      try {
        const res = await getContactQueries();
        setData(res.data || []);
        setFiltered(res.data || []);
      } catch (err) {
        console.error("Contact API Error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const q = search.toLowerCase();

    const filteredData = data.filter((item) =>
      `${item.firstName} ${item.lastName} ${item.email} ${item.subject}`
        .toLowerCase()
        .includes(q)
    );

    setFiltered(filteredData);
  }, [search, data]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading contact queries...</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Contact Queries
          </h1>
          <p className="text-sm text-gray-400">
            Total {data.length} messages received
          </p>
        </div>

        <input
          placeholder="Search name, email, subject..."
          className="border px-4 py-2 rounded-xl text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {item.firstName} {item.lastName}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: #{item.id}
                      </span>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-700 text-xs">
                        {item.email}
                      </span>
                      <span className="text-gray-400 text-xs">
                        +91 {item.phone}
                      </span>
                    </div>
                  </td>

                  {/* SUBJECT */}
                  <td className="px-4 py-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                      {item.subject}
                    </span>
                  </td>

                  {/* MESSAGE PREVIEW */}
                  <td className="px-4 py-4 max-w-[200px] truncate text-gray-500 text-xs">
                    {item.message}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            No queries found
          </div>
        )}
      </div>

      {/* ── MODAL (DETAIL VIEW) ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg relative">

            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-2">
              {selected.subject}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {selected.firstName} {selected.lastName} • {selected.email}
            </p>

            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed">
              {selected.message}
            </div>

            <div className="mt-4 text-xs text-gray-400">
              {new Date(selected.createdAt).toLocaleString("en-IN")}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}