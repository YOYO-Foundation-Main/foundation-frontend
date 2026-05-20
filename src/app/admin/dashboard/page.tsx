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
  { name: "Education & Empowerment", value: 27, color: "#FEC7C9", amount: "₹1,31,400" },
  { name: "Health & Medical Aid", value: 23, color: "#93c5fd", amount: "₹1,12,000" },
  { name: "Others", value: 16, color: "#e2e8f0", amount: "₹74,160" },
];

const topDonors = [
  { name: "Claire Mason", donations: "14x Donate", amount: "₹12,450", initials: "CM", color: "bg-[#FEC7C9]" },
  { name: "Marcus Delgad", donations: "11x Donate", amount: "₹9,980", initials: "MD", color: "bg-[#FEC7C9]" },
  { name: "Mira Hong", donations: "9x Donate", amount: "₹8,520", initials: "MH", color: "bg-[#FEC7C9]" },
  { name: "Brian Keller", donations: "7x Donate", amount: "₹6,740", initials: "BK", color: "bg-[#FEC7C9]" },
  { name: "Naomi Bennett", donations: "6x Donate", amount: "₹5,380", initials: "NB", color: "bg-[#FEC7C9]" },
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
    <span className={`px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-medium ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function StatSkeleton() {
  return <div className="h-6 sm:h-7 w-20 sm:w-24 bg-gray-200 rounded animate-pulse" />;
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
    <div className="space-y-3 sm:space-y-4 md:space-y-5">

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Donations</p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FEC7C9] flex items-center justify-center shrink-0">
              <HiOutlineCurrencyRupee size={14} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 break-words">
              {stats ? fmtCurrency(stats.totalAmount) : "—"}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-green-500 mt-1 flex items-center gap-1">
            <FiArrowUpRight size={10} /> +18.4% than last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Active Campaigns</p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C1E9FF] flex items-center justify-center shrink-0">
              <MdCampaign size={14} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {stats ? fmt(stats.activeCampaigns) : "—"}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
            {stats ? `${fmt(stats.pendingCampaigns)} pending · ${fmt(stats.totalCampaigns)} total` : ""}
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Donors</p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FEC7C9] flex items-center justify-center shrink-0">
              <HiOutlineUsers size={14} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {stats ? fmt(stats.totalDonors) : "—"}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-green-500 mt-1 flex items-center gap-1">
            <FiArrowUpRight size={10} /> +9.2% than last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Users</p>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C1E9FF] flex items-center justify-center shrink-0">
              <HiOutlineUsers size={14} className="text-white" />
            </div>
          </div>
          {loadingStats ? <StatSkeleton /> : (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {stats ? fmt(stats.totalUsers) : "—"}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-green-500 mt-1 flex items-center gap-1">
            <FiArrowUpRight size={10} /> +6.8% than last month
          </p>
        </div>
      </div>

      {/* ── ROW 2: Charts + Categories ── */}  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Donation Trends</p>
            <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0">Last 8 Months</span>
          </div>
          <div className="w-full h-[160px] sm:h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationTrend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FEC7C9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FEC7C9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toLocaleString("en-US")}k`} />
                <Tooltip formatter={(v: any) => fmtCurrency(v)} />
                <Area type="monotone" dataKey="amount" stroke="#FEC7C9" strokeWidth={2} fill="url(#colorAmt)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Donor Growth</p>
            <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0">Last 8 Months</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 mb-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 inline-block" />New Donors</span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-200 inline-block" />Returning</span>
          </div>
          <div className="w-full h-[145px] sm:h-[165px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donorGrowth} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="new" fill="#FEC7C9" radius={[3, 3, 0, 0]} />
                <Bar dataKey="returning" fill="#bfdbfe" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Top Campaign Categories</p>
            <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 sm:gap-4">
            <div className="flex justify-center">
              <PieChart width={120} height={120}>
                <Pie data={categoryData} cx={60} cy={60} innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="w-full space-y-1.5 sm:space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 sm:gap-2 flex-1 min-w-0">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-0.5 shrink-0" style={{ background: cat.color }} />
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight flex-1">
                      <span className="hidden xs:inline">{cat.name}</span>
                      <span className="xs:hidden">{cat.name.split(' ').slice(0,2).join(' ')}</span>
                      <br />
                      <span className="text-[8px] sm:text-[10px] text-gray-400">Total: {cat.amount}</span>
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700 shrink-0">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Active Campaigns + Top Donors ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">

        <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Active Campaigns</p>
            <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {activeCampaigns.map((c) => (
              <div key={c.title} className="rounded-xl overflow-hidden border border-gray-100">
                <div className="relative h-24 sm:h-28 bg-gray-200 flex items-end p-2">
                  <span className="bg-black/60 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded-full">{c.category}</span>
                </div>
                <div className="p-2 sm:p-3">
                  <p className="text-[8px] sm:text-[10px] text-gray-400 truncate">{c.org}</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-800 mt-0.5 line-clamp-2">{c.title}</p>
                  <div className="mt-2 w-full h-1 bg-gray-100 rounded-full">
                    <div className="h-1 bg-[#C1E9FF] rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-400 mt-1 flex-wrap gap-1">
                    <span>₹{c.raised.toLocaleString("en-US")} / ₹{c.goal.toLocaleString("en-US")}</span>
                    <span>{c.daysLeft} Days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Top Donors</p>
            <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {topDonors.map((d) => (
              <div key={d.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full ${d.color} flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shrink-0`}>
                    {d.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 truncate">{d.name}</p>
                    <p className="text-[8px] sm:text-[10px] text-gray-400">{d.donations}</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800 shrink-0">{d.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Recent Donations + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">

        <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Recent Donations</p>
            <span className="text-[9px] sm:text-xs bg-gray-100 text-gray-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg cursor-pointer shrink-0">All Category ▾</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] sm:min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Donation ID", "Date & Time", "Donor", "Campaign", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase pb-2 pr-2 sm:pr-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDonations.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition">
                    <td className="py-2 sm:py-3 pr-2 sm:pr-3 text-[10px] sm:text-xs font-medium text-gray-600 whitespace-nowrap">{row.id}</td>
                    <td className="py-2 sm:py-3 pr-2 sm:pr-3 text-[8px] sm:text-[10px] text-gray-400 whitespace-pre-line">{row.date}</td>
                    <td className="py-2 sm:py-3 pr-2 sm:pr-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${row.color} flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold shrink-0`}>
                          {row.initials}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-700 whitespace-nowrap">{row.donor}</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 pr-2 sm:pr-3">
                      <p className="text-[10px] sm:text-xs text-gray-700 line-clamp-1 max-w-[100px] sm:max-w-[140px]">{row.campaign}</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-400 hidden sm:block">{row.category}</p>
                    </td>
                    <td className="py-2 sm:py-3 pr-2 sm:pr-3 text-[10px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap">{row.amount}</td>
                    <td className="py-2 sm:py-3"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Recent Activity</p>
            <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
          </div>
          <div className="space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex gap-2 sm:gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 mt-1 ${act.color}`} />
                  {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                </div>
                <div className="pb-2 sm:pb-3 flex-1">
                  <p className="text-[8px] sm:text-[10px] text-gray-400 mb-0.5">{act.time}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed break-words">{act.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   HeartHandshake,
//   HandCoins,
//   BadgeDollarSign,
//   Loader2,
//   RefreshCcw,
// } from "lucide-react";

// import { adminGetDashboard } from "@/features/admin/api/admin.api";

// interface DashboardData {
//   totalUsers: number;
//   totalCampaigns: number;
//   activeCampaigns: number;
//   pendingCampaigns: number;
//   totalDonors: number;
//   totalAmount: number;
// }

// export default function AdminDashboardPage() {
//   const [dashboard, setDashboard] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await adminGetDashboard();

//       setDashboard(response.data || response);
//     } catch (err: any) {
//       console.error("Dashboard Error:", err);
//       setError(err.message || "Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const stats = [
//     {
//       title: "Total Users",
//       value: dashboard?.totalUsers || 0,
//       icon: Users,
//       color: "bg-blue-100 text-blue-600",
//     },
//     {
//       title: "Total Campaigns",
//       value: dashboard?.totalCampaigns || 0,
//       icon: HeartHandshake,
//       color: "bg-purple-100 text-purple-600",
//     },
//     {
//       title: "Active Campaigns",
//       value: dashboard?.activeCampaigns || 0,
//       icon: HandCoins,
//       color: "bg-green-100 text-green-600",
//     },
//     {
//       title: "Pending Campaigns",
//       value: dashboard?.pendingCampaigns || 0,
//       icon: Loader2,
//       color: "bg-yellow-100 text-yellow-600",
//     },
//     {
//       title: "Total Donors",
//       value: dashboard?.totalDonors || 0,
//       icon: Users,
//       color: "bg-pink-100 text-pink-600",
//     },
//     {
//       title: "Total Donations",
//       value: `₹${Number(
//         dashboard?.totalAmount || 0
//       ).toLocaleString()}`,
//       icon: BadgeDollarSign,
//       color: "bg-emerald-100 text-emerald-600",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex h-[70vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
//           <p className="text-gray-500">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-[70vh] items-center justify-center px-4">
//         <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
//           <div className="flex flex-col items-center gap-4 text-center">
//             <div className="rounded-full bg-red-100 p-4">
//               <RefreshCcw className="h-8 w-8 text-red-500" />
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-red-600">
//                 Failed to Load Dashboard
//               </h2>

//               <p className="mt-2 text-sm text-gray-500">{error}</p>
//             </div>

//             <button
//               onClick={fetchDashboard}
//               className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 p-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//             Admin Dashboard
//           </h1>

//           <p className="text-gray-500">
//             Monitor platform statistics and donation activities.
//           </p>
//         </div>

//         <button
//           onClick={fetchDashboard}
//           className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
//         >
//           <RefreshCcw className="h-4 w-4" />
//           Refresh
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
//         {stats.map((item) => {
//           const Icon = item.icon;

//           return (
//             <div
//               key={item.title}
//               className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-gray-500">
//                     {item.title}
//                   </p>

//                   <h2 className="text-3xl font-bold tracking-tight text-gray-900">
//                     {item.value}
//                   </h2>
//                 </div>

//                 <div className={`rounded-2xl p-4 ${item.color}`}>
//                   <Icon className="h-8 w-8" />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Extra Analytics */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Campaign Insights */}
//         <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Campaign Insights
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Current platform campaign overview.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between rounded-xl border p-4">
//                 <span className="font-medium text-gray-700">
//                   Active Campaigns
//                 </span>

//                 <span className="text-lg font-bold text-green-600">
//                   {dashboard?.activeCampaigns || 0}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between rounded-xl border p-4">
//                 <span className="font-medium text-gray-700">
//                   Pending Campaigns
//                 </span>

//                 <span className="text-lg font-bold text-yellow-600">
//                   {dashboard?.pendingCampaigns || 0}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between rounded-xl border p-4">
//                 <span className="font-medium text-gray-700">
//                   Total Campaigns
//                 </span>

//                 <span className="text-lg font-bold text-indigo-600">
//                   {dashboard?.totalCampaigns || 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Donation Overview */}
//         <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Donation Overview
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Donation and donor engagement summary.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between rounded-xl border p-4">
//                 <span className="font-medium text-gray-700">
//                   Total Donors
//                 </span>

//                 <span className="text-lg font-bold text-pink-600">
//                   {dashboard?.totalDonors || 0}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between rounded-xl border p-4">
//                 <span className="font-medium text-gray-700">
//                   Total Donations
//                 </span>

//                 <span className="text-lg font-bold text-emerald-600">
//                   ₹{Number(
//                     dashboard?.totalAmount || 0
//                   ).toLocaleString()}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between rounded-xl border p-4">
//                 <span className="font-medium text-gray-700">
//                   Platform Users
//                 </span>

//                 <span className="text-lg font-bold text-blue-600">
//                   {dashboard?.totalUsers || 0}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }