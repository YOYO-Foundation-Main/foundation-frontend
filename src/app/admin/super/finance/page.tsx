
"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Users,
  HeartHandshake,
  Megaphone,
  Wallet,
  CalendarDays,
  CalendarRange,
  Sparkles,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { getFinanceOverview } from "@/features/super-admin/api/finance.api";

type FinanceOverview = {
  totalDonations: number;
  totalDonationAmount: number;
  totalPlatformTips: number;
  totalPaidAmount: number;
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  revenueGrowth: number;
  totalDonors: number;
  totalCampaigns: number;
};

const fmt = (n: number) => n.toLocaleString("en-IN");

export default function SuperFinanceDashboard() {
  const [data, setData] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await getFinanceOverview();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-red-600" />
        <p className="text-sm text-gray-400">Loading finance overview…</p>
      </div>
    );
  }

  const d = data!;
  const growth = d.revenueGrowth ?? 0;
  const isPositiveGrowth = growth >= 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-1">Finance Overview</p>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time snapshot of platform-wide financial activity.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Data
        </span>
      </div>

      {/* ── Hero Revenue Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Revenue — hero card */}
        <div className="sm:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6 flex flex-col justify-between min-h-[160px]">
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-red-600/20 blur-2xl" />
          <div className="absolute bottom-0 right-16 w-24 h-24 rounded-full bg-red-500/10 blur-xl" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Total Revenue Collected</p>
              <h2 className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                ₹{fmt(d.totalPaidAmount)}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Across <span className="text-white font-semibold">{d.totalDonations}</span> donations from{" "}
                <span className="text-white font-semibold">{d.totalDonors}</span> donors
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <Wallet className="text-red-400 h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositiveGrowth ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {isPositiveGrowth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {growth}% growth
            </span>
            <span className="text-gray-600 text-xs">compared to previous period</span>
          </div>
        </div>

        {/* Revenue Growth card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Revenue Growth</p>
              <h2 className={`text-4xl font-extrabold mt-2 tracking-tight ${isPositiveGrowth ? "text-green-600" : "text-red-600"}`}>
                {growth}%
              </h2>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isPositiveGrowth ? "bg-green-50" : "bg-red-50"}`}>
              {isPositiveGrowth
                ? <TrendingUp className="text-green-600 h-5 w-5" />
                : <TrendingDown className="text-red-600 h-5 w-5" />
              }
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${isPositiveGrowth ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(Math.abs(growth), 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Platform growth indicator</p>
          </div>
        </div>
      </div>

      {/* ── Revenue Timeline ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Revenue Timeline</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Today's Revenue", value: d.todayRevenue, icon: Sparkles, accent: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
            { label: "This Month", value: d.monthRevenue, icon: CalendarDays, accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "This Year", value: d.yearRevenue, icon: CalendarRange, accent: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
          ].map(({ label, value, icon: Icon, accent, bg, border }) => (
            <div key={label} className={`rounded-2xl bg-white border ${border} shadow-sm p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-6 w-6 ${accent}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">₹{fmt(value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Money Flow ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Money Flow</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Donation Amount */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <IndianRupee className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Gross Donation Amount</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">₹{fmt(d.totalDonationAmount)}</p>
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full">
              <div className="h-1.5 rounded-full bg-red-500" style={{ width: "100%" }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Total amount donated by all donors</p>
          </div>

          {/* Platform Tips */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <HeartHandshake className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Platform Support Tips</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">₹{fmt(d.totalPlatformTips)}</p>
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full">
              <div
                className="h-1.5 rounded-full bg-purple-500"
                style={{ width: `${Math.min((d.totalPlatformTips / Math.max(d.totalDonationAmount, 1)) * 100 * 5, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {d.totalDonationAmount > 0
                ? `${((d.totalPlatformTips / d.totalDonationAmount) * 100).toFixed(1)}% of total donation amount`
                : "No donations yet"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Platform Stats ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Platform Activity</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Total Donations count */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <IndianRupee className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Donations</p>
              <p className="text-2xl font-extrabold text-gray-900">{fmt(d.totalDonations)}</p>
              <p className="text-xs text-gray-400 mt-0.5">transactions processed</p>
            </div>
          </div>

          {/* Total Donors */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Donors</p>
              <p className="text-2xl font-extrabold text-gray-900">{fmt(d.totalDonors)}</p>
              <p className="text-xs text-gray-400 mt-0.5">registered contributors</p>
            </div>
          </div>

          {/* Total Campaigns */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Megaphone className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Active Campaigns</p>
              <p className="text-2xl font-extrabold text-gray-900">{fmt(d.totalCampaigns)}</p>
              <p className="text-xs text-gray-400 mt-0.5">campaigns on platform</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
