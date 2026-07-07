"use client";

import { useEffect, useState } from "react";
import { RevenueTrendItem } from "@/features/super-admin/types/finance.types";
import { getRevenueTrend } from "@/features/super-admin/api/finance.api";
import { Loader2, TrendingUp, IndianRupee, HeartHandshake, BarChart3 } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("en-IN");

export default function RevenueTrendPage() {
  const [data, setData] = useState<RevenueTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  const loadRevenueTrend = async () => {
    try {
      setLoading(true);
      const res = await getRevenueTrend();
      setData(res.data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenueTrend();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-red-600" />
        <p className="text-sm text-gray-400">Loading revenue trend…</p>
      </div>
    );
  }

  const activeData = data;
  const maxDonation = Math.max(...activeData.map((d) => d.donationAmount), 1);
  const maxRevenue = Math.max(...activeData.map((d) => d.totalRevenue), 1);
  const maxBar = Math.max(maxDonation, maxRevenue);

  const totalDonationAmount = data.reduce((s, d) => s + d.donationAmount, 0);
  const totalRevenue = data.reduce((s, d) => s + d.totalRevenue, 0);
  const totalTips = data.reduce((s, d) => s + d.platformTips, 0);
  const totalDonations = data.reduce((s, d) => s + d.donations, 0);
  const activeMonths = data.filter((d) => d.donations > 0).length;

  const selected = activeMonth ? data.find((d) => d.month === activeMonth) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-1">Analytics</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Revenue Trend</h1>
        <p className="text-sm text-gray-500 mt-1">Monthly breakdown of donations, tips, and revenue across the year.</p>
      </div>

      {/* Summary KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Gross Donations", value: `₹${fmt(totalDonationAmount)}`, icon: IndianRupee, bg: "bg-red-50", color: "text-red-600" },
          { label: "Total Revenue", value: `₹${fmt(totalRevenue)}`, icon: TrendingUp, bg: "bg-green-50", color: "text-green-600" },
          { label: "Platform Tips", value: `₹${fmt(totalTips)}`, icon: HeartHandshake, bg: "bg-purple-50", color: "text-purple-600" },
          { label: "Total Transactions", value: fmt(totalDonations), icon: BarChart3, bg: "bg-blue-50", color: "text-blue-600" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium leading-tight">{label}</p>
              <p className="text-lg font-extrabold text-gray-900 leading-tight mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Monthly Breakdown</h2>
            <p className="text-xs text-gray-400 mt-0.5">{activeMonths} active months this year</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />Donations</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-purple-400 inline-block" />Tips</span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-48 px-1">
          {data.map((item) => {
            const isActive = activeMonth === item.month;
            const isEmpty = item.donationAmount === 0 && item.totalRevenue === 0;
            const donationH = isEmpty ? 0 : Math.max((item.donationAmount / maxBar) * 100, 2);
            const revenueH = isEmpty ? 0 : Math.max((item.totalRevenue / maxBar) * 100, item.totalRevenue > 0 ? 2 : 0);
            const tipsH = isEmpty ? 0 : Math.max((item.platformTips / maxBar) * 100, item.platformTips > 0 ? 2 : 0);

            return (
              <button
                key={item.month}
                onClick={() => setActiveMonth(isActive ? null : item.month)}
                className="flex-1 flex flex-col items-center gap-1 group focus:outline-none"
              >
                <div className="w-full flex items-end justify-center gap-0.5 h-40">
                  {/* Donation bar */}
                  <div
                    className={`flex-1 rounded-t-lg transition-all duration-300 ${isActive ? "bg-red-600" : "bg-red-400 group-hover:bg-red-500"}`}
                    style={{ height: `${donationH}%`, minHeight: isEmpty ? "0px" : "4px" }}
                  />
                  {/* Revenue bar */}
                  <div
                    className={`flex-1 rounded-t-lg transition-all duration-300 ${isActive ? "bg-emerald-600" : "bg-emerald-400 group-hover:bg-emerald-500"}`}
                    style={{ height: `${revenueH}%`, minHeight: isEmpty ? "0px" : "0px" }}
                  />
                  {/* Tips bar */}
                  <div
                    className={`flex-1 rounded-t-lg transition-all duration-300 ${isActive ? "bg-purple-600" : "bg-purple-300 group-hover:bg-purple-400"}`}
                    style={{ height: `${tipsH}%`, minHeight: isEmpty ? "0px" : "0px" }}
                  />
                </div>
                <span className={`text-[11px] font-semibold transition-colors ${isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {item.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected month detail */}
      {selected && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{selected.month}</span>
            <span className="text-sm font-semibold text-gray-700">Details</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Donation Amount", value: `₹${fmt(selected.donationAmount)}`, color: "text-red-600" },
              { label: "Platform Tips", value: `₹${fmt(selected.platformTips)}`, color: "text-purple-600" },
              { label: "Total Revenue", value: `₹${fmt(selected.totalRevenue)}`, color: "text-green-600" },
              { label: "Transactions", value: String(selected.donations), color: "text-blue-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className={`text-xl font-extrabold mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month cards grid */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">All Months</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((item) => {
            const isEmpty = item.donationAmount === 0 && item.donations === 0;
            const isActive = activeMonth === item.month;
            return (
              <button
                key={item.month}
                onClick={() => setActiveMonth(isActive ? null : item.month)}
                className={`text-left rounded-2xl border p-4 transition-all duration-150 focus:outline-none ${
                  isActive
                    ? "border-red-300 bg-red-50 shadow-md"
                    : isEmpty
                    ? "border-gray-100 bg-gray-50 opacity-60"
                    : "border-gray-100 bg-white shadow-sm hover:border-red-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${isActive ? "text-red-600" : isEmpty ? "text-gray-400" : "text-gray-700"}`}>
                    {item.month}
                  </span>
                  {!isEmpty && (
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                      {item.donations} txn
                    </span>
                  )}
                  {isEmpty && (
                    <span className="text-xs bg-gray-100 text-gray-400 font-medium px-2 py-0.5 rounded-full">
                      No data
                    </span>
                  )}
                </div>
                <p className={`text-base font-extrabold ${isEmpty ? "text-gray-300" : "text-gray-900"}`}>
                  ₹{fmt(item.donationAmount)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">donations</p>
                {!isEmpty && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-red-500"
                        style={{ width: `${Math.min((item.donationAmount / maxDonation) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
