
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getCampaignAnalytics } from "@/features/admin/api/admin.api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Campaign {
  id: number;
  title: string;
  goalAmount: number;
  raisedAmount: number;
}
interface Stats {
  totalDonations: number;
  totalAmount: number;
  totalDonors: number;
  productDonations: number;
  moneyDonations: number;
}
interface Donor {
  userId: number;
  name: string;
  totalDonated: number;
}
interface Donation {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
}
interface TrendPoint {
  date: string;
  amount: number;
}
interface AnalyticsData {
  campaign: Campaign;
  stats: Stats;
  topDonors: Donor[];
  recentDonations: Donation[];
  trend: TrendPoint[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const fmtShort = (n: number) => {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n;
};

const initials = (name: string) => name.slice(0, 2).toUpperCase();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTrendDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

const progressColorClass = (pct: number) => {
  if (pct < 40) return "bg-red-400";
  if (pct < 75) return "bg-amber-300";
  return "bg-emerald-400";
};

const rankColorClass = (i: number) => {
  if (i === 0) return "text-amber-400";
  if (i === 1) return "text-slate-400";
  if (i === 2) return "text-orange-300";
  return "text-gray-300";
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1000) {
  const [current, setCurrent] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCurrent(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return current;
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-gray-400 text-[11px] mb-0.5">{label}</p>
      <p className="font-semibold text-sm">{fmt(payload[0].value)}</p>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  isCurrency = false,
  highlight = false,
}: {
  label: string;
  value: number;
  isCurrency?: boolean;
  highlight?: boolean;
}) {
  const counted = useCountUp(value);
  return (
    <div
      className={`rounded-2xl border px-4 py-3.5 flex flex-col gap-1.5 hover:shadow-md transition-shadow ${highlight ? "bg-rose-50 border-rose-100" : "bg-white border-gray-100"
        }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p
        className={`text-2xl font-semibold tracking-tight ${highlight ? "text-rose-500" : "text-gray-900"
          }`}
      >
        {isCurrency ? fmtShort(counted) : counted}
      </p>
    </div>
  );
}
export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = Number(params.campaignId); // ✅ FIX

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId || isNaN(campaignId)) return;
    (async () => {
      try {
        const res = await getCampaignAnalytics(campaignId); // ✅ now correct
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [campaignId]);

if (loading)
  return (
    <div className="flex items-center justify-center w-full h-full gap-3 text-gray-400 text-sm">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-rose-500 rounded-full animate-spin" />
      Loading analytics…
    </div>
  );

if (!data)
  return (
    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
      No data available.
    </div>
  );

const { campaign, stats, topDonors, recentDonations, trend } = data;
const pct = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
const remaining = campaign.goalAmount - campaign.raisedAmount;

return (
  <div className="w-full h-full bg-gray-50 p-5 flex flex-col gap-4 overflow-hidden">

    {/* ══ ROW 1: Hero + Stats ══ */}
    <div className="flex gap-4 shrink-0">

      {/* Hero — indigo → violet gradient */}
      <div className="relative rounded-2xl p-5 flex flex-col justify-between w-72 shrink-0 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 left-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 mb-2">
            Campaign
          </p>
          <h1 className="text-white font-semibold text-lg leading-snug mb-5 line-clamp-2">
            {campaign.title}
          </h1>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-white text-2xl font-semibold tracking-tight">
              {fmt(campaign.raisedAmount)}
            </span>
            <span className="text-indigo-200 text-xs">of {fmt(campaign.goalAmount)}</span>
          </div>

          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${progressColorClass(pct)}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-white/80 font-medium">{pct.toFixed(1)}% funded</span>
            <span className="text-indigo-200">{fmt(remaining)} left</span>
          </div>
        </div>

        <div className="relative z-10 mt-4 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-white/70">Active</span>
        </div>
      </div>

      {/* Stats 3×2 — last tile is teal completion */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
        <StatCard label="Total donations" value={stats.totalDonations} />
        <StatCard label="Revenue raised" value={stats.totalAmount} isCurrency highlight />
        <StatCard label="Unique donors" value={stats.totalDonors} />
        <StatCard label="Product donations" value={stats.productDonations} />
        <StatCard label="Money donations" value={stats.moneyDonations} />

        {/* Completion — teal gradient */}
        <div className="relative rounded-2xl px-4 py-3.5 flex flex-col gap-1.5 overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-500">
          <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-100 relative z-10">
            Completion
          </p>
          <p className="text-2xl font-semibold tracking-tight text-white relative z-10">
            {pct.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>

    {/* ══ ROW 2: Full-width trend chart ══ */}
    <div
      className="bg-white border border-gray-100 rounded-2xl flex flex-col shrink-0 overflow-hidden"
      style={{ height: "200px" }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50 shrink-0">
        <span className="text-sm font-semibold text-gray-800">Donation trend</span>
        {trend.length > 0 && (
          <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
            {trend.length === 1
              ? formatTrendDate(trend[0].date)
              : `${formatTrendDate(trend[0].date)} – ${formatTrendDate(
                trend[trend.length - 1].date
              )}`}
          </span>
        )}
      </div>
      <div className="flex-1 px-3 py-2 min-h-0">
        {trend.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            No trend data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatTrendDate}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                dy={4}
              />
              <YAxis
                tickFormatter={fmtShort}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#f0f0f0", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#e11d48"
                strokeWidth={2}
                fill="url(#trendGradient)"
                dot={{ r: 4, fill: "#e11d48", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#e11d48", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>

    {/* ══ ROW 3: Top Donors (left) + Recent Donations (right) ══ */}
    <div className="flex gap-4 flex-1 min-h-0">

      {/* Top Donors */}
      <div className="bg-white border border-gray-100 rounded-2xl flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50 shrink-0">
          <span className="text-sm font-semibold text-gray-800">Top donors</span>
          <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
            {topDonors.length} {topDonors.length === 1 ? "donor" : "donors"}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
          {topDonors.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-300 text-sm">
              No donors yet
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {topDonors.map((d, i) => (
                <div
                  key={d.userId}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold w-4 text-right shrink-0 ${rankColorClass(i)}`}>
                      {i + 1}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center text-[12px] font-semibold shrink-0">
                      {initials(d.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{d.name}</span>
                      <span className="text-[11px] text-gray-400">Donor #{d.userId}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {fmt(d.totalDonated)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white border border-gray-100 rounded-2xl flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50 shrink-0">
          <span className="text-sm font-semibold text-gray-800">Recent donations</span>
          <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
            {recentDonations.length} entries
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
          {recentDonations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-300 text-sm">
              No donations yet
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {recentDonations.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${d.type === "PRODUCT"
                        ? "bg-blue-50 border border-blue-100 text-blue-500"
                        : "bg-emerald-50 border border-emerald-100 text-emerald-600"
                        }`}
                    >
                      {d.type === "PRODUCT" ? "P" : "₹"}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full w-fit border ${d.type === "PRODUCT"
                          ? "bg-blue-50 text-blue-500 border-blue-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                      >
                        {d.type}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {formatDate(d.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {fmt(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  </div>
);
}
