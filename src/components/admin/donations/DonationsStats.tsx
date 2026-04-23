// export default function DonationsStats({ stats }: any) {
//   if (!stats) return <div>Loading stats...</div>;

//   const cards = [
//     { label: "Total Donations", value: stats.total },
//     { label: "Total Amount", value: `₹${stats.totalAmount}` },
//     { label: "Success", value: stats.success },
//     { label: "Pending", value: stats.pending },
//     { label: "Failed", value: stats.failed },
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//       {cards.map((c, i) => (
//         <div key={i} className="bg-white p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-500">{c.label}</p>
//           <p className="text-xl font-bold text-gray-800">{c.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// new componenet stats

import { FiHeart, FiTrendingUp, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

export default function DonationsStats({ stats }: any) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-6 w-12 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Donations",
      value: stats.total,
      icon: FiHeart,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      valuColor: "text-gray-900",
      accent: "border-l-rose-400",
    },
    {
      label: "Total Amount",
      value: `₹${Number(stats.totalAmount).toLocaleString("en-IN")}`,
      icon: FiTrendingUp,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      valuColor: "text-gray-900",
      accent: "border-l-violet-400",
    },
    {
      label: "Successful",
      value: stats.success,
      icon: FiCheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      valuColor: "text-emerald-600",
      accent: "border-l-emerald-400",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: FiClock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      valuColor: "text-amber-600",
      accent: "border-l-amber-400",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: FiXCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-400",
      valuColor: "text-red-500",
      accent: "border-l-red-300",
    },
  ];

  // Success rate for progress bar
  const successRate = stats.total > 0
    ? Math.round((stats.success / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-3">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${c.accent} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col gap-3`}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={c.iconColor} />
              </div>

              {/* Text */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                  {c.label}
                </p>
                <p className={`text-xl font-extrabold tracking-tight leading-none ${c.valuColor}`}>
                  {c.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success rate bar */}
      {stats.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5 flex items-center gap-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
            Success Rate
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${successRate}%` }}
            />
          </div>
          <span className="text-sm font-extrabold text-emerald-600 shrink-0 tabular-nums">
            {successRate}%
          </span>
        </div>
      )}

    </div>
  );
}
