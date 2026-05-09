
//more new design 

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDonorDonations } from "@/features/admin/api/admin.api";
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
  FiShoppingBag,
  FiDollarSign,
  FiX,
  FiHash,
  FiCreditCard,
  FiPackage,
  FiTag,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────
interface Product {
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

interface Donation {
  id: string;
  status: string;
  donorName: string;
  donorEmail: string;
  donorMobile?: string;
  paymentId: string;
  orderId: string;
  campaign: { id: number; title: string };
  amount: number;
  type: "PRODUCT" | "MONEY";
  createdAt: string;
  products: Product[];
}

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase();
  if (s === "SUCCESS" || s === "COMPLETED")
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
        <FiCheckCircle size={10} /> Success
      </span>
    );
  if (s === "PENDING")
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
        <FiClock size={10} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">
      <FiXCircle size={10} /> Failed
    </span>
  );
};

// ── Type Badge ────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: string }) => {
  if (type === "PRODUCT")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-100">
        <FiPackage size={9} /> Products
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-600 border border-sky-100">
      <FiDollarSign size={9} /> Money
    </span>
  );
};

// ── Donation Detail Modal ─────────────────────────────────────
const DonationModal = ({
  donation,
  onClose,
}: {
  donation: Donation;
  onClose: () => void;
}) => {
  const isProduct = donation.type === "PRODUCT";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-violet-400 to-indigo-400 shrink-0" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-4 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <StatusBadge status={donation.status} />
              <TypeBadge type={donation.type} />
            </div>
            <h2 className="text-base font-extrabold text-gray-900 truncate leading-tight">
              {donation.campaign.title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(donation.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <FiX size={14} />
            </button>
            {/* <p className="text-2xl font-black text-rose-500 tracking-tight">
              ₹{donation.amount.toLocaleString("en-IN")}
            </p> */}
          </div>
        </div>

        {/* Payment Meta */}
        <div className="px-6 py-4 bg-gray-50/60 border-b border-gray-100 grid grid-cols-2 gap-3 shrink-0">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center mt-0.5 shrink-0">
              <FiCreditCard size={12} className="text-gray-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment ID</p>
              <p className="text-xs font-semibold text-gray-700 truncate mt-0.5 font-mono">
                {donation.paymentId}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            {/* <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center mt-0.5 shrink-0">
              <FiHash size={12} className="text-gray-400" />
            </div> */}
            {/* <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
              <p className="text-xs font-semibold text-gray-700 truncate mt-0.5 font-mono">
                {donation.orderId}
              </p>
            </div> */}
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isProduct && donation.products.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <FiShoppingBag size={13} className="text-violet-500" />
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Donated Items ({donation.products.length})
                </p>
              </div>

              {donation.products.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3.5 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400">
                        ₹{p.price.toLocaleString("en-IN")} each
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">
                        <FiTag size={9} /> Qty: {p.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-extrabold text-gray-900">
                      ₹{p.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Products subtotal */}
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Value</p>
                <p className="text-lg font-black text-rose-500">
                  ₹{donation.amount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ) : (
            // Money donation UI
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200/60">
                <FiDollarSign size={28} className="text-white" />
              </div>
              <div>
                <p className="text-base font-extrabold text-gray-900">Monetary Donation</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  This donor made a direct monetary contribution to the campaign.
                </p>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl px-8 py-4 mt-2">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">Amount Donated</p>
                <p className="text-3xl font-black text-sky-600">
                  ₹{donation.amount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
export default function DonorDetailPage() {
  const params = useParams();
  const router = useRouter();
  console.log("PARAMS:", params); // 👈 must log
  const rawId = params.userid;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;
  const numericUserId = Number(userId);

  const [data, setData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    if (!numericUserId) return;
    (async () => {
      try {
        const res = await getDonorDonations(numericUserId);
        setData(res.data || []);
      } catch (err) {
        console.error("Donor fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [numericUserId]);

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 space-y-5">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-3 w-48 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-3 w-28 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-5 w-12 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-14 bg-gray-50 border-b border-gray-100 animate-pulse" />
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

  // ── Empty ─────────────────────────────────────────────────
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
  const successCount = data.filter((d) =>
    ["SUCCESS", "COMPLETED"].includes(d.status?.toUpperCase())
  ).length;
  const pendingCount = data.filter((d) => d.status?.toUpperCase() === "PENDING").length;
  const failedCount = data.filter((d) => d.status?.toUpperCase() === "FAILED").length;
  const productDonations = data.filter((d) => d.type === "PRODUCT").length;
  const moneyDonations = data.filter((d) => d.type === "MONEY").length;

  const initials = donor.donorName
    ? donor.donorName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-700 transition group"
        >
          <FiArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Donations
        </button>

        {/* ── Donor Profile Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-violet-400 to-indigo-300" />
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
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <FiMail size={12} />
                  {donor.donorEmail}
                </span>
                {donor.donorMobile && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <FiPhone size={12} />
                    {donor.donorMobile}
                  </span>
                )}
              </div>
              {/* Donation type breakdown */}
              <div className="flex items-center gap-2 mt-2.5">
                {productDonations > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">
                    <FiPackage size={9} /> {productDonations} Product{productDonations > 1 ? "s" : ""}
                  </span>
                )}
                {moneyDonations > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 rounded-full">
                    <FiDollarSign size={9} /> {moneyDonations} Monetary
                  </span>
                )}
              </div>
            </div>

            {/* Total donated */}
            <div className="shrink-0 flex flex-col items-end gap-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Donated
              </p>
              <p className="text-2xl font-extrabold text-rose-500 tracking-tight">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-gray-400">{data.length} transactions</p>
            </div>
          </div>
        </div>

        {/* ── Mini Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Total",
              value: data.length,
              icon: FiHeart,
              iconBg: "bg-rose-50",
              iconColor: "text-rose-500",
              accent: "border-l-rose-400",
              valColor: "text-gray-900",
            },
            {
              label: "Successful",
              value: successCount,
              icon: FiCheckCircle,
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-500",
              accent: "border-l-emerald-400",
              valColor: "text-emerald-600",
            },
            {
              label: "Pending",
              value: pendingCount,
              icon: FiClock,
              iconBg: "bg-amber-50",
              iconColor: "text-amber-500",
              accent: "border-l-amber-400",
              valColor: "text-amber-600",
            },
            {
              label: "Failed",
              value: failedCount,
              icon: FiXCircle,
              iconBg: "bg-red-50",
              iconColor: "text-red-400",
              accent: "border-l-red-300",
              valColor: "text-red-500",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${c.accent} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col gap-3`}
              >
                <div
                  className={`w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center`}
                >
                  <Icon size={15} className={c.iconColor} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {c.label}
                  </p>
                  <p className={`text-xl font-extrabold tracking-tight ${c.valColor}`}>
                    {c.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Donation History Table ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
              <FiTrendingUp size={14} className="text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">
                Donation History
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {data.length} transactions · Click any row to view details
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Campaign
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={10} /> Date
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {data.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDonation(d)}
                    className="cursor-pointer hover:bg-rose-50/40 transition-colors group"
                  >
                    {/* Campaign */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block max-w-[220px] truncate text-xs font-semibold text-gray-700 bg-gray-100 group-hover:bg-rose-100 group-hover:text-rose-700 px-2.5 py-1 rounded-lg transition-colors">
                          {d.campaign?.title || "—"}
                        </span>
                        <span className="text-[10px] text-gray-400 pl-0.5">
                          Campaign #{d.campaign?.id}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <TypeBadge type={d.type} />
                      {d.type === "PRODUCT" && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {d.products.length} item{d.products.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-extrabold text-gray-900">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={d.status} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-700 font-medium">
                          {new Date(d.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(d.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
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
              <span className="text-rose-500 font-bold">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedDonation && (
        <DonationModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </>
  );
}
