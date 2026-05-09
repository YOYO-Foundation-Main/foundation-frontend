"use client";
import { useEffect, useState } from "react";
import { getContactQueries } from "@/features/admin/api/admin.api";

/* ── avatar color palette ── */
const AVATAR_COLORS = [
  ["#fde68a", "#92400e"],
  ["#bbf7d0", "#065f46"],
  ["#bfdbfe", "#1e3a8a"],
  ["#fecaca", "#7f1d1d"],
  ["#e9d5ff", "#4c1d95"],
  ["#fed7aa", "#7c2d12"],
  ["#99f6e4", "#134e4a"],
];

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

const SUBJECT_TAGS: Record<string, string> = {
  donation: "bg-emerald-100 text-emerald-700 border-emerald-200",
  volunteer: "bg-blue-100 text-blue-700 border-blue-200",
  testing: "bg-gray-100 text-gray-600 border-gray-200",
};

function subjectClass(subject: string) {
  const key = Object.keys(SUBJECT_TAGS).find((k) =>
    subject.toLowerCase().includes(k)
  );
  return key ? SUBJECT_TAGS[key] : "bg-rose-50 text-rose-600 border-rose-200";
}

/* ── format date ── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ══════════════════════════════════════════ */
export default function ContactQueriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContactQueries();
        setData(res.data || []);
        setFiltered(res.data || []);
        setTimeout(() => setAnimIn(true), 80);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      data.filter((item) =>
        `${item.firstName} ${item.lastName} ${item.email} ${item.subject}`
          .toLowerCase()
          .includes(q)
      )
    );
  }, [search, data]);

  const openModal = (item: any) => {
    setSelected(item);
  };
  const closeModal = () => setSelected(null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-rose-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading queries…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">

      {/* ── PAGE HEADER ── */}
      <div
        className="mb-8 transition-all duration-500"
        style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(16px)" }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>
            {/* <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-1">
              Admin Panel
            </p> */}
            <h1 className="text-3xl font-black text-slate-800 leading-tight">
              Contact Queries
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {data.length} messages received · {filtered.length} shown
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Search name, email, subject…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Messages", value: data.length, color: "text-slate-800", bg: "bg-white" },
            { label: "This Month", value: data.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).length, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Donation Queries", value: data.filter(d => d.subject.toLowerCase().includes("donat")).length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Unique Emails", value: new Set(data.map(d => d.email)).size, color: "text-blue-600", bg: "bg-blue-50" },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.bg} rounded-2xl border border-slate-100 px-5 py-4 shadow-sm transition-all duration-500`}
              style={{ transitionDelay: `${i * 60}ms`, opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(12px)" }}
            >
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUERY CARDS ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
          </svg>
          <p className="font-semibold text-sm">No queries found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item, idx) => {
            const [bgColor, textColor] = getAvatarColor(item.id);
            return (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-200 cursor-pointer px-5 py-4 flex items-center gap-5"
                style={{
                  transitionDelay: `${idx * 30}ms`,
                  opacity: animIn ? 1 : 0,
                  transform: animIn ? "translateY(0)" : "translateY(10px)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-sm font-black shadow-sm"
                  style={{ background: bgColor, color: textColor }}
                >
                  {getInitials(item.firstName, item.lastName)}
                </div>

                {/* Name + email */}
                <div className="min-w-0 w-44 shrink-0">
                  <p className="font-bold text-slate-800 text-sm truncate capitalize">
                    {item.firstName} {item.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{item.email}</p>
                </div>

                {/* Subject tag */}
                <div className="hidden md:flex shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${subjectClass(item.subject)}`}>
                    {item.subject.length > 22 ? item.subject.slice(0, 22) + "…" : item.subject}
                  </span>
                </div>

                {/* Message preview */}
                <p className="hidden lg:block flex-1 text-xs text-slate-400 truncate min-w-0">
                  {item.message}
                </p>

                {/* Phone */}
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-xs text-slate-400">+91 {item.phone}</span>
                </div>

                {/* Date */}
                <div className="ml-auto shrink-0 text-right">
                  <p className="text-xs text-slate-400 whitespace-nowrap">{fmtDate(item.createdAt)}</p>
                  <p className="text-xs text-slate-300">#{item.id}</p>
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 text-slate-300 group-hover:text-rose-400 transition shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ animation: "modalIn 0.25s ease-out forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400" />

            <div className="p-6">
              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  {(() => {
                    const [bg, fg] = getAvatarColor(selected.id);
                    return (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-black shadow"
                        style={{ background: bg, color: fg }}
                      >
                        {getInitials(selected.firstName, selected.lastName)}
                      </div>
                    );
                  })()}
                  <div>
                    <p className="font-black text-slate-800 capitalize">
                      {selected.firstName} {selected.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{selected.email}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Subject</p>
                <span className={`inline-flex text-xs font-semibold px-3 py-1.5 rounded-full border ${subjectClass(selected.subject)}`}>
                  {selected.subject}
                </span>
              </div>

              {/* Message */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Message</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
                  {selected.message}
                </div>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-slate-700">+91 {selected.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Received</p>
                  <p className="text-sm font-semibold text-slate-700">{fmtDateTime(selected.createdAt)}</p>
                </div>
              </div>

              {/* Reply button */}
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-rose-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                </svg>
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
