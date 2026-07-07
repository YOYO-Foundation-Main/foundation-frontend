"use client";
import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiRefreshCw,
  FiGift,
  FiCheckCircle,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";
import { getPlatformIncome } from "@/features/super-admin/api/finance.api";

type PlatformIncome = {
  totalPlatformIncome: number;
  totalPlatformTips: number;
  totalDonationAmount: number;
  todayIncome: number;
  monthIncome: number;
  yearIncome: number;
  averageIncomePerDonation: number;
  totalSuccessfulDonations: number;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function StatCard({
  title,
  value,
  icon,
  accent,
  sub,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 truncate">{title}</p>
        <p className="text-xl font-extrabold text-gray-900 mt-0.5 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-32 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, colorClass, value }: { label: string; percent: number; colorClass: string; value: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{value}</span>
          <span className={`text-sm font-bold ${colorClass}`}>{percent.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass.replace("text-", "bg-")}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function PlatformIncomePage() {
  const [data, setData] = useState<PlatformIncome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPlatformIncome();
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load platform income.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse bg-gray-200 rounded" />
          <div className="h-8 w-64 animate-pulse bg-gray-300 rounded" />
          <div className="h-4 w-96 animate-pulse bg-gray-100 rounded" />
        </div>
        <div className="h-44 animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <FiDollarSign className="text-red-600 h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Failed to load</h2>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <FiRefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const tipsPercent = data.totalDonationAmount > 0
    ? (data.totalPlatformTips / data.totalDonationAmount) * 100 : 0;
  const incomePercent = data.totalDonationAmount > 0
    ? (data.totalPlatformIncome / data.totalDonationAmount) * 100 : 0;
  const donationPercent = 100;

  const stats = [
    { title: "Platform Tips", value: money(data.totalPlatformTips), icon: <FiGift size={20} className="text-pink-600" />, accent: "bg-pink-50", sub: `${tipsPercent.toFixed(1)}% of donations` },
    { title: "Gross Donations", value: money(data.totalDonationAmount), icon: <FiDollarSign size={20} className="text-blue-600" />, accent: "bg-blue-50" },
    { title: "Today's Income", value: money(data.todayIncome), icon: <FiCalendar size={20} className="text-orange-600" />, accent: "bg-orange-50" },
    { title: "This Month", value: money(data.monthIncome), icon: <FiTrendingUp size={20} className="text-emerald-600" />, accent: "bg-emerald-50" },
    { title: "This Year", value: money(data.yearIncome), icon: <FiBarChart2 size={20} className="text-violet-600" />, accent: "bg-violet-50" },
    { title: "Avg / Donation", value: money(data.averageIncomePerDonation), icon: <FiPieChart size={20} className="text-cyan-600" />, accent: "bg-cyan-50" },
    { title: "Successful Donations", value: data.totalSuccessfulDonations, icon: <FiCheckCircle size={20} className="text-green-600" />, accent: "bg-green-50" },
    { title: "Income Ratio", value: `${incomePercent.toFixed(1)}%`, icon: <FiTrendingUp size={20} className="text-amber-600" />, accent: "bg-amber-50", sub: "vs total donations" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-1">Finance</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Platform Income</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor platform earnings, donations, and revenue performance.</p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition self-start sm:self-auto"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-red-500/10 blur-2xl" />
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Total Platform Income</p>
          <h2 className="text-4xl font-black text-white tracking-tight">{money(data.totalPlatformIncome)}</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md">
            Revenue from <span className="text-white font-semibold">{data.totalSuccessfulDonations}</span> successful donations on the YOYO Foundation platform.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4 shrink-0">
          <div className="text-center">
            <p className="text-gray-500 text-xs font-medium">Today</p>
            <p className="text-white font-bold text-lg mt-0.5">{money(data.todayIncome)}</p>
          </div>
          <div className="w-px h-10 bg-gray-700" />
          <div className="text-center">
            <p className="text-gray-500 text-xs font-medium">This Month</p>
            <p className="text-white font-bold text-lg mt-0.5">{money(data.monthIncome)}</p>
          </div>
          <div className="w-px h-10 bg-gray-700" />
          <div className="text-center">
            <p className="text-gray-500 text-xs font-medium">This Year</p>
            <p className="text-white font-bold text-lg mt-0.5">{money(data.yearIncome)}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} accent={s.accent} sub={s.sub} />
        ))}
      </div>

      {/* Analytics row */}
      <div className="grid gap-5 xl:grid-cols-2">

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <FiPieChart className="text-red-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Revenue Breakdown</h3>
              <p className="text-xs text-gray-400">Distribution of income sources</p>
            </div>
          </div>

          <div className="space-y-5">
            <ProgressBar
              label="Platform Income"
              percent={incomePercent}
              colorClass="text-red-600"
              value={money(data.totalPlatformIncome)}
            />
            <ProgressBar
              label="Platform Tips"
              percent={tipsPercent}
              colorClass="text-amber-500"
              value={money(data.totalPlatformTips)}
            />
            <ProgressBar
              label="Total Donations"
              percent={donationPercent}
              colorClass="text-emerald-600"
              value={money(data.totalDonationAmount)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs text-gray-500 font-medium">Platform Tips</p>
              <p className="text-lg font-extrabold text-red-600 mt-1">{money(data.totalPlatformTips)}</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-gray-500 font-medium">Donation Volume</p>
              <p className="text-lg font-extrabold text-blue-600 mt-1">{money(data.totalDonationAmount)}</p>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <FiTrendingUp className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Performance Overview</h3>
              <p className="text-xs text-gray-400">Key platform financial metrics</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Avg Revenue / Donation", value: money(data.averageIncomePerDonation), color: "text-red-600", bg: "bg-red-50" },
              { label: "Successful Donations", value: String(data.totalSuccessfulDonations), color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Today's Income", value: money(data.todayIncome), color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Current Month", value: money(data.monthIncome), color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Current Year", value: money(data.yearIncome), color: "text-violet-600", bg: "bg-violet-50" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`flex items-center justify-between ${bg} rounded-xl px-4 py-3`}>
                <span className="text-sm text-gray-600 font-medium">{label}</span>
                <span className={`text-base font-extrabold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
