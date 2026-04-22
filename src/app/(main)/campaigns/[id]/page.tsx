// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { isValidUrl } from "@/utils/url";
// import Link from "next/link";
// import { getCampaignById } from "@/features/campaigns/api/campaign.api";
// import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
// import { FiArrowLeft, FiMapPin, FiCalendar } from "react-icons/fi";

// function fmt(n: number) {
//   return n.toLocaleString("en-US");
// }

// function getProgress(raised: number, goal: number) {
//   if (!goal) return 0;
//   return Math.min((raised / goal) * 100, 100);
// }

// export default function CampaignDetailPage() {
//   const params = useParams();
//   const id = params?.id as string;

//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});
//   const [donationAmount, setDonationAmount] = useState<number>(0);
//   const [mode, setMode] = useState<"products" | "money">("products");
//   const router = useRouter();
//   useEffect(() => {
//     if (!id) return;

//     const fetchData = async () => {
//       try {
//         const data = await getCampaignById(id);
//         setCampaign(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!campaign) return <div className="p-10">Loading...</div>;

//   const products = campaign.campaignProducts || [];
//   const progress = getProgress(campaign.raisedAmount || 0, campaign.goalAmount || 1);

//   const increaseQty = (productId: number, max: number) => {
//     setSelectedProducts((prev) => {
//       const current = prev[productId] || 0;
//       if (current >= max) return prev;
//       return { ...prev, [productId]: current + 1 };
//     });
//   };

//   const decreaseQty = (productId: number) => {
//     setSelectedProducts((prev) => {
//       const newQty = (prev[productId] || 0) - 1;
//       if (newQty <= 0) {
//         const updated = { ...prev };
//         delete updated[productId];
//         return updated;
//       }
//       return { ...prev, [productId]: newQty };
//     });
//   };

//   const selectedProductDetails = Object.entries(selectedProducts).map(
//     ([id, qty]) => {
//       const product = products.find(p => p.id === Number(id));
//       return {
//         campaignProductId: product?.id,
//         name: product?.name,
//         image: product?.image,
//         price: product?.price,
//         quantity: qty,
//       };
//     }
//   );
//   return (
//     <div className="bg-[#F7F7F7] min-h-screen py-10">

//       <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

//         {/* ================= LEFT SIDE ================= */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mt-28 lg:mt-18 h-fit sticky top-[110px]">

//           {/* <Link href="/campaigns" className="text-gray-500 flex items-center gap-2">
//             <FiArrowLeft /> Back
//           </Link> */}

//           {/* IMAGE */}
//           <div className="w-full h-[300px] relative rounded-2xl overflow-hidden shadow">
//             <Image
//               src={
//                 campaign.image && isValidUrl(campaign.image)
//                   ? campaign.image
//                   : "/assets/placeholder.png"
//               }
//               alt="campaign"
//               fill
//               className="object-cover"
//             />
//           </div>

//           {/* DETAILS */}
//           <div className="bg-white p-6 rounded-2xl shadow space-y-4">

//             <h1 className="text-2xl font-bold">{campaign.title}</h1>

//             {/* META */}
//             <div className="flex gap-6 text-sm text-gray-500">
//               <span className="flex items-center gap-1">
//                 <FiMapPin /> {campaign.location || "Unknown"}
//               </span>
//               <span className="flex items-center gap-1">
//                 <FiCalendar /> {campaign.createdAt?.slice(0, 10)}
//               </span>
//             </div>

//             {/* PROGRESS */}
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>₹{fmt(campaign.raisedAmount || 0)} raised</span>
//                 <span>{Math.round(progress)}%</span>
//               </div>
//               <div className="w-full h-2 bg-gray-200 rounded-full">
//                 <div
//                   className="h-2 bg-[#D2252B] rounded-full"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>

//             {/* DESCRIPTION */}
//             <p className="text-gray-600 text-sm leading-relaxed">
//               {campaign.description}
//             </p>
//           </div>
//         </div>

//         {/* ================= RIGHT SIDE ================= */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mt-28 lg:mt-18 h-fit sticky top-[110px]">

//           {/* SWITCH */}
//           <div className="flex bg-[#F3F3F3] rounded-xl p-1 mb-6">
//             <button
//               onClick={() => setMode("products")}
//               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === "products"
//                 ? "bg-[#D2252B] text-white"
//                 : "text-gray-500"
//                 }`}
//             >
//               Donate Products
//             </button>

//             <button
//               onClick={() => setMode("money")}
//               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === "money"
//                 ? "bg-[#D2252B] text-white"
//                 : "text-gray-500"
//                 }`}
//             >
//               Donate Money
//             </button>
//           </div>

//           {/* ================= PRODUCTS MODE ================= */}
//           {mode === "products" && (
//             <div>

//               {/* GRID */}
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

//                 {products.map((p: CampaignProduct) => {
//                   const qty = selectedProducts[p.id] || 0;

//                   return (
//                     <div
//                       key={p.id}
//                       className="bg-[#FAFAFA] rounded-2xl p-3 transition transform hover:-translate-y-1 hover:shadow-md"
//                     >
//                       {/* IMAGE */}
//                       <div className="w-full h-24 relative mb-3">
//                         <Image
//                           src={
//                             p.image && isValidUrl(p.image)
//                               ? p.image
//                               : "/assets/placeholder.png"
//                           }
//                           alt={p.name}
//                           fill
//                           className="object-contain"
//                         />
//                       </div>

//                       {/* NAME */}
//                       <p className="text-sm font-semibold mb-1 line-clamp-1">
//                         {p.name}
//                       </p>

//                       {/* REQUIRED */}
//                       <p className="text-xs text-gray-500 mb-1">
//                         {p.quantity} Qty needed
//                       </p>

//                       {/* PROGRESS BAR */}
//                       {/* <div className="w-full h-[4px] bg-gray-200 rounded-full mb-2">
//                         <div className="h-[4px] bg-[#FF4D2D] rounded-full w-[20%]" />
//                       </div> */}

//                       {/* PRICE */}
//                       <p className="text-sm font-semibold mb-3">
//                         ₹{p.price}
//                         <span className="text-xs text-gray-400"> /unit</span>
//                       </p>

//                       {/* ADD / COUNTER */}
//                       {qty === 0 ? (
//                         <button
//                           onClick={() => increaseQty(p.id, p.quantity)}
//                           className="w-full border border-[#D2252B] text-[#D2252B] py-1.5 rounded-lg text-sm font-semibold hover:bg-[#D2252B] hover:text-white transition"
//                         >
//                           Add
//                         </button>
//                       ) : (
//                         <div className="flex items-center justify-between bg-[#D2252B] text-white rounded-lg px-2 py-1">
//                           <button onClick={() => decreaseQty(p.id)}>-</button>
//                           <span>{qty}</span>
//                           <button onClick={() => increaseQty(p.id, p.quantity)}>+</button>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* DONATE BAR */}
//               <div className="mt-8 border-t pt-4">

//                 {/* <div className="text-xs text-gray-500 mb-3 text-center">
//                   ₹500 Donated by someone 15 mins ago
//                 </div> */}

//                 <button
//                   onClick={() => {
//                     if (Object.keys(selectedProducts).length === 0) {
//                       alert("Please select at least one product");
//                       return;
//                     }

//                     // ✅ store data
//                     localStorage.setItem(
//                       "donationData",
//                       JSON.stringify({
//                         campaignId: campaign.id,
//                         selectedProductDetails,
//                         donationAmount: 0, // important
//                         mode: "products",
//                       })
//                     );

//                     // ✅ navigate (ALSO FIXED LOWERCASE)
//                     router.push(`/Donate/${campaign.id}/Checkout?mode=products`);
//                   }}
//                   className="w-full bg-[#D2252B] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
//                 >
//                   DONATE NOW (₹
//                   {Object.entries(selectedProducts).reduce((sum, [id, qty]) => {
//                     const product = products.find(p => p.id === Number(id));
//                     return product ? sum + product.price * qty : sum;
//                   }, 0)}
//                   )
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ================= MONEY MODE ================= */}
//           {mode === "money" && (
//             <div>

//               {/* TABLE */}
//               <div className="space-y-3 text-sm mb-6">

//                 {/* HEADER */}
//                 <div className="grid grid-cols-3 font-semibold text-gray-700 border-b pb-2">
//                   <span>Materials</span>
//                   <span className="text-center">Required Qty</span>
//                   <span className="text-right">Price/Unit</span>
//                 </div>

//                 {/* ROWS */}
//                 {products.map((p: CampaignProduct) => (
//                   <div
//                     key={p.id}
//                     className="grid grid-cols-3 items-center text-gray-600 py-1"
//                   >
//                     {/* NAME */}
//                     <span className="truncate">{p.name}</span>

//                     {/* QUANTITY */}
//                     <span className="text-center">{p.quantity}</span>

//                     {/* PRICE */}
//                     <span className="text-right font-medium">₹{p.price}</span>
//                   </div>
//                 ))}

//               </div>

//               {/* GOAL */}
//               <div className="bg-[#F4F7FB] rounded-xl p-4 mb-5">
//                 <div className="flex justify-between font-semibold">
//                   <span>Total Goal</span>
//                   <span>₹{fmt(campaign.goalAmount || 0)}</span>
//                 </div>
//               </div>

//               {/* QUICK AMOUNT */}
//               <div className="grid grid-cols-3 gap-3 mb-4">
//                 {[1800, 2500, 4000].map((amt) => (
//                   <button
//                     key={amt}
//                     onClick={() => setDonationAmount(amt)}
//                     className={`py-2 rounded-lg border text-sm ${donationAmount === amt
//                       ? "border-[#D2252B] text-[#FF4D2D]"
//                       : "text-gray-500"
//                       }`}
//                   >
//                     ₹{amt}
//                   </button>
//                 ))}
//               </div>

//               {/* INPUT */}
//               <input
//                 type="number"
//                 placeholder="Enter Amount"
//                 className="w-full border p-3 rounded-lg mb-5"
//                 value={donationAmount || ""}
//                 onChange={(e) => setDonationAmount(Number(e.target.value))}
//               />

//               {/* DONATE BAR */}
//               <div className="border-t pt-4">

//                 {/* <div className="text-xs text-gray-500 mb-3 text-center">
//                   ₹2,500 Donated by Radhika 5 hours ago
//                 </div> */}

//                 <button
//                   onClick={() => {
//                     // ✅ prevent empty donation
//                     // if (mode === "products" && Object.keys(selectedProducts).length === 0) {
//                     //   alert("Please select at least one product");
//                     //   return;
//                     // }

//                     if (mode === "money" && donationAmount <= 0) {
//                       alert("Please enter donation amount");
//                       return;
//                     }

//                     // ✅ store data
//                     localStorage.setItem(
//                       "donationData",
//                       JSON.stringify({
//                         campaignId: campaign.id,
//                         selectedProductDetails,
//                         donationAmount,
//                         mode,
//                       })
//                     );

//                     // ✅ navigate
//                     router.push(`/Donate/${campaign.id}/Checkout?mode=${mode}`);
//                   }}
//                   className="w-full bg-[#D2252B] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
//                 >
//                   DONATE NOW (
//                   ₹
//                  {donationAmount}
//                   )
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


//new detail page 

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { isValidUrl } from "@/utils/url";
import Link from "next/link";
import { getCampaignById } from "@/features/campaigns/api/campaign.api";
import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
import {
  FiArrowLeft, FiMapPin, FiCalendar, FiUsers,
  FiPackage, FiTrendingUp, FiClock, FiCheckCircle,
} from "react-icons/fi";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

function getProgress(raised: number, goal: number) {
  if (!goal) return 0;
  return Math.min((raised / goal) * 100, 100);
}

function getDaysLeft(endDate?: string | null): number | null {
  if (!endDate) return null;
  const days = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, days);
}

/**
 * 0–25%   → gray   · Just Started
 * 26–50%  → amber  · Gaining Momentum
 * 51–75%  → blue   · On Track
 * 76–99%  → green  · Almost There!
 * 100%    → emerald· Fully Funded
 */
function getProgressMeta(p: number) {
  if (p === 100) return { bar: "bg-emerald-500", track: "bg-emerald-100", text: "text-emerald-600", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "Fully Funded 🎉" };
  if (p >= 76)   return { bar: "bg-green-500",   track: "bg-green-100",   text: "text-green-600",   badge: "bg-green-50 border-green-200 text-green-700",     label: "Almost There!" };
  if (p >= 51)   return { bar: "bg-blue-500",    track: "bg-blue-100",    text: "text-blue-600",    badge: "bg-blue-50 border-blue-200 text-blue-700",         label: "On Track" };
  if (p >= 26)   return { bar: "bg-amber-500",   track: "bg-amber-100",   text: "text-amber-600",   badge: "bg-amber-50 border-amber-200 text-amber-700",      label: "Gaining Momentum" };
  return           { bar: "bg-gray-400",    track: "bg-gray-200",    text: "text-gray-500",    badge: "bg-gray-100 border-gray-200 text-gray-600",        label: "Just Started" };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [mode, setMode] = useState<"products" | "money">("products");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const data = await getCampaignById(id);
        setCampaign(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  // ── Loading ──
  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 border-4 border-[#D2252B]/20 border-t-[#D2252B] rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading campaign...</p>
        </div>
      </div>
    );
  }

  // ── Derived values ──
  const products = campaign.campaignProducts || [];
  const donations = campaign.donations || [];
  const progress = getProgress(campaign.raisedAmount || 0, campaign.goalAmount || 1);
  const progressMeta = getProgressMeta(Math.round(progress));
  const daysLeft = getDaysLeft(campaign.endDate);
  const isFullyFunded = Math.round(progress) === 100;
  const donorCount = donations.length;

  // ── Product qty handlers (logic unchanged) ──
  const increaseQty = (productId: number, max: number) => {
    setSelectedProducts((prev) => {
      const current = prev[productId] || 0;
      if (current >= max) return prev;
      return { ...prev, [productId]: current + 1 };
    });
  };

  const decreaseQty = (productId: number) => {
    setSelectedProducts((prev) => {
      const newQty = (prev[productId] || 0) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  // ── selectedProductDetails (logic unchanged) ──
  const selectedProductDetails = Object.entries(selectedProducts).map(([pid, qty]) => {
    const product = products.find((p) => p.id === Number(pid));
    return {
      campaignProductId: product?.id,
      name: product?.name,
      image: product?.image,
      price: product?.price,
      quantity: qty,
    };
  });

  // ── Totals ──
  const productDonationTotal = Object.entries(selectedProducts).reduce((sum, [pid, qty]) => {
    const product = products.find((p) => p.id === Number(pid));
    return product ? sum + product.price * qty : sum;
  }, 0);
  const selectedCount = Object.values(selectedProducts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">

        {/* Back */}
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors group"
        >
          <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Campaigns
        </Link>

        {/* ── Two-column grid ── */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ══════════════════════ LEFT ══════════════════════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-[110px]">

            {/* Hero Image */}
            <div className="relative w-full h-[260px] sm:h-[320px]">
              <Image
                src={
                  campaign.image && isValidUrl(campaign.image)
                    ? campaign.image
                    : "/assets/placeholder.png"
                }
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient for badge readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Cause pill */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-[#D2252B] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {campaign.cause?.name || "General"}
                </span>
              </div>

              {/* Bottom badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${progressMeta.badge}`}>
                  {progressMeta.label}
                </span>
                {!isFullyFunded && daysLeft !== null && (
                  <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full ${
                    daysLeft <= 5 ? "bg-red-500 text-white" : "bg-black/60 backdrop-blur-sm text-white"
                  }`}>
                    <FiClock size={11} />
                    {daysLeft === 0 ? "Ends Today" : `${daysLeft} days left`}
                  </span>
                )}
                {isFullyFunded && (
                  <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                    <FiCheckCircle size={11} /> Fully Funded
                  </span>
                )}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="p-6 space-y-5">

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {campaign.title}
              </h1>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                {campaign.location && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <FiMapPin size={11} /> {campaign.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                  <FiCalendar size={11} />
                  Started {campaign.startDate?.slice(0, 10) ?? campaign.createdAt?.slice(0, 10)}
                </span>
                {donorCount > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <FiUsers size={11} /> {donorCount} donor{donorCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* ── Progress ── */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-gray-900">
                      ₹{fmt(campaign.raisedAmount || 0)}
                      <span className="text-sm font-normal text-gray-400 ml-1.5">raised</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      of ₹{fmt(campaign.goalAmount || 0)} goal
                    </p>
                  </div>
                  <p className={`text-2xl font-black ${progressMeta.text}`}>
                    {Math.round(progress)}%
                  </p>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${progressMeta.track}`}>
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ease-out ${progressMeta.bar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <FiUsers size={15} />, value: donorCount, label: "Donors", colored: false },
                  { icon: <FiPackage size={15} />, value: products.length, label: "Items", colored: false },
                  { icon: <FiTrendingUp size={15} />, value: `${Math.round(progress)}%`, label: "Funded", colored: true },
                ].map(({ icon, value, label, colored }) => (
                  <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <div className={`flex justify-center mb-1 ${colored ? progressMeta.text : "text-gray-400"}`}>{icon}</div>
                    <p className={`text-sm font-extrabold ${colored ? progressMeta.text : "text-gray-800"}`}>{value}</p>
                    <p className="text-[11px] text-gray-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  About this Campaign
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{campaign.description}</p>
              </div>

              {/* Recent Donors */}
              {donations.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Recent Donors
                  </p>
                  <div className="space-y-2.5">
                    {donations.slice(0, 3).map((d) => (
                      <div key={d.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#D2252B]/10 flex items-center justify-center text-[#D2252B] text-xs font-extrabold flex-shrink-0">
                            {d.isAnonymous ? "?" : (d.donorName?.charAt(0)?.toUpperCase() || "D")}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 leading-tight">
                              {d.isAnonymous ? "Anonymous" : d.donorName}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(d.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short",
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-800">₹{fmt(d.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════ RIGHT ══════════════════════ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-[110px]">

            {/* Panel header */}
            <div className="bg-gradient-to-r from-[#D2252B] to-[#e84040] px-6 py-4">
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                Make a Difference
              </p>
              <p className="text-white text-lg font-extrabold">Donate to this Campaign</p>
            </div>

            <div className="p-5">

              {/* ── Mode Toggle ── */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
                {(["products", "money"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                      mode === m
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m === "products" ? "🎁 Products" : "💸 Money"}
                  </button>
                ))}
              </div>

              {/* ════════════ PRODUCTS MODE ════════════ */}
              {mode === "products" && (
                <div>
                  {products.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      <FiPackage size={32} className="mx-auto mb-2 opacity-30" />
                      No products listed for this campaign.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {products.map((p: CampaignProduct) => {
                        const qty = selectedProducts[p.id] || 0;
                        const outOfStock = p.quantity === 0;

                        return (
                          <div
                            key={p.id}
                            className={`rounded-xl border p-3 flex flex-col transition-all duration-200 ${
                              qty > 0
                                ? "border-[#D2252B]/40 bg-[#D2252B]/[0.03] shadow-sm"
                                : outOfStock
                                ? "border-gray-100 bg-gray-50 opacity-60"
                                : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:shadow-sm"
                            }`}
                          >
                            {/* Image */}
                            <div className="relative w-full h-20 mb-2 rounded-lg overflow-hidden bg-white">
                              <Image
                                src={p.image && isValidUrl(p.image) ? p.image : "/assets/placeholder.png"}
                                alt={p.name}
                                fill
                                className="object-contain p-1"
                              />
                              {outOfStock && (
                                <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                    Fulfilled
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Name */}
                            <p className="text-xs font-bold text-gray-800 line-clamp-1 mb-0.5">{p.name}</p>

                            {/* Qty needed */}
                            {!outOfStock && (
                              <p className="text-[10px] text-gray-400 mb-1">{p.quantity} needed</p>
                            )}

                            {/* Price */}
                            <p className="text-sm font-black text-gray-900 mb-2.5">
                              ₹{p.price}
                              <span className="text-[10px] text-gray-400 font-normal"> /unit</span>
                            </p>

                            {/* Add / Counter / Fulfilled */}
                            {outOfStock ? (
                              <div className="flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold py-1.5 rounded-lg">
                                <FiCheckCircle size={10} /> Done
                              </div>
                            ) : qty === 0 ? (
                              <button
                                onClick={() => increaseQty(p.id, p.quantity)}
                                className="w-full border-2 border-[#D2252B] text-[#D2252B] py-1.5 rounded-lg text-xs font-bold hover:bg-[#D2252B] hover:text-white transition-all"
                              >
                                + Add
                              </button>
                            ) : (
                              <div className="flex items-center justify-between bg-[#D2252B] text-white rounded-lg px-2 py-1.5">
                                <button
                                  onClick={() => decreaseQty(p.id)}
                                  className="w-6 h-6 flex items-center justify-center font-bold hover:bg-white/20 rounded-md transition"
                                >
                                  −
                                </button>
                                <span className="text-sm font-black">{qty}</span>
                                <button
                                  onClick={() => increaseQty(p.id, p.quantity)}
                                  className="w-6 h-6 flex items-center justify-center font-bold hover:bg-white/20 rounded-md transition"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Summary + CTA */}
                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                    {selectedCount > 0 && (
                      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">
                          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                        </span>
                        <span className="font-extrabold text-gray-900">₹{fmt(productDonationTotal)}</span>
                      </div>
                    )}

                    {/* ✅ Original logic untouched */}
                    <button
                      onClick={() => {
                        if (Object.keys(selectedProducts).length === 0) {
                          alert("Please select at least one product");
                          return;
                        }
                        localStorage.setItem(
                          "donationData",
                          JSON.stringify({
                            campaignId: campaign.id,
                            selectedProductDetails,
                            donationAmount: 0,
                            mode: "products",
                          })
                        );
                        router.push(`/Donate/${campaign.id}/Checkout?mode=products`);
                      }}
                      disabled={selectedCount === 0}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200 ${
                        selectedCount > 0
                          ? "bg-[#D2252B] text-white hover:bg-[#b51e23] shadow-md hover:shadow-lg active:scale-[0.98]"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {selectedCount > 0
                        ? `Donate ₹${fmt(productDonationTotal)}`
                        : "Select items to donate"}
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════ MONEY MODE ════════════ */}
              {mode === "money" && (
                <div className="space-y-4">

                  {/* Products reference table */}
                  {products.length > 0 && (
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="grid grid-cols-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <span>Item</span>
                        <span className="text-center">Qty Needed</span>
                        <span className="text-right">Price/Unit</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {products.map((p: CampaignProduct) => (
                          <div key={p.id} className="grid grid-cols-3 items-center px-4 py-2.5 text-sm">
                            <span className="text-gray-700 truncate">{p.name}</span>
                            <span className="text-center text-gray-500">{p.quantity}</span>
                            <span className="text-right font-semibold text-gray-800">₹{p.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm font-extrabold text-gray-800">
                        <span className="col-span-2">Total Goal</span>
                        <span className="text-right">₹{fmt(campaign.goalAmount || 0)}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick amounts */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Quick Select</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[1800, 2500, 4000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setDonationAmount(amt)}
                          className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                            donationAmount === amt
                              ? "border-[#D2252B] bg-[#D2252B]/5 text-[#D2252B]"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          ₹{fmt(amt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom input */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Or enter amount</p>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border-2 border-gray-200 focus:border-[#D2252B] outline-none pl-8 pr-4 py-3 rounded-xl text-sm font-bold transition-colors"
                        value={donationAmount || ""}
                        onChange={(e) => setDonationAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* ✅ Original logic untouched */}
                  <button
                    onClick={() => {
                      if (mode === "money" && donationAmount <= 0) {
                        alert("Please enter donation amount");
                        return;
                      }
                      localStorage.setItem(
                        "donationData",
                        JSON.stringify({
                          campaignId: campaign.id,
                          selectedProductDetails,
                          donationAmount,
                          mode,
                        })
                      );
                      router.push(`/Donate/${campaign.id}/Checkout?mode=${mode}`);
                    }}
                    disabled={!donationAmount || donationAmount <= 0}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200 ${
                      donationAmount > 0
                        ? "bg-[#D2252B] text-white hover:bg-[#b51e23] shadow-md hover:shadow-lg active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {donationAmount > 0
                      ? `Donate ₹${fmt(donationAmount)}`
                      : "Enter amount to donate"}
                  </button>
                </div>
              )}

            </div>
          </div>
          {/* ══════════════════════════════════════════════════ */}

        </div>
      </div>
    </div>
  );
}
