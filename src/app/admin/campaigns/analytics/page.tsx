
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminGetCampaigns } from "@/features/admin/api/admin.api";

// ─── Progress bar color based on percentage ───────────────────────────────────
const progressBarClass = (pct: number) => {
  if (pct < 35) return "bg-red-400";
  if (pct < 70) return "bg-amber-400";
  return "bg-emerald-500";
};

const progressTextClass = (pct: number) => {
  if (pct < 35) return "text-red-400";
  if (pct < 70) return "text-amber-500";
  return "text-emerald-500";
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    PENDING:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
    REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border backdrop-blur-sm ${
        styles[status] ?? "bg-gray-500/15 text-gray-400 border-gray-500/20"
      }`}
    >
      {status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-44 bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 bg-gray-100 rounded-lg" />
            <div className="h-3 w-1/2 bg-gray-100 rounded-lg" />
            <div className="h-2 w-full bg-gray-100 rounded-full" />
            <div className="flex justify-between">
              <div className="h-5 w-1/3 bg-gray-100 rounded-lg" />
              <div className="h-5 w-1/4 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
        📊
      </div>
      <p className="text-base font-semibold text-gray-700">No campaigns yet</p>
      <p className="text-sm text-gray-400">Create one to start tracking analytics</p>
    </div>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────
function CampaignCard({ c, onClick }: { c: any; onClick: () => void }) {
  const progress = Math.min((c.raisedAmount / c.goalAmount) * 100 || 0, 100);
  const rounded = Math.round(progress);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={c.image}
          alt={c.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge — top right */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={c.status} />
        </div>

        {/* Donation count — bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="text-[11px] text-white/90 font-medium">
            {c.donations?.length || 0} donations
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">

        {/* Title + location */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {c.title}
          </h2>
          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM2 6a6 6 0 1110.74 3.67l3.3 3.29a.75.75 0 11-1.06 1.06l-3.3-3.29A6 6 0 012 6z" clipRule="evenodd"/>
            </svg>
            {c.location}
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Progress</span>
            <span className={`text-[11px] font-semibold ${progressTextClass(progress)}`}>
              {rounded}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressBarClass(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Amounts + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-base font-semibold text-gray-900 tracking-tight">
              ₹{c.raisedAmount.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400">
              of ₹{c.goalAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-indigo-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Analytics
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Ends {new Date(c.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <div className={`h-1.5 w-16 rounded-full overflow-hidden bg-gray-100`}>
            <div
              className={`h-full rounded-full ${progressBarClass(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CampaignAnalyticsListPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await adminGetCampaigns();
        setCampaigns(res.campaigns || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derived counts
  const approved = campaigns.filter((c) => c.status === "APPROVED").length;
  const pending  = campaigns.filter((c) => c.status === "PENDING").length;

  return (
    <div className="min-h-full bg-gray-50 p-6 flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Campaign Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor performance &amp; donation insights
          </p>
        </div>

        {/* Quick stat pills */}
        {!loading && campaigns.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold bg-white border border-gray-100 text-gray-600 px-3 py-1.5 rounded-full shadow-sm">
              {campaigns.length} total
            </span>
            <span className="text-[11px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full">
              {approved} approved
            </span>
            {pending > 0 && (
              <span className="text-[11px] font-semibold bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1.5 rounded-full">
                {pending} pending
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <Skeleton />
      ) : campaigns.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              c={c}
              onClick={() => router.push(`/admin/campaigns/analytics/${c.id}`)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
