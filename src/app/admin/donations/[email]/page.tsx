// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getDonations } from "@/features/admin/api/admin.api";

// export default function DonorDetailPage() {
//   const params = useParams();
//   const email = decodeURIComponent(params.email as string);

//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDonorData = async () => {
//     try {
//       const res = await getDonations({
//         search: email,
//         limit: 50,
//       });

//       setData(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (email) fetchDonorData();
//   }, [email]);

//   if (loading) return <div className="p-6">Loading donor details...</div>;

//   if (!data.length) return <div className="p-6">No data found</div>;

//   const donor = data[0];

//   const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

//   return (
//     <div className="p-6 space-y-6">

//       {/* 🔹 Donor Info */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-lg font-bold text-gray-800 mb-2">
//           {donor.donorName}
//         </h2>
//         <p className="text-sm text-gray-500">{donor.donorEmail}</p>
//         <p className="text-sm text-gray-500">{donor.donorMobile}</p>

//         <div className="mt-4 text-sm">
//           <span className="font-semibold">Total Donated:</span>{" "}
//           ₹{totalAmount.toLocaleString("en-IN")}
//         </div>
//       </div>

//       {/* 🔹 Donations History */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left">Campaign</th>
//               <th className="px-4 py-3 text-left">Amount</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Date</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((d) => (
//               <tr key={d.id} className="border-t">
//                 <td className="px-4 py-3">{d.campaign?.title}</td>
//                 <td className="px-4 py-3 font-semibold">
//                   ₹{d.amount.toLocaleString("en-IN")}
//                 </td>
//                 <td className="px-4 py-3">{d.status}</td>
//                 <td className="px-4 py-3 text-gray-500 text-xs">
//                   {new Date(d.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }

//new design component 

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDonations } from "@/features/admin/api/admin.api";
import {
  FiMail,
  FiPhone,
  FiHeart,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase();
  if (s === "SUCCESS" || s === "COMPLETED")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
        <FiCheckCircle size={10} /> Success
      </span>
    );
  if (s === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
        <FiClock size={10} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">
      <FiXCircle size={10} /> Failed
    </span>
  );
};

export default function DonorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const email = decodeURIComponent(params.email as string);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonorData = async () => {
    try {
      const res = await getDonations({ search: email, limit: 50 });
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchDonorData();
  }, [email]);

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 space-y-5">
        {/* Profile skeleton */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-3 w-48 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-3 w-28 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-5 w-12 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-12 bg-gray-50 border-b border-gray-100 animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-50 flex gap-4">
              <div className="h-3 flex-1 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-3 w-24 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────
  if (!data.length) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
          <FiHeart size={26} className="text-rose-300" />
        </div>
        <p className="text-gray-700 font-bold text-base">No donor data found</p>
        <p className="text-gray-400 text-sm">No donations found for this donor</p>
      </div>
    );
  }

  const donor = data[0];
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
  const successCount = data.filter((d) => ["SUCCESS", "COMPLETED"].includes(d.status?.toUpperCase())).length;
  const pendingCount = data.filter((d) => d.status?.toUpperCase() === "PENDING").length;
  const failedCount = data.filter((d) => d.status?.toUpperCase() === "FAILED").length;

  // Initials
  const initials = donor.donorName
    ? donor.donorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="p-6 space-y-5">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-700 transition group"
      >
        <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Donations
      </button>

      {/* ── Donor Profile Card ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-violet-400 to-rose-300" />

        <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-violet-500 flex items-center justify-center text-white text-xl font-extrabold tracking-tight shrink-0 shadow-lg shadow-rose-200/60">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight truncate">
              {donor.donorName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <FiMail size={12} className="text-gray-400" />
                {donor.donorEmail}
              </span>
              {donor.donorMobile && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <FiPhone size={12} className="text-gray-400" />
                  {donor.donorMobile}
                </span>
              )}
            </div>
          </div>

          {/* Total donated pill */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Donated</p>
            <p className="text-2xl font-extrabold text-rose-500 tracking-tight">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Mini Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Donations", value: data.length, icon: FiHeart, iconBg: "bg-rose-50", iconColor: "text-rose-500", accent: "border-l-rose-400", valColor: "text-gray-900" },
          { label: "Successful", value: successCount, icon: FiCheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-500", accent: "border-l-emerald-400", valColor: "text-emerald-600" },
          { label: "Pending", value: pendingCount, icon: FiClock, iconBg: "bg-amber-50", iconColor: "text-amber-500", accent: "border-l-amber-400", valColor: "text-amber-600" },
          { label: "Failed", value: failedCount, icon: FiXCircle, iconBg: "bg-red-50", iconColor: "text-red-400", accent: "border-l-red-300", valColor: "text-red-500" },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${c.accent} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col gap-3`}>
              <div className={`w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                <Icon size={15} className={c.iconColor} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
                <p className={`text-xl font-extrabold tracking-tight ${c.valColor}`}>{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Donation History Table ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
            <FiTrendingUp size={14} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Donation History</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{data.length} transactions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Campaign</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><FiCalendar size={10} /> Date</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {data.map((d: any, index: number) => (
                <tr key={d.id} className="hover:bg-gray-50/60 transition-colors duration-150">
                  {/* Campaign */}
                  <td className="px-6 py-4">
                    <span className="inline-block max-w-[200px] truncate text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {d.campaign?.title || "—"}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-extrabold text-gray-900 tracking-tight">
                      ₹{d.amount.toLocaleString("en-IN")}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">
            {data.length} transaction{data.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            Total:{" "}
            <span className="text-rose-500 font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
