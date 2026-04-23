// import StatusBadge from "./statusBadge";

// export default function DonationsTable({ data, loading }: any) {
//   if (loading) return <div>Loading donations...</div>;

//   if (!data?.length) {
//     return <div className="text-center text-gray-400 py-10">No donations found</div>;
//   }

//   return (
//     <div className="bg-white rounded-xl shadow overflow-x-auto">
//       <table className="w-full text-sm">
//         <thead className="bg-gray-50 text-gray-600">
//           <tr>
//             <th className="p-3 text-left">Donor</th>
//             <th>Email</th>
//             <th>Campaign</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Date</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((d: any) => (
//             <tr key={d.id} className="border-t">
//               <td className="p-3">{d.donorName}</td>
//               <td>{d.donorEmail}</td>
//               <td>{d.campaign?.title}</td>
//               <td>₹{d.amount}</td>
//               <td><StatusBadge status={d.status} /></td>
//               <td>{new Date(d.createdAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// new table ui

import StatusBadge from "./statusBadge";
import { FiHeart, FiInbox, FiArrowUpRight, FiCalendar, FiMail, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function DonationsTable({ data, loading }: any) {
    // ── Loading State ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Header skeleton */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 animate-pulse" />
                        <div className="space-y-1.5">
                            <div className="h-4 w-32 bg-gray-100 rounded-lg animate-pulse" />
                            <div className="h-3 w-20 bg-gray-100 rounded-lg animate-pulse" />
                        </div>
                    </div>
                    <div className="h-8 w-24 bg-gray-100 rounded-xl animate-pulse" />
                </div>
                {/* Row skeletons */}
                <div className="divide-y divide-gray-50">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
                            <div className="flex-1 grid grid-cols-5 gap-4">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-3 bg-gray-100 rounded-lg animate-pulse" style={{ opacity: 1 - j * 0.12 }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Empty State ────────────────────────────────────────────────
    if (!data?.length) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <FiInbox size={28} className="text-rose-300" />
                </div>
                <div>
                    <p className="text-gray-800 font-bold text-base">No donations yet</p>
                    <p className="text-gray-400 text-sm mt-1">Donations will appear here once received</p>
                </div>
            </div>
        );
    }

    // ── Helpers ────────────────────────────────────────────────────
    const totalAmount = data.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const completedCount = data.filter((d: any) => d.status === "completed" || d.status === "success").length;

    // ── Table ──────────────────────────────────────────────────────
    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">

            {/* ── Table Header Bar ── */}
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                        <FiHeart size={18} className="text-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">Donation Overview</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{data.length} total records</p>
                    </div>
                </div>

                {/* Summary pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-xl">
                        <FiArrowUpRight size={12} className="text-rose-500" />
                        <span className="text-xs font-bold text-rose-600">₹{totalAmount.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-rose-400 font-medium">raised</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        <span className="text-xs font-bold text-emerald-600">{completedCount}</span>
                        <span className="text-[10px] text-emerald-500 font-medium">completed</span>
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="px-6 py-3.5 text-left">
                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <FiUser size={10} /> Donor
                                </span>
                            </th>
                            <th className="px-4 py-3.5 text-left">
                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <FiMail size={10} /> Email
                                </span>
                            </th>
                            <th className="px-4 py-3.5 text-left">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Campaign</span>
                            </th>
                            <th className="px-4 py-3.5 text-left">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</span>
                            </th>
                            <th className="px-4 py-3.5 text-left">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                            </th>
                            <th className="px-6 py-3.5 text-left">
                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <FiCalendar size={10} /> Date
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {data.map((d: any, index: number) => {
                            // Initials avatar color based on name
                            const colors = [
                                "bg-violet-100 text-violet-600",
                                "bg-rose-100 text-rose-600",
                                "bg-amber-100 text-amber-600",
                                "bg-sky-100 text-sky-600",
                                "bg-emerald-100 text-emerald-600",
                                "bg-pink-100 text-pink-600",
                            ];
                            const colorClass = colors[index % colors.length];
                            const initials = d.donorName
                                ? d.donorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                                : "?";
                            const router = useRouter();
                            return (
                                <tr
                                    key={d.id}
                                    onClick={() =>
                                        router.push(`/admin/donations/${encodeURIComponent(d.donorEmail)}`)
                                    }
                                    className="hover:bg-gray-50/60 transition-colors duration-150 group cursor-pointer"
                                >
                                    {/* Donor */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}>
                                                {initials}
                                            </div>
                                            <span className="font-semibold text-gray-800 text-sm truncate max-w-[120px]">
                                                {d.donorName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-4">
                                        <span className="text-gray-500 text-xs truncate max-w-[160px] block">
                                            {d.donorEmail}
                                        </span>
                                    </td>

                                    {/* Campaign */}
                                    <td className="px-4 py-4">
                                        <span className="inline-block max-w-[140px] truncate text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                                            {d.campaign?.title || "—"}
                                        </span>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-4 py-4">
                                        <span className="font-extrabold text-gray-900 text-sm tracking-tight">
                                            ₹{Number(d.amount).toLocaleString("en-IN")}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-4">
                                        <StatusBadge status={d.status} />
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(d.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">
                    Showing <span className="text-gray-600 font-semibold">{data.length}</span> donations
                </p>
                <p className="text-xs text-gray-400 font-medium">
                    Total raised:{" "}
                    <span className="text-rose-500 font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
                </p>
            </div>
        </div>
    );
}
