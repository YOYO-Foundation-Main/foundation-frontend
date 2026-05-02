
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminGetUsers } from "@/features/admin/api/admin.api";
import {
  FiSearch, FiChevronLeft, FiChevronRight,
  FiUsers, FiTrendingUp, FiZap, FiClock,
} from "react-icons/fi";

type User = {
  id: number;
  name: string;
  email: string;
  totalDonated: number;
  totalDonations: number;
  avgDonation: number;
  lastDonation: string | null;
  donationTypeSplit?: { money: number; product: number };
  favoriteCause: string | null;
  engagementScore: number;
  status: "NEW" | "MEDIUM" | "HIGH_VALUE" | "INACTIVE";
};

const STATUS_CONFIG: Record<
  User["status"],
  { label: string; badge: string; dot: string }
> = {
  HIGH_VALUE: {
    label: "High Value",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
  },
  MEDIUM: {
    label: "Medium",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
  NEW: {
    label: "New",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-400",
  },
  INACTIVE: {
    label: "Inactive",
    badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-300",
  },
};

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-teal-500",
  "from-blue-500 to-indigo-600",
  "from-emerald-400 to-green-600",
  "from-fuchsia-500 to-purple-600",
  "from-red-400 to-rose-600",
];
function getGradient(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

function ScoreRing({ score }: { score: number }) {
  const max = 150;
  const pct = Math.min(score / max, 1); 
  const r = 13;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const strokeColor =
    pct >= 0.65 ? "#16a34a" : pct >= 0.3 ? "#d97706" : pct > 0 ? "#3b82f6" : "#e2e8f0";

  return (
    <div className="flex items-center gap-2">
      <svg
        width="34"
        height="34"
        className="rotate-[-90deg] shrink-0"
      >
        <circle cx="17" cy="17" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3" />
        <circle
          cx="17"
          cy="17"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[13px] font-bold text-slate-800 tabular-nums w-6">
        {score}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-4 px-6 py-4 border-b border-slate-100 items-center"
      style={{ gridTemplateColumns: "2.4fr 1fr 1fr 0.6fr 1.4fr 1fr 1fr 0.9fr" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 bg-slate-100 animate-pulse rounded" />
          <div className="h-2.5 w-40 bg-slate-100 animate-pulse rounded" />
        </div>
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-3 w-16 bg-slate-100 animate-pulse rounded" />
      ))}
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"topDonors" | "engagement" | "recent">("topDonors");

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await adminGetUsers({ page, limit: 10, search: debouncedSearch, sortBy });
        setUsers(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalUsers(res.meta?.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, debouncedSearch, sortBy]);

  const from = (page - 1) * 10 + 1;
  const to = Math.min(page * 10, totalUsers || users.length);

  const pageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const SORT_OPTIONS = [
    { key: "topDonors" as const, label: "Top Donors", Icon: FiTrendingUp },
    { key: "engagement" as const, label: "Engagement", Icon: FiZap },
    { key: "recent" as const, label: "Recent", Icon: FiClock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
            <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
              Admin · Donor Management
            </span>
          </div>
          <h1 className="text-[38px] font-black text-slate-900 leading-tight tracking-tight">
            User Directory
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {totalUsers > 0
              ? `${totalUsers.toLocaleString()} registered donors`
              : "Track donation patterns, engagement & donor health"}
          </p>
        </div>

        {/* Status legend */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "High Value", dot: "bg-emerald-400", desc: "Score ≥ 65" },
            { label: "Medium", dot: "bg-amber-400", desc: "Score 30–64" },
            { label: "New", dot: "bg-blue-400", desc: "First donor" },
            { label: "Inactive", dot: "bg-slate-300", desc: "No donations" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
              <div>
                <p className="text-xs font-700 font-bold text-slate-700 leading-none">{c.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">

        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition"
          />
        </div>

        {/* Sort Pills */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
          {SORT_OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setPage(1); setSortBy(key); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150
                ${sortBy === key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && totalUsers > 0 && (
          <span className="ml-auto text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">{from}–{to}</span>
            {" "}of{" "}
            <span className="font-semibold text-slate-600">{totalUsers}</span>
          </span>
        )}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Head */}
        <div
          className="grid px-6 py-3.5 bg-slate-50 border-b border-slate-100"
          style={{ gridTemplateColumns: "2.4fr 1fr 1fr 0.6fr 1.4fr 1fr 1fr 0.9fr" }}
        >
          {["Donor", "Total Donated", "Avg Gift", "Gifts", "Cause", "Eng. Score", "Status", "Last Gift"].map((h) => (
            <span key={h} className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              {h}
            </span>
          ))}
        </div>

        {/* Skeletons */}
        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

        {/* Empty */}
        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <FiUsers size={36} className="mb-3" />
            <p className="text-sm font-semibold text-slate-400">No donors found</p>
            <p className="text-xs text-slate-300 mt-1">Try a different search or filter</p>
          </div>
        )}

        {/* Rows */}
        {!loading && users.map((u, i) => {
          const cfg = STATUS_CONFIG[u.status];
          const grad = getGradient(u.name);
          const initials = u.name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";

          return (
            <div
              key={u.id}
              onClick={() => router.push(`/admin/users/${u.id}`)}
              className="grid px-6 py-3.5 border-b border-slate-100 last:border-b-0 cursor-pointer items-center
                hover:bg-amber-50 hover:shadow-[inset_3px_0_0_#f59e0b] transition-all duration-150"
              style={{
                gridTemplateColumns: "2.4fr 1fr 1fr 0.6fr 1.4fr 1fr 1fr 0.9fr",
                animationDelay: `${i * 30}ms`,
              }}
            >
              {/* Donor */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm`}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate leading-snug">
                    {u.name.trim()}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
              </div>

              {/* Total Donated */}
              <span className="text-sm font-bold text-slate-800 tabular-nums">
                {u.totalDonated > 0
                  ? <span className="text-amber-600">₹{u.totalDonated.toLocaleString("en-IN")}</span>
                  : <span className="text-slate-300">₹0</span>
                }
              </span>

              {/* Avg Gift */}
              <span className="text-sm text-slate-500 tabular-nums">
                {u.avgDonation > 0 ? `₹${u.avgDonation.toLocaleString("en-IN")}` : <span className="text-slate-300">—</span>}
              </span>

              {/* Gifts count */}
              <span className="text-sm font-semibold text-slate-600 tabular-nums">
                {u.totalDonations > 0 ? u.totalDonations : <span className="text-slate-300">0</span>}
              </span>

              {/* Cause */}
              <div className="min-w-0 overflow-hidden">
                {u.favoriteCause ? (
                  <span className="inline-block max-w-full truncate text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {u.favoriteCause}
                  </span>
                ) : (
                  <span className="text-slate-300 text-sm">—</span>
                )}
              </div>

              {/* Score Ring */}
              <ScoreRing score={u.engagementScore} />

              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${cfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                {cfg.label}
              </span>

              {/* Last Gift */}
              <span className="text-xs text-slate-400 tabular-nums">
                {u.lastDonation
                  ? new Date(u.lastDonation).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })
                  : <span className="text-slate-300">—</span>
                }
              </span>
            </div>
          );
        })}
      </div>

      {/* ── PAGINATION ── */}
      <div className="flex items-center justify-between mt-5 pb-4">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm
            hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-150
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200"
        >
          <FiChevronLeft size={14} />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className="px-2 text-slate-400 text-sm">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-150
                  ${page === p
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm
            hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-150
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200"
        >
          Next
          <FiChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
