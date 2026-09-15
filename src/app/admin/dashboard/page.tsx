// "use client";
// import { useEffect, useState } from "react";
// import {
//   AreaChart, Area, BarChart, Bar,
//   XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, PieChart, Pie, Cell,
// } from "recharts";
// import { FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";
// import { HiOutlineUsers, HiOutlineCurrencyRupee } from "react-icons/hi2";
// import { MdCampaign } from "react-icons/md";
// import { adminGetDashboard } from "@/features/admin/api/admin.api";

// // ✅ Always explicit locale — prevents hydration mismatch
// const fmt = (n: number) => n.toLocaleString("en-US");
// const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-US")}`;

// // ── Dummy chart data ─────────────────────────────────────────────────────────
// const donationTrend = [
//   { month: "Jan", amount: 140000 },
//   { month: "Feb", amount: 200000 },
//   { month: "Mar", amount: 216800 },
//   { month: "Apr", amount: 180000 },
//   { month: "May", amount: 260000 },
//   { month: "Jun", amount: 300000 },
//   { month: "Jul", amount: 420000 },
//   { month: "Aug", amount: 380000 },
// ];

// const donorGrowth = [
//   { month: "Jan", new: 200, returning: 800 },
//   { month: "Feb", new: 400, returning: 1200 },
//   { month: "Mar", new: 600, returning: 1800 },
//   { month: "Apr", new: 300, returning: 1400 },
//   { month: "May", new: 500, returning: 2000 },
//   { month: "Jun", new: 996, returning: 2785 },
//   { month: "Jul", new: 700, returning: 2200 },
//   { month: "Aug", new: 400, returning: 1600 },
// ];

// const categoryData = [
//   { name: "Community & Environment", value: 34, color: "#1e3a5f", amount: "₹1,65,200" },
//   { name: "Education & Empowerment", value: 27, color: "#FEC7C9", amount: "₹1,31,400" },
//   { name: "Health & Medical Aid", value: 23, color: "#93c5fd", amount: "₹1,12,000" },
//   { name: "Others", value: 16, color: "#e2e8f0", amount: "₹74,160" },
// ];

// const topDonors = [
//   { name: "Claire Mason", donations: "14x Donate", amount: "₹12,450", initials: "CM", color: "bg-[#FEC7C9]" },
//   { name: "Marcus Delgad", donations: "11x Donate", amount: "₹9,980", initials: "MD", color: "bg-[#FEC7C9]" },
//   { name: "Mira Hong", donations: "9x Donate", amount: "₹8,520", initials: "MH", color: "bg-[#FEC7C9]" },
//   { name: "Brian Keller", donations: "7x Donate", amount: "₹6,740", initials: "BK", color: "bg-[#FEC7C9]" },
//   { name: "Naomi Bennett", donations: "6x Donate", amount: "₹5,380", initials: "NB", color: "bg-[#FEC7C9]" },
// ];

// const activeCampaigns = [
//   { title: "Empower Young Women Entrepreneurs", org: "RiseTogether Initiative", category: "Education & Empowerment", raised: 131400, goal: 100000, daysLeft: 18, progress: 27 },
//   { title: "Clean Water for Every Village Life", org: "GlobalHelp Alliance", category: "Community & Environment", raised: 182000, goal: 200000, daysLeft: 5, progress: 91 },
// ];

// const recentDonations = [
//   { id: "#D-98231", date: "Oct 06, 2035\n10:45 AM", donor: "Claire Mason", initials: "CM", color: "bg-blue-500", campaign: "Clean Water for Every Village", category: "Community & Environment", amount: "₹250", status: "Successful" },
//   { id: "#D-98218", date: "Oct 06, 2035\n09:25 AM", donor: "Marcus Delgad", initials: "MD", color: "bg-purple-500", campaign: "Empower Women Entrepreneurs", category: "Education & Empowerment", amount: "₹500", status: "Successful" },
//   { id: "#D-98190", date: "Oct 05, 2035\n08:03 PM", donor: "Anonym", initials: "AN", color: "bg-gray-400", campaign: "Rebuild Hope After the Earthquake", category: "Disaster Relief", amount: "₹1,000", status: "Pending" },
//   { id: "#D-98174", date: "Oct 05, 2035\n04:57 PM", donor: "Mira Hong", initials: "MH", color: "bg-pink-400", campaign: "Children's Health Support", category: "Health & Medical Aid", amount: "₹300", status: "Successful" },
//   { id: "#D-98160", date: "Oct 05, 2035\n02:11 PM", donor: "Brian Keller", initials: "BK", color: "bg-green-500", campaign: "Art for Peace", category: "Arts & Culture", amount: "₹150", status: "Failed" },
// ];

// const recentActivity = [
//   { time: "Today · 10:45 AM", text: 'Campaign "Clean Water for Every Village" reached ₹35,000 milestone.', color: "bg-blue-500" },
//   { time: "Today · 09:30 AM", text: "New donor registered: Amelia Rhodes from London, UK.", color: "bg-green-500" },
//   { time: "Yesterday · 08:15 PM", text: "Donation received: ₹1,000 to Rebuild Hope (Pending confirmation)", color: "bg-yellow-500" },
//   { time: "Yesterday · 04:40 PM", text: 'New campaign added: "Support Education for All".', color: "bg-purple-500" },
//   { time: "Oct 05 · 03:05 PM", text: "System update completed — dashboard performance improved by 15%.", color: "bg-gray-400" },
// ];

// interface DashboardStats {
//   totalUsers: number;
//   totalCampaigns: number;
//   activeCampaigns: number;
//   pendingCampaigns: number;
//   totalDonors: number;
//   totalAmount: number;
// }

// function StatusBadge({ status }: { status: string }) {
//   const map: Record<string, string> = {
//     Successful: "bg-green-50 text-green-600",
//     Pending: "bg-yellow-50 text-yellow-600",
//     Failed: "bg-red-50 text-red-500",
//   };
//   return (
//     <span className={`px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-medium ${map[status] || "bg-gray-100 text-gray-500"}`}>
//       {status}
//     </span>
//   );
// }

// function StatSkeleton() {
//   return <div className="h-6 sm:h-7 w-20 sm:w-24 bg-gray-200 rounded animate-pulse" />;
// }

// export default function AdminDashboardPage() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loadingStats, setLoadingStats] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await adminGetDashboard();
//         console.log("✅ Dashboard stats:", data);
//         setStats(data);
//       } catch (err: any) {
//         console.error("❌ Dashboard stats error:", err);
//       } finally {
//         setLoadingStats(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   return (
//     <div className="space-y-3 sm:space-y-4 md:space-y-5">

//       {/* ── STAT CARDS ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex items-start justify-between mb-2 sm:mb-3">
//             <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Donations</p>
//             <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FEC7C9] flex items-center justify-center shrink-0">
//               <HiOutlineCurrencyRupee size={14} className="text-white" />
//             </div>
//           </div>
//           {loadingStats ? <StatSkeleton /> : (
//             <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 break-words">
//               {stats ? fmtCurrency(stats.totalAmount) : "—"}
//             </p>
//           )}
//           <p className="text-[10px] sm:text-xs text-green-500 mt-1 flex items-center gap-1">
//             <FiArrowUpRight size={10} /> +18.4% than last month
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex items-start justify-between mb-2 sm:mb-3">
//             <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Active Campaigns</p>
//             <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C1E9FF] flex items-center justify-center shrink-0">
//               <MdCampaign size={14} className="text-white" />
//             </div>
//           </div>
//           {loadingStats ? <StatSkeleton /> : (
//             <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
//               {stats ? fmt(stats.activeCampaigns) : "—"}
//             </p>
//           )}
//           <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
//             {stats ? `${fmt(stats.pendingCampaigns)} pending · ${fmt(stats.totalCampaigns)} total` : ""}
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex items-start justify-between mb-2 sm:mb-3">
//             <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Donors</p>
//             <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FEC7C9] flex items-center justify-center shrink-0">
//               <HiOutlineUsers size={14} className="text-white" />
//             </div>
//           </div>
//           {loadingStats ? <StatSkeleton /> : (
//             <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
//               {stats ? fmt(stats.totalDonors) : "—"}
//             </p>
//           )}
//           <p className="text-[10px] sm:text-xs text-green-500 mt-1 flex items-center gap-1">
//             <FiArrowUpRight size={10} /> +9.2% than last month
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex items-start justify-between mb-2 sm:mb-3">
//             <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Total Users</p>
//             <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C1E9FF] flex items-center justify-center shrink-0">
//               <HiOutlineUsers size={14} className="text-white" />
//             </div>
//           </div>
//           {loadingStats ? <StatSkeleton /> : (
//             <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
//               {stats ? fmt(stats.totalUsers) : "—"}
//             </p>
//           )}
//           <p className="text-[10px] sm:text-xs text-green-500 mt-1 flex items-center gap-1">
//             <FiArrowUpRight size={10} /> +6.8% than last month
//           </p>
//         </div>
//       </div>

//       {/* ── ROW 2: Charts + Categories ── */}  
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Donation Trends</p>
//             <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0">Last 8 Months</span>
//           </div>
//           <div className="w-full h-[160px] sm:h-[180px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={donationTrend}>
//                 <defs>
//                   <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#FEC7C9" stopOpacity={0.2} />
//                     <stop offset="95%" stopColor="#FEC7C9" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toLocaleString("en-US")}k`} />
//                 <Tooltip formatter={(v: any) => fmtCurrency(v)} />
//                 <Area type="monotone" dataKey="amount" stroke="#FEC7C9" strokeWidth={2} fill="url(#colorAmt)" dot={false} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Donor Growth</p>
//             <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0">Last 8 Months</span>
//           </div>
//           <div className="flex items-center gap-3 sm:gap-4 mb-2 flex-wrap">
//             <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 inline-block" />New Donors</span>
//             <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-200 inline-block" />Returning</span>
//           </div>
//           <div className="w-full h-[145px] sm:h-[165px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={donorGrowth} barSize={6}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//                 <Tooltip />
//                 <Bar dataKey="new" fill="#FEC7C9" radius={[3, 3, 0, 0]} />
//                 <Bar dataKey="returning" fill="#bfdbfe" radius={[3, 3, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Top Campaign Categories</p>
//             <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
//           </div>
//           <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 sm:gap-4">
//             <div className="flex justify-center">
//               <PieChart width={120} height={120}>
//                 <Pie data={categoryData} cx={60} cy={60} innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
//                   {categoryData.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </div>
//             <div className="w-full space-y-1.5 sm:space-y-2">
//               {categoryData.map((cat) => (
//                 <div key={cat.name} className="flex items-start justify-between gap-2">
//                   <div className="flex items-start gap-1.5 sm:gap-2 flex-1 min-w-0">
//                     <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-0.5 shrink-0" style={{ background: cat.color }} />
//                     <p className="text-[10px] sm:text-xs text-gray-600 leading-tight flex-1">
//                       <span className="hidden xs:inline">{cat.name}</span>
//                       <span className="xs:hidden">{cat.name.split(' ').slice(0,2).join(' ')}</span>
//                       <br />
//                       <span className="text-[8px] sm:text-[10px] text-gray-400">Total: {cat.amount}</span>
//                     </p>
//                   </div>
//                   <span className="text-[10px] sm:text-xs font-semibold text-gray-700 shrink-0">{cat.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── ROW 3: Active Campaigns + Top Donors ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">

//         <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Active Campaigns</p>
//             <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//             {activeCampaigns.map((c) => (
//               <div key={c.title} className="rounded-xl overflow-hidden border border-gray-100">
//                 <div className="relative h-24 sm:h-28 bg-gray-200 flex items-end p-2">
//                   <span className="bg-black/60 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded-full">{c.category}</span>
//                 </div>
//                 <div className="p-2 sm:p-3">
//                   <p className="text-[8px] sm:text-[10px] text-gray-400 truncate">{c.org}</p>
//                   <p className="text-[10px] sm:text-xs font-semibold text-gray-800 mt-0.5 line-clamp-2">{c.title}</p>
//                   <div className="mt-2 w-full h-1 bg-gray-100 rounded-full">
//                     <div className="h-1 bg-[#C1E9FF] rounded-full" style={{ width: `${c.progress}%` }} />
//                   </div>
//                   <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-400 mt-1 flex-wrap gap-1">
//                     <span>₹{c.raised.toLocaleString("en-US")} / ₹{c.goal.toLocaleString("en-US")}</span>
//                     <span>{c.daysLeft} Days left</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Top Donors</p>
//             <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
//           </div>
//           <div className="space-y-2 sm:space-y-3">
//             {topDonors.map((d) => (
//               <div key={d.name} className="flex items-center justify-between gap-2">
//                 <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
//                   <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full ${d.color} flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shrink-0`}>
//                     {d.initials}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 truncate">{d.name}</p>
//                     <p className="text-[8px] sm:text-[10px] text-gray-400">{d.donations}</p>
//                   </div>
//                 </div>
//                 <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800 shrink-0">{d.amount}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── ROW 4: Recent Donations + Recent Activity ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">

//         <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Recent Donations</p>
//             <span className="text-[9px] sm:text-xs bg-gray-100 text-gray-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg cursor-pointer shrink-0">All Category ▾</span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[550px] sm:min-w-[600px]">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {["Donation ID", "Date & Time", "Donor", "Campaign", "Amount", "Status"].map((h) => (
//                     <th key={h} className="text-left text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase pb-2 pr-2 sm:pr-3 whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {recentDonations.map((row) => (
//                   <tr key={row.id} className="hover:bg-gray-50 transition">
//                     <td className="py-2 sm:py-3 pr-2 sm:pr-3 text-[10px] sm:text-xs font-medium text-gray-600 whitespace-nowrap">{row.id}</td>
//                     <td className="py-2 sm:py-3 pr-2 sm:pr-3 text-[8px] sm:text-[10px] text-gray-400 whitespace-pre-line">{row.date}</td>
//                     <td className="py-2 sm:py-3 pr-2 sm:pr-3">
//                       <div className="flex items-center gap-1.5 sm:gap-2">
//                         <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${row.color} flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold shrink-0`}>
//                           {row.initials}
//                         </div>
//                         <span className="text-[10px] sm:text-xs text-gray-700 whitespace-nowrap">{row.donor}</span>
//                       </div>
//                     </td>
//                     <td className="py-2 sm:py-3 pr-2 sm:pr-3">
//                       <p className="text-[10px] sm:text-xs text-gray-700 line-clamp-1 max-w-[100px] sm:max-w-[140px]">{row.campaign}</p>
//                       <p className="text-[8px] sm:text-[10px] text-gray-400 hidden sm:block">{row.category}</p>
//                     </td>
//                     <td className="py-2 sm:py-3 pr-2 sm:pr-3 text-[10px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap">{row.amount}</td>
//                     <td className="py-2 sm:py-3"><StatusBadge status={row.status} /></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-3 sm:mb-4">
//             <p className="text-xs sm:text-sm font-semibold text-gray-700">Recent Activity</p>
//             <FiMoreHorizontal size={14} className="text-gray-400 shrink-0" />
//           </div>
//           <div className="space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
//             {recentActivity.map((act, i) => (
//               <div key={i} className="flex gap-2 sm:gap-3">
//                 <div className="flex flex-col items-center">
//                   <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 mt-1 ${act.color}`} />
//                   {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
//                 </div>
//                 <div className="pb-2 sm:pb-3 flex-1">
//                   <p className="text-[8px] sm:text-[10px] text-gray-400 mb-0.5">{act.time}</p>
//                   <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed break-words">{act.text}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  HiOutlineUsers,
  HiOutlineCurrencyRupee,
} from "react-icons/hi2";
import {
  MdCampaign,
  MdPendingActions,
} from "react-icons/md";
import {
  FiMoreHorizontal,
  FiRefreshCw,
  FiAlertCircle,
  FiActivity,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi";
import { adminGetDashboard } from "@/features/admin/api/admin.api";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

interface Cause {
  id: number;
  name: string;
}

interface ActiveCampaign {
  id: number;
  title: string;
  image: string;
  cause: Cause;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  donationCount: number;
  progress: number;
  createdAt: string;
}

interface DonationTrend {
  month: string;
  amount: number;
  donationCount: number;
}

interface DonorGrowth {
  month: string;
  newDonors: number;
  returningDonors: number;
}

interface CategoryData {
  name: string;
  campaignCount: number;
  amount: number;
  percentage: number;
}

interface TopDonor {
  userId: number;
  name: string;
  email: string;
  donationCount: number;
  totalAmount: number;
}

interface RecentDonation {
  id: string;
  date: string;
  donor: { id: number; name: string; email: string };
  campaign: { id: number; title: string; cause: Cause };
  amount: number;
  status: string;
}

interface RecentActivity {
  type: string;
  date: string;
  text: string;
}

interface CampaignStatusItem {
  status: string;
  count: number;
}

interface DashboardData {
  totalUsers: number;
  totalCampaigns: number;
  activeCampaigns: ActiveCampaign[];
  pendingCampaigns: number;
  totalDonors: number;
  totalAmount: number;
  activeCampaignCount: number;
  donationTrend: DonationTrend[];
  donorGrowth: DonorGrowth[];
  categoryData: CategoryData[];
  topDonors: TopDonor[];
  recentDonations: RecentDonation[];
  recentActivity: RecentActivity[];
  campaignStatus: CampaignStatusItem[];
}

/* ─────────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────────── */

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-IN").format(n);

const fmtCompact = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (d: string) => {
  const dt = new Date(d);
  return {
    date: dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
};

const initials = (name: string) =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Consistent palette for charts / avatars
const PALETTE = [
  "#1e3a5f", "#e26363", "#60a5fa", "#34d399",
  "#fbbf24", "#a78bfa", "#f472b6", "#2dd4bf",
];

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`} />
  );
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

function ChartSkeleton({ h = "h-48" }: { h?: string }) {
  return <Skeleton className={`w-full ${h} rounded-xl`} />;
}

/* ─────────────────────────────────────────────
   STATUS BADGE (donations)
───────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUCCESS: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    FAILED: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status === "SUCCESS" ? "Paid" : status}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ACTIVITY ICON
───────────────────────────────────────────── */

function ActivityDot({ type }: { type: string }) {
  const cfg: Record<string, string> = {
    DONATION_RECEIVED: "bg-emerald-500",
    CAMPAIGN_CREATED: "bg-blue-500",
    USER_REGISTERED: "bg-violet-500",
  };
  return (
    <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${cfg[type] ?? "bg-gray-400"}`} />
  );
}

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  sub,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 break-words">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOOLTIP FORMATTERS
───────────────────────────────────────────── */

const donationTrendTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-gray-600">Amount: <span className="font-bold text-gray-900">{fmtINR(payload[0]?.value ?? 0)}</span></p>
      {payload[1] && (
        <p className="text-gray-600 mt-0.5">Donations: <span className="font-bold text-gray-900">{payload[1]?.value}</span></p>
      )}
    </div>
  );
};

const donorGrowthTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-gray-600">
          {p.dataKey === "newDonors" ? "New" : "Returning"}: <span className="font-bold text-gray-900">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminGetDashboard();

      // console.log("DASHBOARD API RESULT:", res);
      // console.log("DASHBOARD DATA:", res?.data);
      // console.log("CAMPAIGN STATUS:", res?.data?.campaignStatus ?? res?.campaignStatus);

      const d: DashboardData = res?.data ?? res;

      // console.log("FINAL DASHBOARD DATA:", d);
      // console.log("FINAL CAMPAIGN STATUS:", d?.campaignStatus);

      // setData(d);
      // // adminGetDashboard may return { success, data } or the data directly
      // const d: DashboardData = res?.data ?? res;
      setData(d);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  /* ── Error state ── */
  if (!loading && error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <FiAlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <p className="text-base font-bold text-gray-800">Unable to load dashboard data</p>
        <p className="text-sm text-gray-400 max-w-xs">{error}</p>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
        >
          <FiRefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <KpiSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChartSkeleton h="h-56" />
          <ChartSkeleton h="h-56" />
          <ChartSkeleton h="h-56" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><ChartSkeleton h="h-64" /></div>
          <ChartSkeleton h="h-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><ChartSkeleton h="h-72" /></div>
          <ChartSkeleton h="h-72" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const activeCampaignCount = data.activeCampaignCount ?? 0;

  const approvedCampaignCount =
    data.totalCampaigns - data.pendingCampaigns;

  const inactiveApprovedCampaignCount =
    approvedCampaignCount - activeCampaignCount;
  const totalStatusCount = (data.campaignStatus ?? []).reduce(
    (s, i) => s + i.count,
    0
  );

  return (
    <div className="space-y-5">

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Donations"
          value={fmtINR(data.totalAmount)}
          sub="Total successful donation volume"
          icon={<HiOutlineCurrencyRupee size={18} className="text-white" />}
          iconBg="bg-rose-400"
        />
        <KpiCard
          label="Active Campaigns"
          value={fmtNum(activeCampaignCount)}
          sub={`${fmtNum(inactiveApprovedCampaignCount)} approved inactive · ${fmtNum(data.pendingCampaigns)} pending · ${fmtNum(data.totalCampaigns)} total`}
          icon={<MdCampaign size={18} className="text-white" />}
          iconBg="bg-blue-400"
        />
        <KpiCard
          label="Total Donors"
          value={fmtNum(data.totalDonors)}
          sub="Unique donors on platform"
          icon={<HiOutlineUsers size={18} className="text-white" />}
          iconBg="bg-violet-400"
        />
        <KpiCard
          label="Total Users"
          value={fmtNum(data.totalUsers)}
          sub={`${fmtNum(data.totalCampaigns)} campaigns created`}
          icon={<HiOutlineUsers size={18} className="text-white" />}
          iconBg="bg-teal-400"
        />
      </div>

      {/* ── PENDING ALERT ── */}
      {data.pendingCampaigns > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <MdPendingActions size={18} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">
              {fmtNum(data.pendingCampaigns)} campaign{data.pendingCampaigns !== 1 ? "s" : ""} pending review
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              These campaigns are awaiting admin approval before they become publicly visible.
            </p>
          </div>
        </div>
      )}

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Donation Trend */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Donation Trend</p>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
              {data.donationTrend.length} months
            </span>
          </div>
          {data.donationTrend.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-xs text-gray-400">No trend data</div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.donationTrend}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e26363" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#e26363" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                    tickFormatter={fmtCompact} width={48} />
                  <Tooltip content={donationTrendTooltip} />
                  <Area type="monotone" dataKey="amount" stroke="#e26363" strokeWidth={2}
                    fill="url(#trendGrad)" dot={{ r: 3, fill: "#e26363", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Donor Growth */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700">Donor Growth</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />New
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-teal-300 inline-block" />Returning
              </span>
            </div>
          </div>
          {data.donorGrowth.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-xs text-gray-400">No data</div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.donorGrowth} barSize={7}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={donorGrowthTooltip} />
                  <Bar dataKey="newDonors" fill="#60a5fa" radius={[3, 3, 0, 0]} name="New Donors" />
                  <Bar dataKey="returningDonors" fill="#5eead4" radius={[3, 3, 0, 0]} name="Returning Donors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Top Categories</p>
            <FiMoreHorizontal size={14} className="text-gray-400" />
          </div>
          {data.categoryData.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-xs text-gray-400">No categories</div>
          ) : (
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4">
              <PieChart width={110} height={110}>
                <Pie data={data.categoryData} cx={55} cy={55}
                  innerRadius={30} outerRadius={50} dataKey="percentage" paddingAngle={2}>
                  {data.categoryData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="w-full space-y-1.5">
                {data.categoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <span className="w-2 h-2 rounded-full mt-0.5 shrink-0"
                        style={{ background: PALETTE[i % PALETTE.length] }} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-600 truncate">{cat.name}</p>
                        <p className="text-[9px] text-gray-400">{fmtINR(cat.amount)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 shrink-0">
                      {cat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CAMPAIGN STATUS + TOP DONORS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Campaign Status */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm font-semibold text-gray-700">Campaign Status</p>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
              {fmtNum(data.totalCampaigns)} total
            </span>
          </div>
          {(data.campaignStatus ?? []).length === 0 ? (
            <p className="text-xs text-gray-400">No data</p>
          ) : (
            <div className="space-y-4">
              {(data.campaignStatus ?? []).map((s, i) => {
                const pct = totalStatusCount > 0
                  ? Math.round((s.count / totalStatusCount) * 100)
                  : 0;
                const color = s.status === "APPROVED"
                  ? "bg-emerald-500"
                  : s.status === "PENDING"
                    ? "bg-amber-400"
                    : s.status === "REJECTED"
                      ? "bg-red-400"
                      : "bg-gray-400";
                const labelColor = s.status === "APPROVED"
                  ? "text-emerald-700 bg-emerald-50"
                  : s.status === "PENDING"
                    ? "text-amber-700 bg-amber-50"
                    : s.status === "REJECTED"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 bg-gray-100";
                return (
                  <div key={s.status}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${labelColor}`}>
                        {s.status}
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {fmtNum(s.count)} <span className="text-gray-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${color}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Donors */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm font-semibold text-gray-700">Top Donors</p>
            <FiMoreHorizontal size={14} className="text-gray-400" />
          </div>
          {data.topDonors.length === 0 ? (
            <p className="text-xs text-gray-400">No donors yet</p>
          ) : (
            <div className="space-y-3">
              {data.topDonors.map((donor, i) => (
                <div key={donor.userId} className="flex items-center gap-3">
                  <span className="text-xs text-gray-300 font-bold w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: PALETTE[i % PALETTE.length] }}>
                    {initials(donor.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{donor.name.trim()}</p>
                    <p className="text-[10px] text-gray-400 truncate">{donor.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-800">{fmtINR(donor.totalAmount)}</p>
                    <p className="text-[10px] text-gray-400">{donor.donationCount} donations</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ACTIVE CAMPAIGNS ── */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm font-semibold text-gray-700">
            Active Campaigns
            <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {activeCampaignCount}
            </span>
          </p>
          <FiMoreHorizontal size={14} className="text-gray-400" />
        </div>
        {data.activeCampaigns.length === 0 ? (
          <p className="text-xs text-gray-400">No active campaigns</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.activeCampaigns.map((c) => (
              <div key={c.id} className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition">
                <div className="relative h-28 bg-gray-100">
                  {c.image ? (
                    <img src={c.image} alt={c.title}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MdCampaign size={28} className="text-gray-400" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full truncate max-w-[80%]">
                    {c.cause.name}
                  </span>
                  <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${c.progress >= 90 ? "bg-emerald-100 text-emerald-700" :
                    c.progress >= 50 ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                    {c.progress}%
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-2">
                    {c.title}
                  </p>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full mb-2">
                    <div className={`h-1.5 rounded-full transition-all ${c.progress >= 90 ? "bg-emerald-500" :
                      c.progress >= 50 ? "bg-blue-400" : "bg-amber-400"
                      }`} style={{ width: `${Math.min(c.progress, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span className="font-semibold text-gray-700">{fmtINR(c.raisedAmount)}</span>
                    <span>of {fmtINR(c.goalAmount)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span>{fmtNum(c.donorCount)} donor{c.donorCount !== 1 ? "s" : ""}</span>
                    <span>·</span>
                    <span>{fmtNum(c.donationCount)} donation{c.donationCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RECENT DONATIONS + ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Donations */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Recent Donations</p>
          </div>
          {data.recentDonations.length === 0 ? (
            <p className="text-xs text-gray-400">No donations yet</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Donor", "Campaign", "Amount", "Date", "Status"].map((h) => (
                        <th key={h}
                          className="text-left text-[9px] font-semibold text-gray-400 uppercase tracking-wider pb-2 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.recentDonations.map((row) => {
                      const { date, time } = fmtDateTime(row.date);
                      return (
                        <tr key={row.id} className="hover:bg-gray-50 transition">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                                style={{ background: PALETTE[row.donor.id % PALETTE.length] }}>
                                {initials(row.donor.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-700 truncate max-w-[100px]">
                                  {row.donor.name.trim()}
                                </p>
                                <p className="text-[9px] text-gray-400 truncate max-w-[100px]">
                                  {row.donor.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-xs text-gray-700 line-clamp-1 max-w-[140px]">
                              {row.campaign.title}
                            </p>
                            <p className="text-[9px] text-gray-400 truncate max-w-[140px]">
                              {row.campaign.cause.name}
                            </p>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                              {fmtINR(row.amount)}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-[10px] text-gray-600">{date}</p>
                            <p className="text-[9px] text-gray-400">{time}</p>
                          </td>
                          <td className="py-3">
                            <StatusBadge status={row.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden space-y-3">
                {data.recentDonations.map((row) => {
                  const { date } = fmtDateTime(row.date);
                  return (
                    <div key={row.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: PALETTE[row.donor.id % PALETTE.length] }}>
                        {initials(row.donor.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-700 truncate">
                            {row.donor.name.trim()}
                          </p>
                          <span className="text-xs font-bold text-gray-800 shrink-0">
                            {fmtINR(row.amount)}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{row.campaign.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={row.status} />
                          <span className="text-[9px] text-gray-400">{date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-700">Recent Activity</p>
            <FiMoreHorizontal size={14} className="text-gray-400" />
          </div>
          {data.recentActivity.length === 0 ? (
            <p className="text-xs text-gray-400">No recent activity</p>
          ) : (
            <div className="space-y-0 max-h-[420px] overflow-y-auto pr-1">
              {data.recentActivity.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <ActivityDot type={act.type} />
                    {i < data.recentActivity.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 mt-1 mb-0" />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="text-[9px] text-gray-400 mb-0.5">{fmtDate(act.date)}</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{act.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
