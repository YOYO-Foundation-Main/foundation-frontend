
//new ui user detail page

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminGetUserById } from "@/features/admin/api/admin.api";

type DonationItem = {
  id: number;
  quantity: number;
  price: number;
  totalAmount: number;
  campaignProduct: {
    name: string;
    image: string;
  };
};

type Donation = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  isAnonymous: boolean;
  donorName: string;
  campaign: {
    title: string;
    image?: string;
    location?: string;
    cause?: { name: string };
  };
  donationItems: DonationItem[];
};

const CAUSE_COLORS = [
  { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", border: "border-emerald-200", dot: "bg-emerald-400" },
  { bg: "bg-sky-50", text: "text-sky-700", bar: "bg-sky-500", border: "border-sky-200", dot: "bg-sky-400" },
  { bg: "bg-violet-50", text: "text-violet-700", bar: "bg-violet-500", border: "border-violet-200", dot: "bg-violet-400" },
  { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500", border: "border-amber-200", dot: "bg-amber-400" },
  { bg: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-500", border: "border-rose-200", dot: "bg-rose-400" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [expandedDonation, setExpandedDonation] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await adminGetUserById(userId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading user profile...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">User not found</p>
      </div>
    );

  const { user, summary, campaignBreakdown, donations } = data;

  const maxDonated = Math.max(...campaignBreakdown.map((c: any) => c.totalDonated), 1);

  const moneyCount = summary.donationTypeSplit?.money ?? 0;
  const productCount = summary.donationTypeSplit?.product ?? 0;
  const totalTypeSplit = moneyCount + productCount || 1;
  const moneyPct = Math.round((moneyCount / totalTypeSplit) * 100);
  const productPct = 100 - moneyPct;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 px-6 pt-6 pb-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-indigo-100 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30 shadow-lg">
            {getInitials(user.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-indigo-200 text-sm mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                Active Donor
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
                ID #{user.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 pb-10 space-y-6">
        {/* STAT CARDS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard
            icon="💰"
            title="Total Donated"
            value={`₹${formatCurrency(summary.totalDonated)}`}
            accent="indigo"
          />
          <StatCard
            icon="🎯"
            title="Donations"
            value={summary.totalDonations}
            accent="violet"
          />
          <StatCard
            icon="📊"
            title="Avg Donation"
            value={`₹${formatCurrency(summary.avgDonation)}`}
            accent="sky"
          />
          <StatCard
            icon="📅"
            title="Last Donation"
            value={
              summary.lastDonation
                ? new Date(summary.lastDonation).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
            accent="emerald"
          />
          <StatCard
            icon="❤️"
            title="Fav. Cause"
            value={summary.favoriteCause || "—"}
            accent="rose"
            small
          />
          <StatCard
            icon="✨"
            title="Lives Impacted"
            value={summary.livesImpacted || "—"}
            accent="amber"
          />
        </div>

        {/* DONATION TYPE SPLIT */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Donation Type Split</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="h-full bg-sky-500 rounded-l-full transition-all duration-500"
                style={{ width: `${moneyPct}%` }}
              />
              <div
                className="h-full bg-violet-500 rounded-r-full transition-all duration-500"
                style={{ width: `${productPct}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-medium shrink-0">
              <span className="flex items-center gap-1.5 text-sky-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                Money ({moneyPct}%)
              </span>
              <span className="flex items-center gap-1.5 text-violet-600">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                Product ({productPct}%)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 text-lg">💵</div>
              <div>
                <p className="text-xs text-sky-600 font-medium">Money Donations</p>
                <p className="text-lg font-bold text-sky-700">{moneyCount}</p>
              </div>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-lg">📦</div>
              <div>
                <p className="text-xs text-violet-600 font-medium">Product Donations</p>
                <p className="text-lg font-bold text-violet-700">{productCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* CAMPAIGN BREAKDOWN */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-700">Campaign Breakdown</h2>
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                {campaignBreakdown.length} campaigns
              </span>
            </div>

            {campaignBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400">No data available</p>
            ) : (
              <div className="space-y-4">
                {campaignBreakdown.map((c: any, i: number) => {
                  const color = CAUSE_COLORS[i % CAUSE_COLORS.length];
                  const pct = Math.round((c.totalDonated / maxDonated) * 100);
                  return (
                    <div key={i} className={`rounded-xl border ${color.border} ${color.bg} p-3.5`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2">
                          <span className={`w-2 h-2 rounded-full ${color.dot} mt-1.5 shrink-0`} />
                          <p className={`text-sm font-semibold ${color.text} leading-snug`}>{c.campaign}</p>
                        </div>
                        <p className={`text-sm font-bold ${color.text} shrink-0`}>₹{formatCurrency(c.totalDonated)}</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/60 overflow-hidden mb-1.5">
                        <div
                          className={`h-full rounded-full ${color.bar} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className={`text-xs ${color.text} opacity-70`}>{c.donations} donation{c.donations > 1 ? "s" : ""}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DONATION HISTORY */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-700">Donation History</h2>
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                {donations.length} records
              </span>
            </div>

            {donations.length === 0 ? (
              <p className="text-sm text-slate-400">No donations found</p>
            ) : (
              <div className="space-y-3">
                {donations.map((d: Donation) => {
                  const isProduct = d.donationItems?.length > 0;
                  const isExpanded = expandedDonation === d.id;

                  return (
                    <div
                      key={d.id}
                      className="border border-slate-100 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                    >
                      {/* ROW */}
                      <button
                        onClick={() => setExpandedDonation(isExpanded ? null : d.id)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3"
                      >
                        {/* Campaign image or icon */}
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {d.campaign?.image ? (
                            <img
                              src={d.campaign.image}
                              alt={d.campaign.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">🏕</div>
                          )}
                        </div>

                        {/* Campaign title + date */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{d.campaign?.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(d.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                            {d.isAnonymous && (
                              <span className="ml-2 text-slate-400 italic">· Anonymous</span>
                            )}
                          </p>
                        </div>

                        {/* Amount */}
                        <p className="text-sm font-bold text-slate-800 shrink-0">₹{formatCurrency(d.amount)}</p>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              isProduct
                                ? "bg-violet-100 text-violet-700"
                                : "bg-sky-100 text-sky-700"
                            }`}
                          >
                            {isProduct ? "Product" : "Money"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              d.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {d.status}
                          </span>
                        </div>

                        {/* Expand arrow (only if product) */}
                        {isProduct && (
                          <svg
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>

                      {/* EXPANDED: donation items */}
                      {isProduct && isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Items Donated
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {d.donationItems.map((item) => (
                              <div
                                key={item.id}
                                className="bg-white border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5"
                              >
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                  {item.campaignProduct?.image ? (
                                    <img
                                      src={item.campaignProduct.image}
                                      alt={item.campaignProduct.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">📦</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-slate-700 truncate">
                                    {item.campaignProduct?.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    Qty: {item.quantity} × ₹{formatCurrency(item.price)}
                                  </p>
                                </div>
                                <p className="text-xs font-bold text-indigo-600 shrink-0">
                                  ₹{formatCurrency(item.totalAmount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= STAT CARD =================
const accentMap: Record<string, { card: string; icon: string; value: string }> = {
  indigo: { card: "bg-white border-indigo-100", icon: "bg-indigo-50 text-indigo-500", value: "text-indigo-700" },
  violet: { card: "bg-white border-violet-100", icon: "bg-violet-50 text-violet-500", value: "text-violet-700" },
  sky: { card: "bg-white border-sky-100", icon: "bg-sky-50 text-sky-500", value: "text-sky-700" },
  emerald: { card: "bg-white border-emerald-100", icon: "bg-emerald-50 text-emerald-500", value: "text-emerald-700" },
  rose: { card: "bg-white border-rose-100", icon: "bg-rose-50 text-rose-500", value: "text-rose-700" },
  amber: { card: "bg-white border-amber-100", icon: "bg-amber-50 text-amber-500", value: "text-amber-700" },
};

function StatCard({
  title,
  value,
  icon,
  accent = "indigo",
  small = false,
}: {
  title: string;
  value: any;
  icon: string;
  accent?: string;
  small?: boolean;
}) {
  const colors = accentMap[accent] ?? accentMap.indigo;
  return (
    <div className={`${colors.card} border rounded-2xl p-4 shadow-sm`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3 ${colors.icon}`}>
        {icon}
      </div>
      <p className="text-xs text-slate-400 font-medium mb-1">{title}</p>
      <p className={`font-bold leading-tight ${small ? "text-sm" : "text-lg"} ${colors.value}`}>
        {value}
      </p>
    </div>
  );
}
