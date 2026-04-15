import Image from "next/image";
import Link from "next/link";
import { getCampaignById, getCampaigns } from "@/features/campaigns/api/campaign.api";
import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
import { FiMapPin, FiCalendar, FiArrowLeft, FiHeart, FiShare2, FiPackage } from "react-icons/fi";

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

function getProgress(raised: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

function getDaysLeft(endDate: string | null): number | null {
  if (!endDate) return null;
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function fmt(n: number) { return n.toLocaleString("en-US"); }
function fmtDate(d: string | null) {
  if (!d) return "Open-ended";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let campaign: Campaign | null = null;
  let related: Campaign[] = [];

  try {
    campaign = await getCampaignById(id);
  } catch {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-[72px] flex items-center justify-center">
        <p className="text-gray-500">Campaign not found.</p>
      </div>
    );
  }

  try {
    const all = await getCampaigns();
    related = all.campaigns.filter((c) => c.id !== campaign!.id).slice(0, 3);
  } catch { /* ok */ }

  if (!campaign) return null;

  const progress = getProgress(campaign.raisedAmount, campaign.goalAmount);
  const daysLeft = getDaysLeft(campaign.endDate);
  const products = campaign.campaignProducts || [];
  const donations = campaign.donations || [];
  const totalProductAmount = products.reduce((s, p) => s + p.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-[72px]">

      {/* ── Hero image ── */}
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] bg-gray-900 overflow-hidden">
        {isValidUrl(campaign.image) ? (
          <Image src={campaign.image!} alt={campaign.title} fill className="object-cover opacity-70" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-[#D2252B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              {campaign.status === "APPROVED" ? "Active" : campaign.status}
            </span>
            {campaign.cause?.name && (
              <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/30">
                {campaign.cause.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl">
            {campaign.title}
          </h1>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Details ── */}
          <div className="lg:col-span-2 space-y-8">

            <Link href="/campaigns" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition w-fit">
              <FiArrowLeft size={14} /> Back to Campaigns
            </Link>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Campaign</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {campaign.description}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  { label: "Location",   value: campaign.location || "—",          icon: <FiMapPin size={14} /> },
                  { label: "Start Date", value: fmtDate(campaign.startDate),        icon: <FiCalendar size={14} /> },
                  { label: "End Date",   value: fmtDate(campaign.endDate),          icon: <FiCalendar size={14} /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">{icon} {label}</div>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cause */}
            {campaign.cause && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Supporting Cause</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {isValidUrl(campaign.cause.image) ? (
                      <img src={campaign.cause.image!} alt={campaign.cause.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                        {campaign.cause.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{campaign.cause.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{campaign.cause.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Products needed */}
            {products.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <FiPackage size={18} className="text-[#D2252B]" />
                    <h2 className="text-lg font-bold text-gray-900">Products Needed</h2>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {products.length} item{products.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {products.map((p: CampaignProduct) => (
                    <div key={p.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        {isValidUrl(p.image) ? (
                          <img src={p.image!} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">₹{fmt(p.price)} × {p.quantity} units</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-sm">₹{fmt(p.totalAmount)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Products total */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-600">Total Products Value</span>
                  <span className="text-lg font-black text-[#D2252B]">₹{fmt(totalProductAmount)}</span>
                </div>
              </div>
            )}

            {/* Recent donations */}
            {donations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <FiHeart size={18} className="text-[#D2252B]" />
                    <h2 className="text-lg font-bold text-gray-900">Recent Donors</h2>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {donations.length} donation{donations.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {donations.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D2252B]/10 flex items-center justify-center text-[#D2252B] font-bold text-sm shrink-0">
                          {d.isAnonymous ? "?" : d.donorName?.charAt(0)?.toUpperCase() || "D"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {d.isAnonymous ? "Anonymous" : d.donorName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(d.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-sm">₹{fmt(d.amount)}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          d.status === "COMPLETED" ? "bg-green-50 text-green-600"
                          : d.status === "PENDING"  ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-500"
                        }`}>{d.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Progress card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Raised</p>
              <div className="flex items-end gap-2 mb-1">
                <p className="text-3xl font-black text-gray-900">₹{fmt(campaign.raisedAmount)}</p>
              </div>
              <p className="text-sm text-gray-400 mb-3">of ₹{fmt(campaign.goalAmount)} goal</p>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-3 bg-[#D2252B] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-5">
                <span className="font-bold text-[#D2252B]">{progress}% funded</span>
                {daysLeft !== null && (
                  <span className="flex items-center gap-1">
                    {daysLeft === 0 ? "Ending today" : `${daysLeft} days left`}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900">{donations.length}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Donors</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900">{products.length}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Products</p>
                </div>
              </div>

              <button className="w-full bg-[#D2252B] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-red-200">
                Donate Now
              </button>

              <button className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition">
                <FiShare2 size={14} /> Share Campaign
              </button>
            </div>

            {/* Cause mini card */}
            {campaign.cause && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Category</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {isValidUrl(campaign.cause.image) ? (
                      <img src={campaign.cause.image!} alt={campaign.cause.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#D2252B]/10 flex items-center justify-center text-[#D2252B] font-bold">
                        {campaign.cause.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{campaign.cause.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{campaign.cause.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Products summary */}
            {products.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Products Needed</p>
                <div className="space-y-2">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {isValidUrl(p.image) && <img src={p.image!} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-gray-700 truncate">{p.name}</span>
                        <span className="text-gray-400 text-xs shrink-0">×{p.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-800 shrink-0 ml-2">₹{fmt(p.totalAmount)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 text-sm font-bold">
                  <span className="text-gray-600">Total</span>
                  <span className="text-[#D2252B]">₹{fmt(totalProductAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related campaigns ── */}
      {related.length > 0 && (
        <div className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">More Campaigns</h2>
              <Link href="/campaigns" className="text-sm font-semibold text-[#D2252B] hover:underline flex items-center gap-1">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.id}`} className="group block bg-[#F5F5F5] rounded-2xl overflow-hidden hover:shadow-md transition">
                  <div className="relative h-36 overflow-hidden bg-gray-200">
                    {isValidUrl(c.image) && (
                      <Image src={c.image!} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[#D2252B] font-bold uppercase mb-1">{c.cause?.name}</p>
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#D2252B] transition">{c.title}</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>₹{fmt(c.raisedAmount)} raised</span>
                      <span>₹{fmt(c.goalAmount)} goal</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5">
                      <div className="h-1.5 bg-[#D2252B] rounded-full" style={{ width: `${getProgress(c.raisedAmount, c.goalAmount)}%` }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}