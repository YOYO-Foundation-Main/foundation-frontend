// import Image from "next/image";
// import Link from "next/link";
// import { getCampaigns } from "@/features/campaigns/api/campaign.api";
// import { Campaign } from "@/features/campaigns/types/campaign.types";
// import { FiMapPin, FiClock, FiArrowRight } from "react-icons/fi";
// import { isValidUrl } from "@/utils/url";

// // function isValidUrl(url: string | null | undefined): boolean {
// //   if (!url) return false;
// //   try { new URL(url); return true; } catch { return false; }
// // }

// function getProgress(raised: number, goal: number): number {
//   if (!goal) return 0;
//   return Math.min(Math.round((raised / goal) * 100), 100);
// }

// function getDaysLeft(endDate: string | null): number | null {
//   if (!endDate) return null;
//   const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
//   return Math.max(0, days);
// }

// export default async function CampaignListSection() {
//   let campaigns: Campaign[] = [];
//   try {
//     const data = await getCampaigns();
//     campaigns = data.campaigns;
//   } catch (err) {
//     console.error("❌ CampaignListSection error:", err);
//   }

//   return (
//     <section className="bg-[#f5f5f5] py-16 sm:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

//         {/* Header */}
//         <div className="text-center mb-12">
//           <p className="text-[#D2252B] text-xs font-bold tracking-[0.2em] uppercase mb-3">Make an Impact</p>
//           <h2 className="text-3xl sm:text-4xl font-bold text-black">
//             Join Our Campaigns
//           </h2>
//           <p className="text-gray-500 text-base mt-3 max-w-xl mx-auto">
//             Every donation counts. Browse active campaigns and be part of positive change.
//           </p>
//         </div>

//         {campaigns.length === 0 && (
//           <p className="text-center text-gray-500 py-10">No campaigns available</p>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//           {campaigns.map((item) => {
//             const progress = getProgress(item.raisedAmount, item.goalAmount);
//             const daysLeft = getDaysLeft(item.endDate);
//             const validImage = isValidUrl(item.image);
//             const donorCount = item.donations?.length ?? 0;
//             const productCount = item.campaignProducts?.length ?? 0;

//             return (
//               <Link key={item.id} href={`/campaigns/${item.id}`} className="block group">
//                 <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">

//                   {/* Image */}
//                   <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
//                     {validImage ? (
//                       <Image src={item.image || "/assets/placeholder.png"} alt={item.title} fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-300" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                         <span className="text-gray-400 text-sm">No Image</span>
//                       </div>
//                     )}

//                     {/* Cause badge */}
//                     <div className="absolute top-3 left-3">
//                       <span className="bg-white/90 backdrop-blur text-[#D2252B] text-[10px] font-bold px-2.5 py-1 rounded-full">
//                         {item.cause?.name || "General"}
//                       </span>
//                     </div>

//                     {/* Days left badge */}
//                     {daysLeft !== null && (
//                       <div className="absolute top-3 right-3">
//                         <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
//                           daysLeft <= 5 ? "bg-red-500 text-white" : "bg-black/60 text-white"
//                         }`}>
//                           {daysLeft === 0 ? "Ending today" : `${daysLeft}d left`}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-5 flex flex-col flex-1">
//                     <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#D2252B] transition-colors">
//                       {item.title}
//                     </h3>

//                     <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
//                       {item.description}
//                     </p>

//                     {/* Meta */}
//                     <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
//                       {item.location && (
//                         <span className="flex items-center gap-1">
//                           <FiMapPin size={11} /> {item.location}
//                         </span>
//                       )}
//                       {donorCount > 0 && (
//                         <span className="flex items-center gap-1">
//                           {donorCount} donor{donorCount !== 1 ? "s" : ""}
//                         </span>
//                       )}
//                       {productCount > 0 && (
//                         <span className="flex items-center gap-1">
//                           {productCount} product{productCount !== 1 ? "s" : ""}
//                         </span>
//                       )}
//                     </div>

//                     {/* Progress */}
//                     <div className="mb-4">
//                       <div className="flex justify-between text-xs font-medium mb-1.5">
//                         <span className="text-gray-700">₹{item.raisedAmount.toLocaleString("en-US")} raised</span>
//                         <span className="text-[#D2252B]">{progress}%</span>
//                       </div>
//                       <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                         <div className="h-2 bg-[#D2252B] rounded-full transition-all"
//                           style={{ width: `${progress}%` }} />
//                       </div>
//                       <p className="text-xs text-gray-400 mt-1">
//                         Goal: ₹{item.goalAmount.toLocaleString("en-US")}
//                       </p>
//                     </div>

//                     {/* CTA */}
//                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                       <span className="text-sm font-bold text-[#D2252B] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
//                         Donate Now <FiArrowRight size={14} />
//                       </span>
//                       <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
//                         item.status === "APPROVED" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
//                       }`}>
//                         {item.status === "APPROVED" ? "Active" : item.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* View all */}
//         <div className="text-center mt-10">
//           <Link href="/campaigns"
//             className="inline-flex items-center gap-2 border-2 border-black text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all">
//             View All Campaigns <FiArrowRight size={14} />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }



import Image from "next/image";
import Link from "next/link";
import { getCampaigns } from "@/features/campaigns/api/campaign.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";
import { FiMapPin, FiArrowRight, FiUsers, FiPackage, FiCheckCircle } from "react-icons/fi";
import { isValidUrl } from "@/utils/url";

function getProgress(raised: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

function getDaysLeft(endDate: string | null): number | null {
  if (!endDate) return null;
  const days = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, days);
}

/**
 * Progress color logic:
 * 0–25%   → gray (cold start, needs attention)
 * 26–50%  → amber/orange (gaining momentum)
 * 51–75%  → blue (on track)
 * 76–99%  → green (almost there!)
 * 100%    → emerald + special state (fully funded)
 */
function getProgressMeta(progress: number): {
  barColor: string;
  trackColor: string;
  textColor: string;
  label: string;
  labelColor: string;
  labelBg: string;
} {
  if (progress === 100) {
    return {
      barColor: "bg-emerald-500",
      trackColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      label: "Fully Funded 🎉",
      labelColor: "text-emerald-700",
      labelBg: "bg-emerald-50 border border-emerald-200",
    };
  }
  if (progress >= 76) {
    return {
      barColor: "bg-green-500",
      trackColor: "bg-green-100",
      textColor: "text-green-600",
      label: "Almost There!",
      labelColor: "text-green-700",
      labelBg: "bg-green-50 border border-green-200",
    };
  }
  if (progress >= 51) {
    return {
      barColor: "bg-blue-500",
      trackColor: "bg-blue-100",
      textColor: "text-blue-600",
      label: "On Track",
      labelColor: "text-blue-700",
      labelBg: "bg-blue-50 border border-blue-200",
    };
  }
  if (progress >= 26) {
    return {
      barColor: "bg-amber-500",
      trackColor: "bg-amber-100",
      textColor: "text-amber-600",
      label: "Gaining Momentum",
      labelColor: "text-amber-700",
      labelBg: "bg-amber-50 border border-amber-200",
    };
  }
  return {
    barColor: "bg-gray-400",
    trackColor: "bg-gray-200",
    textColor: "text-gray-500",
    label: "Just Started",
    labelColor: "text-gray-600",
    labelBg: "bg-gray-100 border border-gray-200",
  };
}

export default async function CampaignListSection() {
  let campaigns: Campaign[] = [];
  try {
    const data = await getCampaigns();
    campaigns = data.campaigns;
  } catch (err) {
    console.error("❌ CampaignListSection error:", err);
  }

  return (
    <section className="bg-[#f7f7f7] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#D2252B]/10 text-[#D2252B] text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
            Make an Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Join Our Campaigns
          </h2>
          <p className="text-gray-500 text-base mt-3 max-w-lg mx-auto leading-relaxed">
            Every donation counts. Browse active campaigns and be part of positive change.
          </p>
        </div>

        {/* ── Empty State ── */}
        {campaigns.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FiPackage size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-base">No campaigns available right now.</p>
          </div>
        )}

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {campaigns.map((item) => {
            const progress = getProgress(item.raisedAmount, item.goalAmount);
            const progressMeta = getProgressMeta(progress);
            const daysLeft = getDaysLeft(item.endDate ?? null);
            const validImage = isValidUrl(item.image);
            const donorCount = item.donations?.length ?? 0;
            const productCount = item.campaignProducts?.length ?? 0;
            const isFullyFunded = progress === 100;

            return (
              <Link
                key={item.id}
                href={`/campaigns/${item.id}`}
                className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D2252B] rounded-2xl"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">

                  {/* ── Image ── */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 flex-shrink-0">
                    {validImage ? (
                      <Image
                        src={item.image || "/assets/placeholder.png"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 gap-2">
                        <FiPackage size={28} className="text-gray-300" />
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}

                    {/* Subtle dark overlay on hover for readability */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {/* Cause badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-sm text-[#D2252B] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        {item.cause?.name || "General"}
                      </span>
                    </div>

                    {/* Days left badge — only if not fully funded */}
                    {!isFullyFunded && daysLeft !== null && (
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${
                            daysLeft === 0
                              ? "bg-red-500 text-white"
                              : daysLeft <= 5
                              ? "bg-orange-400 text-white"
                              : "bg-black/60 backdrop-blur-sm text-white"
                          }`}
                        >
                          {daysLeft === 0 ? "Ends Today" : `${daysLeft}d left`}
                        </span>
                      </div>
                    )}

                    {/* Fully funded overlay badge */}
                    {isFullyFunded && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                          <FiCheckCircle size={10} /> Funded
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Content ── */}
                  <div className="p-5 flex flex-col flex-1">

                    {/* Title */}
                    <h3 className="font-bold text-[15px] sm:text-base text-gray-900 mb-1.5 line-clamp-2 group-hover:text-[#D2252B] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Meta pills */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mb-4">
                      {item.location && (
                        <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                          <FiMapPin size={10} />
                          {item.location}
                        </span>
                      )}
                      {donorCount > 0 && (
                        <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                          <FiUsers size={10} />
                          {donorCount} donor{donorCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {productCount > 0 && (
                        <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                          <FiPackage size={10} />
                          {productCount} item{productCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* ── Progress ── */}
                    <div className="mb-5">
                      {/* Amount row */}
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[13px] font-bold text-gray-800">
                            ₹{item.raisedAmount.toLocaleString("en-IN")}
                            <span className="text-gray-400 font-normal text-[11px] ml-1">raised</span>
                          </p>
                          <p className="text-[11px] text-gray-400">
                            of ₹{item.goalAmount.toLocaleString("en-IN")} goal
                          </p>
                        </div>
                        {/* Dynamic progress % label */}
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${progressMeta.labelBg} ${progressMeta.labelColor}`}>
                          {isFullyFunded ? progressMeta.label : `${progress}% · ${progressMeta.label}`}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${progressMeta.trackColor}`}>
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${progressMeta.barColor}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* ── CTA Footer ── */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                      <span className="text-sm font-bold text-[#D2252B] flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                        {isFullyFunded ? "View Campaign" : "Donate Now"}
                        <FiArrowRight size={14} />
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          item.status === "APPROVED"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {item.status === "APPROVED" ? "● Active" : item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── View All CTA ── */}
        {campaigns.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2.5 bg-white border-2 border-gray-900 text-gray-900 px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-900 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View All Campaigns
              <FiArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
