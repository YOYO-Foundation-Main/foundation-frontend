"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdCampaign } from "react-icons/md";
import { adminGetDashboard } from "@/features/admin/api/admin.api";

// ✅ Always explicit locale — prevents hydration mismatch
const fmt = (n: number) => n.toLocaleString("en-US");
const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-US")}`;

// ── Dummy chart data ─────────────────────────────────────────────────────────
const donationTrend = [
  { month: "Jan", amount: 140000 },
  { month: "Feb", amount: 200000 },
  { month: "Mar", amount: 216800 },
  { month: "Apr", amount: 180000 },
  { month: "May", amount: 260000 },
  { month: "Jun", amount: 300000 },
  { month: "Jul", amount: 420000 },
  { month: "Aug", amount: 380000 },
];

const donorGrowth = [
  { month: "Jan", new: 200, returning: 800 },
  { month: "Feb", new: 400, returning: 1200 },
  { month: "Mar", new: 600, returning: 1800 },
  { month: "Apr", new: 300, returning: 1400 },
  { month: "May", new: 500, returning: 2000 },
  { month: "Jun", new: 996, returning: 2785 },
  { month: "Jul", new: 700, returning: 2200 },
  { month: "Aug", new: 400, returning: 1600 },
];

const categoryData = [
  { name: "Community & Environment", value: 34, color: "#1e3a5f", amount: "₹1,65,200" },
  { name: "Education & Empowerment", value: 27, color: "#3b82f6", amount: "₹1,31,400" },
  { name: "Health & Medical Aid", value: 23, color: "#93c5fd", amount: "₹1,12,000" },
  { name: "Others", value: 16, color: "#e2e8f0", amount: "₹74,160" },
];

const topDonors = [
  { name: "Claire Mason", donations: "14x Donate", amount: "₹12,450", initials: "CM", color: "bg-pink-400" },
  { name: "Marcus Delgad", donations: "11x Donate", amount: "₹9,980", initials: "MD", color: "bg-blue-400" },
  { name: "Mira Hong", donations: "9x Donate", amount: "₹8,520", initials: "MH", color: "bg-purple-400" },
  { name: "Brian Keller", donations: "7x Donate", amount: "₹6,740", initials: "BK", color: "bg-green-400" },
  { name: "Naomi Bennett", donations: "6x Donate", amount: "₹5,380", initials: "NB", color: "bg-orange-400" },
];

const activeCampaigns = [
  { title: "Empower Young Women Entrepreneurs", org: "RiseTogether Initiative", category: "Education & Empowerment", raised: 131400, goal: 100000, daysLeft: 18, progress: 27 },
  { title: "Clean Water for Every Village Life", org: "GlobalHelp Alliance", category: "Community & Environment", raised: 182000, goal: 200000, daysLeft: 5, progress: 91 },
];

const recentDonations = [
  { id: "#D-98231", date: "Oct 06, 2035\n10:45 AM", donor: "Claire Mason", initials: "CM", color: "bg-blue-500", campaign: "Clean Water for Every Village", category: "Community & Environment", amount: "₹250", status: "Successful" },
  { id: "#D-98218", date: "Oct 06, 2035\n09:25 AM", donor: "Marcus Delgad", initials: "MD", color: "bg-purple-500", campaign: "Empower Women Entrepreneurs", category: "Education & Empowerment", amount: "₹500", status: "Successful" },
  { id: "#D-98190", date: "Oct 05, 2035\n08:03 PM", donor: "Anonym", initials: "AN", color: "bg-gray-400", campaign: "Rebuild Hope After the Earthquake", category: "Disaster Relief", amount: "₹1,000", status: "Pending" },
  { id: "#D-98174", date: "Oct 05, 2035\n04:57 PM", donor: "Mira Hong", initials: "MH", color: "bg-pink-400", campaign: "Children's Health Support", category: "Health & Medical Aid", amount: "₹300", status: "Successful" },
  { id: "#D-98160", date: "Oct 05, 2035\n02:11 PM", donor: "Brian Keller", initials: "BK", color: "bg-green-500", campaign: "Art for Peace", category: "Arts & Culture", amount: "₹150", status: "Failed" },
];

const recentActivity = [
  { time: "Today · 10:45 AM", text: 'Campaign "Clean Water for Every Village" reached ₹35,000 milestone.', color: "bg-blue-500" },
  { time: "Today · 09:30 AM", text: "New donor registered: Amelia Rhodes from London, UK.", color: "bg-green-500" },
  { time: "Yesterday · 08:15 PM", text: "Donation received: ₹1,000 to Rebuild Hope (Pending confirmation)", color: "bg-yellow-500" },
  { time: "Yesterday · 04:40 PM", text: 'New campaign added: "Support Education for All".', color: "bg-purple-500" },
  { time: "Oct 05 · 03:05 PM", text: "System update completed — dashboard performance improved by 15%.", color: "bg-gray-400" },
];

interface DashboardStats {
  totalUsers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  pendingCampaigns: number;
  totalDonors: number;
  totalAmount: number;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Successful: "bg-green-50 text-green-600",
    Pending: "bg-yellow-50 text-yellow-600",
    Failed: "bg-red-50 text-red-500",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function StatSkeleton() {
  return <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminGetDashboard();
        console.log("✅ Dashboard stats:", data);
        setStats(data);
      } catch (err: any) {
        console.error("❌ Dashboard stats error:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-5">

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">Total Donations</p>
            <div className="w-8 h-8 rounded-lg bg-pink-400 flex items-center justify-center">
              <HiOutlineCurrencyRupee size={16} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-2xl font-bold text-gray-800">
              {stats ? fmtCurrency(stats.totalAmount) : "—"}
            </p>
          )}
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <FiArrowUpRight size={12} /> +18.4% than last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">Active Campaigns</p>
            <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
              <MdCampaign size={16} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-2xl font-bold text-gray-800">
              {stats ? fmt(stats.activeCampaigns) : "—"}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {stats ? `${fmt(stats.pendingCampaigns)} pending · ${fmt(stats.totalCampaigns)} total` : ""}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">Total Donors</p>
            <div className="w-8 h-8 rounded-lg bg-purple-400 flex items-center justify-center">
              <HiOutlineUsers size={16} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-2xl font-bold text-gray-800">
              {stats ? fmt(stats.totalDonors) : "—"}
            </p>
          )}
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <FiArrowUpRight size={12} /> +9.2% than last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">Total Users</p>
            <div className="w-8 h-8 rounded-lg bg-orange-400 flex items-center justify-center">
              <HiOutlineUsers size={16} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-2xl font-bold text-gray-800">
              {stats ? fmt(stats.totalUsers) : "—"}
            </p>
          )}
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <FiArrowUpRight size={12} /> +6.8% than last month
          </p>
        </div>
      </div>

      {/* ── ROW 2: Charts + Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Donation Trends</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">Last 8 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={donationTrend}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toLocaleString("en-US")}k`} />
              <Tooltip formatter={(v: any) => fmtCurrency(v)} />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAmt)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Donor Growth</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">Last 8 Months</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />New Donors</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-200 inline-block" />Returning</span>
          </div>
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={donorGrowth} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="new" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="returning" fill="#bfdbfe" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Top Campaign Categories</p>
            <FiMoreHorizontal size={16} className="text-gray-400" />
          </div>
          <div className="flex justify-center mb-3">
            <PieChart width={140} height={140}>
              <Pie data={categoryData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ background: cat.color }} />
                  <p className="text-xs text-gray-600 leading-tight">
                    {cat.name}
                    <br />
                    <span className="text-[10px] text-gray-400">Total: {cat.amount}</span>
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-700">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Active Campaigns + Top Donors ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Active Campaigns</p>
            <FiMoreHorizontal size={16} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {activeCampaigns.map((c) => (
              <div key={c.title} className="rounded-xl overflow-hidden border border-gray-100">
                <div className="relative h-28 bg-gray-200 flex items-end p-2">
                  <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">{c.category}</span>
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400">{c.org}</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5 line-clamp-2">{c.title}</p>
                  <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full">
                    <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                  {/* ✅ Fixed: explicit en-US locale */}
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹{c.raised.toLocaleString("en-US")} / ₹{c.goal.toLocaleString("en-US")}</span>
                    <span>{c.daysLeft} Days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Top Donors</p>
            <FiMoreHorizontal size={16} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {topDonors.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${d.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {d.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{d.name}</p>
                    <p className="text-[10px] text-gray-400">{d.donations}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800">{d.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Recent Donations + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Recent Donations</p>
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-lg cursor-pointer">All Category ▾</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Donation ID", "Date & Time", "Donor", "Campaign", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase pb-2 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDonations.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4 text-xs font-medium text-gray-600 whitespace-nowrap">{row.id}</td>
                    <td className="py-3 pr-4 text-[10px] text-gray-400 whitespace-pre-line">{row.date}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${row.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {row.initials}
                        </div>
                        <span className="text-xs text-gray-700 whitespace-nowrap">{row.donor}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs text-gray-700 line-clamp-1 max-w-[140px]">{row.campaign}</p>
                      <p className="text-[10px] text-gray-400">{row.category}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs font-semibold text-gray-700 whitespace-nowrap">{row.amount}</td>
                    <td className="py-3"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Recent Activity</p>
            <FiMoreHorizontal size={16} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${act.color}`} />
                  {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                </div>
                <div className="pb-3">
                  <p className="text-[10px] text-gray-400 mb-0.5">{act.time}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{act.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}