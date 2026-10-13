// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import {
//   FiTrendingUp,
//   FiTarget,
//   FiDollarSign,
//   FiAward,
//   FiUsers,
//   FiRefreshCw,
// } from "react-icons/fi";
// import { getTopCampaigns } from "@/features/super-admin/api/finance.api";

// type Campaign = {
//   id: number;
//   title: string;
//   image: string;
//   cause: {
//     id: number;
//     name: string;
//   };
//   goalAmount: number;
//   raisedAmount: number;
//   totalRaised: number;
//   totalDonations: number;
//   progress: number;
// };

// const formatCurrency = (value: number) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(value);

// function StatCard({
//   title,
//   value,
//   icon,
//   color,
// }: {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
// }) {
//   return (
//     <div className="rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
//       <div className={`h-1 ${color}`} />

//       <div className="p-6 flex justify-between items-start">
//         <div>
//           <p className="text-sm text-gray-500 font-medium">{title}</p>

//           <h2 className="mt-3 text-3xl font-bold text-gray-900">
//             {value}
//           </h2>
//         </div>

//         <div
//           className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}
//         >
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function LoadingCard() {
//   return (
//     <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse">
//       <div className="h-60 bg-gray-200" />

//       <div className="p-6 space-y-4">
//         <div className="h-5 bg-gray-200 rounded w-3/4" />

//         <div className="h-4 bg-gray-100 rounded w-1/2" />

//         <div className="h-2 rounded-full bg-gray-200" />

//         <div className="grid grid-cols-2 gap-3">
//           <div className="h-16 bg-gray-100 rounded-xl" />
//           <div className="h-16 bg-gray-100 rounded-xl" />
//         </div>

//         <div className="h-10 rounded-xl bg-gray-100" />
//       </div>
//     </div>
//   );
// }

// export default function TopCampaignsPage() {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadCampaigns = async () => {
//     try {
//       setLoading(true);

//       const res = await getTopCampaigns();

//       setCampaigns(res.data || []);
//     } catch (err: any) {
//       setError(err.message || "Failed to load campaigns.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCampaigns();
//   }, []);

//   const stats = useMemo(() => {
//     const totalRaised = campaigns.reduce(
//       (sum, item) => sum + item.raisedAmount,
//       0
//     );

//     const totalGoal = campaigns.reduce(
//       (sum, item) => sum + item.goalAmount,
//       0
//     );

//     const totalDonations = campaigns.reduce(
//       (sum, item) => sum + item.totalDonations,
//       0
//     );

//     const avgProgress =
//       campaigns.length > 0
//         ? campaigns.reduce((sum, c) => sum + c.progress, 0) /
//         campaigns.length
//         : 0;

//     return {
//       totalRaised,
//       totalGoal,
//       totalDonations,
//       avgProgress,
//       topCampaign: campaigns[0]?.title ?? "--",
//     };
//   }, [campaigns]);

//   if (loading) {
//     return (
//       <div className="space-y-8">

//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Top Revenue Campaigns
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Highest performing campaigns by total revenue.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
//           {[1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               className="h-40 rounded-3xl bg-white animate-pulse"
//             />
//           ))}
//         </div>

//         <div className="grid lg:grid-cols-2 gap-7">
//           {[1, 2, 3, 4].map((i) => (
//             <LoadingCard key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
//         <h2 className="text-2xl font-bold text-red-600">
//           Failed to load campaigns
//         </h2>

//         <p className="text-red-500 mt-2">{error}</p>

//         <button
//           onClick={loadCampaigns}
//           className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition"
//         >
//           <FiRefreshCw />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!campaigns.length) {
//     return (
//       <div className="rounded-3xl bg-white p-16 border text-center">
//         <FiTarget
//           className="mx-auto text-gray-300"
//           size={70}
//         />

//         <h2 className="mt-5 text-2xl font-bold text-gray-700">
//           No Campaigns Found
//         </h2>

//         <p className="mt-2 text-gray-500">
//           There are no revenue campaigns available.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">

//       {/* Header */}

//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Top Revenue Campaigns
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Monitor the best performing fundraising campaigns across the
//             platform.
//           </p>
//         </div>

//         <button
//           onClick={loadCampaigns}
//           className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition flex items-center gap-2"
//         >
//           <FiRefreshCw />
//           Refresh
//         </button>
//       </div>

//       {/* Summary */}

//       <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

//         <StatCard
//           title="Total Raised"
//           value={formatCurrency(stats.totalRaised)}
//           icon={<FiDollarSign size={24} />}
//           color="bg-gradient-to-r from-red-500 to-red-600"
//         />

//         <StatCard
//           title="Total Goal"
//           value={formatCurrency(stats.totalGoal)}
//           icon={<FiTarget size={24} />}
//           color="bg-gradient-to-r from-orange-500 to-red-500"
//         />

//         <StatCard
//           title="Total Donations"
//           value={stats.totalDonations}
//           icon={<FiUsers size={24} />}
//           color="bg-gradient-to-r from-indigo-500 to-blue-500"
//         />

//         <StatCard
//           title="Average Progress"
//           value={`${stats.avgProgress.toFixed(1)}%`}
//           icon={<FiTrendingUp size={24} />}
//           color="bg-gradient-to-r from-emerald-500 to-green-500"
//         />

//       </div>
//       {/* Campaign Grid */}
//       {campaigns.length > 0 ? (
//         <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
//           {campaigns.map((campaign, index) => {
//             const progress = Math.min(campaign.progress, 100);

//             return (
//               <div
//                 key={campaign.id}
//                 className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
//               >
//                 {/* Image */}
//                 <div className="relative h-52 overflow-hidden">
//                   <img
//                     src={campaign.image}
//                     alt={campaign.title}
//                     className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//                   <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
//                     #{index + 1}
//                   </div>

//                   {campaign.progress >= 100 && (
//                     <div className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">
//                       Fully Funded
//                     </div>
//                   )}

//                   <div className="absolute bottom-4 left-4 right-4">
//                     <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 backdrop-blur">
//                       {campaign.cause.name}
//                     </div>

//                     <h3 className="mt-2 line-clamp-2 text-lg font-bold text-white">
//                       {campaign.title}
//                     </h3>
//                   </div>
//                 </div>

//                 {/* Body */}
//                 <div className="space-y-5 p-5">
//                   {/* Progress */}
//                   <div>
//                     <div className="mb-2 flex justify-between text-sm">
//                       <span className="font-medium text-gray-500">
//                         Progress
//                       </span>

//                       <span className="font-bold text-red-600">
//                         {campaign.progress.toFixed(2)}%
//                       </span>
//                     </div>

//                     <div className="h-3 overflow-hidden rounded-full bg-gray-200">
//                       <div
//                         className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700"
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                   </div>

//                   {/* Amounts */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="rounded-2xl bg-red-50 p-4">
//                       <p className="text-xs uppercase tracking-wide text-gray-500">
//                         Raised
//                       </p>

//                       <p className="mt-1 text-lg font-bold text-red-600">
//                         {formatCurrency(campaign.raisedAmount)}
//                       </p>
//                     </div>

//                     <div className="rounded-2xl bg-gray-100 p-4">
//                       <p className="text-xs uppercase tracking-wide text-gray-500">
//                         Goal
//                       </p>

//                       <p className="mt-1 text-lg font-bold text-gray-900">
//                         {formatCurrency(campaign.goalAmount)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Stats */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="rounded-xl border border-gray-200 p-4 text-center">
//                       <p className="text-xs uppercase text-gray-500">
//                         Donations
//                       </p>

//                       <p className="mt-1 text-xl font-bold text-gray-900">
//                         {campaign.totalDonations}
//                       </p>
//                     </div>

//                     <div className="rounded-xl border border-gray-200 p-4 text-center">
//                       <p className="text-xs uppercase text-gray-500">
//                         Revenue
//                       </p>

//                       <p className="mt-1 text-xl font-bold text-green-600">
//                         {formatCurrency(campaign.totalRaised)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="flex items-center justify-between border-t pt-4">
//                     <span className="text-sm text-gray-500">
//                       Campaign #{campaign.id}
//                     </span>

//                     <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
//                       Top Performer
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-24 text-center">
//           <FiAward className="mx-auto h-12 w-12 text-gray-300" />

//           <h3 className="mt-4 text-xl font-bold text-gray-700">
//             No campaigns found
//           </h3>

//           <p className="mt-2 text-gray-500">
//             There are no top campaigns available.
//           </p>
//         </div>
//       )}
//       {/* </>
//       )} */}
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  Heart,
  IndianRupee,
  Target,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Activity,
  BarChart3,
  Layers,
  Trophy,
  Users,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { getTopCampaigns } from "@/features/super-admin/api/finance.api";

/* ─────────────────────────────────────────────
   TYPES (matches the API response)
───────────────────────────────────────────── */

interface CampaignCause {
  id: number;
  name: string;
}

interface TopCampaign {
  id: number;
  title: string;
  image?: string | null;
  cause?: CampaignCause | null;
  goalAmount?: number | null;
  raisedAmount?: number | null;
  totalRaised?: number | null;
  totalDonations?: number | null;
  progress?: number | null;
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function num(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function clampPct(v: number): number {
  return Math.min(100, Math.max(0, v));
}

function fmtINR(v: number | null | undefined): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(num(v)));
}

function fmtCompact(v: number | null | undefined): string {
  const n = num(v);
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
}

function fmtNum(v: number | null | undefined): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(num(v)));
}

function fmtPct(v: number | null | undefined): string {
  return `${Number(num(v).toFixed(2))}%`;
}

function raisedOf(c: TopCampaign): number {
  return num(c.totalRaised ?? c.raisedAmount);
}

function progressOf(c: TopCampaign): number {
  if (typeof c.progress === "number" && Number.isFinite(c.progress)) return c.progress;
  const goal = num(c.goalAmount);
  return goal > 0 ? (raisedOf(c) / goal) * 100 : 0;
}

function extractCampaigns(res: unknown): TopCampaign[] {
  if (Array.isArray(res)) return res as TopCampaign[];
  if (typeof res === "object" && res !== null) {
    const d = (res as { data?: unknown }).data;
    if (Array.isArray(d)) return d as TopCampaign[];
  }
  return [];
}

type Tone = "done" | "strong" | "building";

function toneOf(progress: number): Tone {
  if (progress >= 100) return "done";
  if (progress >= 50) return "strong";
  return "building";
}

const TONE_BAR: Record<Tone, string> = {
  done: "bg-emerald-500",
  strong: "bg-[#D2252B]",
  building: "bg-amber-500",
};

const TONE_BADGE: Record<Tone, string> = {
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  strong: "bg-red-50 text-[#D2252B] border-red-200",
  building: "bg-amber-50 text-amber-700 border-amber-200",
};

const TONE_LABEL: Record<Tone, string> = {
  done: "Goal reached",
  strong: "On track",
  building: "Building",
};

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className ?? ""}`} />;
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 leading-tight">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      {sub ? <p className="text-[11px] text-slate-400 mt-1.5">{sub}</p> : null}
    </div>
  );
}

function ProgressBar({ pct, tone }: { pct: number; tone: Tone }) {
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${TONE_BAR[tone]}`}
        style={{ width: `${clampPct(pct)}%` }}
        role="progressbar"
        aria-valuenow={Math.round(clampPct(pct))}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

function RingStat({
  label,
  pct,
  color,
  subLabel,
}: {
  label: string;
  pct: number;
  color: string;
  subLabel: string;
}) {
  const p = Math.round(clampPct(pct));
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (p / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#f1f5f9" strokeWidth="5" />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-slate-700">
          {p}%
        </span>
      </div>
      <div className="text-center">
        <p className="text-[11px] text-slate-700 font-semibold">{label}</p>
        <p className="text-[10px] text-slate-400">{subLabel}</p>
      </div>
    </div>
  );
}

function CampaignImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className ?? ""}`}>
        <Megaphone className="h-6 w-6 text-slate-300" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className ?? ""}`}
    />
  );
}

function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 1
      ? "bg-[#D2252B] text-white"
      : rank === 2
      ? "bg-slate-900 text-white"
      : rank === 3
      ? "bg-slate-600 text-white"
      : "bg-white text-slate-700 border border-slate-200";
  return (
    <span className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg px-1.5 text-xs font-extrabold shadow-sm ${cls}`}>
      #{rank}
    </span>
  );
}

function SectionHead({
  icon,
  iconBg,
  title,
  right,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      {right ? <div className="ml-auto">{right}</div> : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function SuperAdminDashboard() {
  const [campaigns, setCampaigns] = useState<TopCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(false);
      const res: unknown = await getTopCampaigns();
      setCampaigns(extractCampaigns(res));
      setLoaded(true);
    } catch (e) {
      console.error("Failed to load top campaigns:", e);
      setError(true);
      toast.error("Unable to load top campaigns");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchDashboard(false);
  }, []);

  /* ── derived stats (calculated from the returned campaigns only) ── */
  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce((a, c) => a + raisedOf(c), 0);
    const totalGoal = campaigns.reduce((a, c) => a + num(c.goalAmount), 0);
    const totalDonations = campaigns.reduce((a, c) => a + num(c.totalDonations), 0);
    const reached = campaigns.filter((c) => progressOf(c) >= 100).length;
    const strong = campaigns.filter((c) => progressOf(c) >= 50 && progressOf(c) < 100).length;
    const building = campaigns.length - reached - strong;
    const overall = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0;
    const avgDonation = totalDonations > 0 ? totalRaised / totalDonations : 0;

    const causeMap = new Map<string, { name: string; campaigns: number; raised: number; donations: number }>();
    campaigns.forEach((c) => {
      const key = c.cause ? String(c.cause.id) : "none";
      const name = c.cause?.name?.trim() || "Uncategorised";
      const cur = causeMap.get(key) ?? { name, campaigns: 0, raised: 0, donations: 0 };
      cur.campaigns += 1;
      cur.raised += raisedOf(c);
      cur.donations += num(c.totalDonations);
      causeMap.set(key, cur);
    });
    const causes = Array.from(causeMap.values()).sort((a, b) => b.raised - a.raised);

    return { totalRaised, totalGoal, totalDonations, reached, strong, building, overall, avgDonation, causes };
  }, [campaigns]);

  /* ── Error ── */
  if (!loading && error && !loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-[#D2252B]" />
        </div>
        <p className="text-base font-bold text-slate-800">Unable to load top campaigns</p>
        <p className="text-sm text-slate-400 max-w-xs">Something went wrong while fetching the data. Please try again.</p>
        <button
          onClick={() => void fetchDashboard(false)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-red-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading top campaigns">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="h-60 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-60 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const top = campaigns[0];
  const maxCauseRaised = Math.max(1, ...stats.causes.map((c) => c.raised));

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-12 w-full overflow-x-hidden">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D2252B] mb-1">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">Top Campaigns</h1>
          <p className="text-sm text-slate-500 mt-1">
            Best-performing fundraising campaigns on the YOYO Foundation platform.
          </p>
        </div>
        <button
          onClick={() => void fetchDashboard(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>Unable to refresh. Showing previously loaded data.</span>
          <button onClick={() => void fetchDashboard(true)} className="font-semibold underline underline-offset-2">
            Retry
          </button>
        </div>
      ) : null}

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Inbox className="h-7 w-7 text-slate-400" />
          </div>
          <p className="mt-4 text-base font-bold text-slate-800">No campaigns to display</p>
          <p className="mt-1 text-sm text-slate-400 max-w-xs">
            Top campaigns will appear here once campaigns start receiving donations.
          </p>
        </div>
      ) : (
        <>
          {/* ── KPI CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Campaigns Ranked"
              value={fmtNum(campaigns.length)}
              sub="In the top campaigns list"
              icon={<Megaphone className="h-5 w-5 text-white" />}
              iconBg="bg-amber-500"
            />
            <KpiCard
              label="Total Raised"
              value={fmtCompact(stats.totalRaised)}
              sub={fmtINR(stats.totalRaised)}
              icon={<IndianRupee className="h-5 w-5 text-white" />}
              iconBg="bg-emerald-500"
            />
            <KpiCard
              label="Combined Goal"
              value={fmtCompact(stats.totalGoal)}
              sub={fmtINR(stats.totalGoal)}
              icon={<Target className="h-5 w-5 text-white" />}
              iconBg="bg-violet-500"
            />
            <KpiCard
              label="Overall Achievement"
              value={fmtPct(stats.overall)}
              sub="Raised vs combined goal"
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              iconBg="bg-blue-500"
            />
            <KpiCard
              label="Total Donations"
              value={fmtNum(stats.totalDonations)}
              sub="Across these campaigns"
              icon={<Heart className="h-5 w-5 text-white" />}
              iconBg="bg-[#D2252B]"
            />
            <KpiCard
              label="Avg / Donation"
              value={stats.totalDonations > 0 ? fmtINR(stats.avgDonation) : "—"}
              sub="Raised ÷ donations"
              icon={<Users className="h-5 w-5 text-white" />}
              iconBg="bg-slate-700"
            />
            <KpiCard
              label="Goals Reached"
              value={fmtNum(stats.reached)}
              sub={`of ${fmtNum(campaigns.length)} campaigns`}
              icon={<CheckCircle2 className="h-5 w-5 text-white" />}
              iconBg="bg-emerald-600"
            />
            <KpiCard
              label="Causes Covered"
              value={fmtNum(stats.causes.length)}
              sub="Distinct causes in the list"
              icon={<Layers className="h-5 w-5 text-white" />}
              iconBg="bg-indigo-500"
            />
          </div>

          {/* ── SPOTLIGHT + FUNDING HEALTH ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {top ? (
              <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6 sm:p-7 flex flex-col justify-between min-h-[240px]">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-[#D2252B]/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-red-500/10 blur-2xl" />
                <div className="relative z-10 flex flex-col sm:flex-row gap-5">
                  <CampaignImage
                    src={top.image}
                    alt={top.title}
                    className="h-28 w-full sm:h-32 sm:w-44 shrink-0 rounded-xl border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                      <Trophy className="h-3.5 w-3.5 text-[#D2252B]" /> Top campaign
                    </p>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">{top.title}</h2>
                    {top.cause?.name ? <p className="text-gray-400 text-sm mt-1">{top.cause.name}</p> : null}
                  </div>
                </div>
                <div className="relative z-10 mt-6">
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D2252B]"
                      style={{ width: `${clampPct(progressOf(top))}%` }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                    <div>
                      <p className="text-gray-500 text-xs font-medium">Raised</p>
                      <p className="text-white font-bold text-lg mt-0.5">{fmtINR(raisedOf(top))}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium">Goal</p>
                      <p className="text-white font-bold text-lg mt-0.5">{fmtINR(top.goalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium">Achievement</p>
                      <p className="text-white font-bold text-lg mt-0.5">{fmtPct(progressOf(top))}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium">Donations</p>
                      <p className="text-white font-bold text-lg mt-0.5">{fmtNum(top.totalDonations)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <SectionHead
                icon={<Activity className="h-4 w-4 text-emerald-600" />}
                iconBg="bg-emerald-50"
                title="Funding Health"
              />
              <div className="mt-5 flex justify-around gap-2">
                <RingStat
                  label="Goals reached"
                  pct={campaigns.length > 0 ? (stats.reached / campaigns.length) * 100 : 0}
                  color="text-emerald-500"
                  subLabel={`${stats.reached} of ${campaigns.length}`}
                />
                <RingStat
                  label="Overall goal"
                  pct={stats.overall}
                  color="text-[#D2252B]"
                  subLabel="raised vs goal"
                />
              </div>
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                {(
                  [
                    { tone: "done" as Tone, count: stats.reached, label: "Goal reached (100%+)" },
                    { tone: "strong" as Tone, count: stats.strong, label: "On track (50–99%)" },
                    { tone: "building" as Tone, count: stats.building, label: "Building (under 50%)" },
                  ]
                ).map((row) => (
                  <div key={row.tone}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">{row.label}</span>
                      <span className="font-extrabold text-slate-900">{fmtNum(row.count)}</span>
                    </div>
                    <ProgressBar
                      pct={campaigns.length > 0 ? (row.count / campaigns.length) * 100 : 0}
                      tone={row.tone}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RANKED CAMPAIGNS ── */}
          <div className="space-y-4">
            <SectionHead
              icon={<Trophy className="h-4 w-4 text-[#D2252B]" />}
              iconBg="bg-red-50"
              title="Campaign Rankings"
              right={
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {campaigns.length} campaigns
                </span>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {campaigns.map((c, i) => {
                const p = progressOf(c);
                const tone = toneOf(p);
                return (
                  <div
                    key={c.id}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative">
                      <CampaignImage src={c.image} alt={c.title} className="h-40 w-full" />
                      <div className="absolute left-3 top-3">
                        <RankBadge rank={i + 1} />
                      </div>
                      <span
                        className={`absolute right-3 top-3 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${TONE_BADGE[tone]}`}
                      >
                        {TONE_LABEL[tone]}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2" title={c.title}>
                        {c.title}
                      </p>
                      {c.cause?.name ? (
                        <p className="mt-1 text-[11px] font-medium text-slate-400 truncate">{c.cause.name}</p>
                      ) : null}

                      <div className="mt-4">
                        <div className="flex items-end justify-between mb-1.5">
                          <p className="text-lg font-extrabold text-slate-900">{fmtINR(raisedOf(c))}</p>
                          <p className="text-xs font-bold text-slate-700">{fmtPct(p)}</p>
                        </div>
                        <ProgressBar pct={p} tone={tone} />
                        <p className="mt-1.5 text-[11px] text-slate-400">of {fmtINR(c.goalAmount)} goal</p>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 mt-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Donations</p>
                          <p className="text-sm font-bold text-slate-900">{fmtNum(c.totalDonations)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Avg donation</p>
                          <p className="text-sm font-bold text-slate-900">
                            {num(c.totalDonations) > 0 ? fmtINR(raisedOf(c) / num(c.totalDonations)) : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CAUSE BREAKDOWN ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <SectionHead
              icon={<BarChart3 className="h-4 w-4 text-amber-600" />}
              iconBg="bg-amber-50"
              title="Raised by Cause"
              right={<span className="text-xs text-slate-400">Across the campaigns listed above</span>}
            />
            <div className="mt-5 space-y-5">
              {stats.causes.map((cause) => (
                <div key={cause.name}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                    <span className="text-slate-800 font-semibold">{cause.name}</span>
                    <span className="flex items-center gap-3 text-slate-400">
                      <span>
                        {cause.campaigns} {cause.campaigns === 1 ? "campaign" : "campaigns"}
                      </span>
                      <span>{fmtNum(cause.donations)} donations</span>
                      <span className="font-extrabold text-slate-900">{fmtINR(cause.raised)}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D2252B] transition-all"
                      style={{ width: `${(cause.raised / maxCauseRaised) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SUMMARY FOOTER ── */}
          <div className="rounded-2xl bg-slate-900 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              {
                label: "Goal Completion Rate",
                value: campaigns.length > 0 ? `${Math.round((stats.reached / campaigns.length) * 100)}%` : "—",
                sub: `${stats.reached} of ${campaigns.length} reached`,
              },
              { label: "Overall Achievement", value: fmtPct(stats.overall), sub: "raised vs combined goal" },
              {
                label: "Avg Donation Value",
                value: stats.totalDonations > 0 ? fmtCompact(stats.avgDonation) : "—",
                sub: "per donation",
              },
              {
                label: "Avg Raised / Campaign",
                value: campaigns.length > 0 ? fmtCompact(stats.totalRaised / campaigns.length) : "—",
                sub: "across ranked campaigns",
              },
            ].map(({ label, value, sub }) => (
              <div key={label}>
                <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
                <p className="text-white text-xl font-extrabold">{value}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
