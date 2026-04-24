// "use client";

// import { useEffect, useState } from "react";
// import { getTopDonors } from "@/features/admin/api/admin.api";
// import { FiTrendingUp, FiUsers, FiCalendar } from "react-icons/fi";
// import { useRouter } from "next/navigation";

// export default function TopDonorsPage() {
//   const [donors, setDonors] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchTopDonors = async () => {
//     try {
//       const res = await getTopDonors();
//       setDonors(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTopDonors();
//   }, []);

//   if (loading) {
//     return <div className="p-6">Loading top donors...</div>;
//   }

//   return (
//     <div className="p-6 space-y-5">

//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
//           <FiTrendingUp className="text-rose-500" />
//         </div>
//         <div>
//           <h1 className="text-lg font-extrabold">Top Donors</h1>
//           <p className="text-xs text-gray-400">Leaderboard of highest contributors</p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
//             <tr>
//               <th className="px-6 py-3 text-left">Donor</th>
//               <th className="px-4 py-3 text-left">Total Donated</th>
//               <th className="px-4 py-3 text-left">Donations</th>
//               <th className="px-4 py-3 text-left">Last Donation</th>
//             </tr>
//           </thead>

//           <tbody>
//             {donors.map((d, i) => (
//               <tr
//                 key={d.userId}
//                 onClick={() => router.push(`/admin/donations/${d.userId}`)}
//                 className="border-t hover:bg-gray-50 cursor-pointer"
//               >
//                 {/* Donor */}
//                 <td className="px-6 py-4">
//                   <div>
//                     <p className="font-semibold text-gray-800">{d.name}</p>
//                     <p className="text-xs text-gray-400">{d.email}</p>
//                   </div>
//                 </td>

//                 {/* Amount */}
//                 <td className="px-4 py-4 font-bold text-rose-500">
//                   ₹{d.totalDonated.toLocaleString("en-IN")}
//                 </td>

//                 {/* Count */}
//                 <td className="px-4 py-4">
//                   <span className="flex items-center gap-1 text-gray-600">
//                     <FiUsers size={12} />
//                     {d.totalDonations}
//                   </span>
//                 </td>

//                 {/* Last Donation */}
//                 <td className="px-4 py-4 text-xs text-gray-400">
//                   <span className="flex items-center gap-1">
//                     <FiCalendar size={12} />
//                     {new Date(d.lastDonation).toLocaleDateString("en-IN")}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getTopDonors } from "@/features/admin/api/admin.api";
import { useRouter } from "next/navigation";

interface Donor {
  userId: number;
  name: string;
  email: string;
  totalDonated: number;
  totalDonations: number;
  lastDonation: string;
}

// ── Helpers ────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-sky-400 to-blue-600",
  "from-fuchsia-400 to-pink-600",
  "from-indigo-400 to-violet-600",
  "from-cyan-400 to-sky-600",
  "from-lime-400 to-green-600",
  "from-red-400 to-rose-600",
];

const MEDAL_CONFIG: Record<
  number,
  { bg: string; text: string; border: string; shadow: string; label: string }
> = {
  0: {
    bg: "from-yellow-300 to-amber-400",
    text: "text-amber-900",
    border: "border-amber-300",
    shadow: "shadow-amber-200/60",
    label: "🥇",
  },
  1: {
    bg: "from-slate-300 to-gray-400",
    text: "text-slate-700",
    border: "border-slate-300",
    shadow: "shadow-slate-200/60",
    label: "🥈",
  },
  2: {
    bg: "from-orange-300 to-amber-500",
    text: "text-orange-900",
    border: "border-orange-300",
    shadow: "shadow-orange-200/60",
    label: "🥉",
  },
};

// ── Loading Skeleton ───────────────────────────────────────────
function Skeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-3 w-48 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
      {/* Top 3 skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 animate-pulse mx-auto" />
            <div className="h-3 w-24 bg-gray-100 rounded-lg animate-pulse mx-auto" />
            <div className="h-5 w-20 bg-gray-100 rounded-lg animate-pulse mx-auto" />
          </div>
        ))}
      </div>
      {/* List skeleton */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse shrink-0" />
            <div className="w-10 h-10 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-28 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-2.5 w-40 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function TopDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await getTopDonors();
        setDonors(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Skeleton />;

  const maxDonated = donors[0]?.totalDonated ?? 1;
  const totalRaised = donors.reduce((s, d) => s + d.totalDonated, 0);
  const top3 = donors.slice(0, 3);
  const rest = donors.slice(3);

  return (
    <div className="p-6 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200/60">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Top Donors</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              {donors.length} contributors · ₹{totalRaised.toLocaleString("en-IN")} total raised
            </p>
          </div>
        </div>

        {/* Summary pill */}
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2.5">
          <div className="flex -space-x-2">
            {top3.map((d, i) => (
              <div
                key={d.userId}
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i]} border-2 border-white flex items-center justify-center text-white text-[9px] font-black`}
              >
                {initials(d.name)}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-rose-600">
            ₹{totalRaised.toLocaleString("en-IN")} raised
          </span>
        </div>
      </div>

      {/* ── Top 3 Podium ── */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {/* Reorder: 2nd, 1st, 3rd for podium visual */}
          {[top3[1], top3[0], top3[2]].map((d, visualIdx) => {
            const actualRank = visualIdx === 0 ? 1 : visualIdx === 1 ? 0 : 2;
            const medal = MEDAL_CONFIG[actualRank];
            const isFirst = actualRank === 0;
            const grad = AVATAR_GRADIENTS[actualRank];

            return (
              <div
                key={d.userId}
                // onClick={() => router.push(`/admin/donations/${d.userId}`)}
                className={`relative cursor-pointer group rounded-3xl border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isFirst
                    ? "shadow-lg shadow-amber-100/80 border-amber-200/60 ring-1 ring-amber-200/40"
                    : "shadow-sm border-gray-100 hover:shadow-gray-200/80"
                }`}
                style={{ marginTop: isFirst ? 0 : "1.5rem" }}
              >
                {/* Rank ribbon */}
                <div className={`bg-gradient-to-r ${medal.bg} px-4 py-2.5 flex items-center justify-between`}>
                  <span className={`text-[11px] font-black uppercase tracking-widest ${medal.text}`}>
                    #{actualRank + 1} Rank
                  </span>
                  <span className="text-base">{medal.label}</span>
                </div>

                <div className="p-4 flex flex-col items-center text-center gap-3">
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-lg font-black shadow-lg ${medal.shadow}`}>
                    {initials(d.name)}
                  </div>

                  {/* Name & email */}
                  <div className="min-w-0 w-full">
                    <p className="text-sm font-extrabold text-gray-900 truncate">{d.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{d.email}</p>
                  </div>

                  {/* Amount */}
                  <p className="text-lg font-black text-rose-500 tracking-tight">
                    ₹{d.totalDonated.toLocaleString("en-IN")}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 w-full justify-center flex-wrap">
                    <span className="text-[10px] font-bold text-gray-400">
                      {d.totalDonations} donation{d.totalDonations > 1 ? "s" : ""}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400">
                      {timeAgo(d.lastDonation)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Ranked List (4th onwards) ── */}
      {rest.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section label */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
              More Contributors
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {rest.map((d, i) => {
              const rank = i + 4;
              const barWidth = Math.round((d.totalDonated / maxDonated) * 100);
              const grad = AVATAR_GRADIENTS[rank - 1] ?? AVATAR_GRADIENTS[9];

              return (
                <div
                  key={d.userId}
                  onClick={() => router.push(`/admin/donations/${d.userId}`)}
                  className="relative px-6 py-4 hover:bg-rose-50/30 cursor-pointer transition-colors group overflow-hidden"
                >
                  {/* Subtle progress bar background */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-rose-50/60 transition-all duration-700 pointer-events-none"
                    style={{ width: `${barWidth}%` }}
                  />

                  <div className="relative flex items-center gap-4">
                    {/* Rank number */}
                    <div className="w-8 text-center shrink-0">
                      <span className="text-xs font-black text-gray-300 tabular-nums">#{rank}</span>
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm`}
                    >
                      {initials(d.name)}
                    </div>

                    {/* Name & email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{d.name}</p>
                      <p className="text-xs text-gray-400 truncate">{d.email}</p>
                    </div>

                    {/* Donations count */}
                    <div className="hidden sm:flex flex-col items-center shrink-0 w-16">
                      <p className="text-sm font-extrabold text-gray-700">{d.totalDonations}</p>
                      <p className="text-[10px] text-gray-400 font-medium">donations</p>
                    </div>

                    {/* Last donation */}
                    <div className="hidden md:flex flex-col items-end shrink-0 w-20">
                      <p className="text-xs font-bold text-gray-500">{timeAgo(d.lastDonation)}</p>
                      <p className="text-[10px] text-gray-400">last gift</p>
                    </div>

                    {/* Amount */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-rose-500">
                        ₹{d.totalDonated.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Chevron */}
                    <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors">
                      <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} className="text-gray-400 group-hover:text-rose-500 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-gray-400 font-medium">
              Showing {donors.length} donors
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Combined:{" "}
              <span className="text-rose-500 font-bold">
                ₹{totalRaised.toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {donors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-rose-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
          </div>
          <p className="text-gray-700 font-bold text-base">No donors yet</p>
          <p className="text-gray-400 text-sm">Donations will appear here once received</p>
        </div>
      )}
    </div>
  );
}
