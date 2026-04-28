// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { getDonationById, downloadInvoice } from "@/features/donations/api/donation.api";
// import Image from "next/image";
// import Link from "next/link";

// /* ================= INNER COMPONENT ================= */
// function SuccessContent() {
//   const params = useSearchParams();
//   const donationId = params.get("donationId");

//   const [donation, setDonation] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!donationId) return;

//     const fetchDonation = async () => {
//       try {
//         const res = await getDonationById(donationId);
//         setDonation(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDonation();
//   }, [donationId]);

//   const handleDownload = async () => {
//     try {
//       const blob = await downloadInvoice(donation.id);

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `invoice-${donation.id}.pdf`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to download invoice");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading your donation...
//       </div>
//     );
//   }

//   if (!donation) {
//     return <div className="p-10">No donation found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-4 py-10">

//       <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-2xl w-full animate-fadeIn">

//         <div className="flex justify-center mb-6">
//           <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
//             <span className="text-4xl text-green-600">✔</span>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-green-700">
//             Donation Successful
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Your contribution is making a real impact ❤️
//           </p>
//         </div>

//         <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-6">
//           <div className="w-20 h-20 relative rounded-lg overflow-hidden">
//             <Image
//               src={donation.campaign?.image || "/assets/placeholder.png"}
//               alt="campaign"
//               fill
//               className="object-cover"
//             />
//           </div>

//           <div>
//             <p className="font-semibold text-lg">
//               {donation.campaign?.title}
//             </p>
//             <p className="text-sm text-gray-500">
//               {new Date(donation.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>

//         <div className="flex justify-between items-center text-lg font-semibold mb-6 border-b pb-3">
//           <span>Total Paid</span>
//           <span className="text-green-600 text-2xl">
//             ₹{donation.amount}
//           </span>
//         </div>

//         {donation.donationItems?.length > 0 && (
//           <div className="mb-6">
//             <h3 className="font-semibold mb-3 text-gray-700">
//               Items Donated
//             </h3>

//             <div className="space-y-3">
//               {donation.donationItems.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl hover:shadow transition"
//                 >
//                   <div className="w-14 h-14 relative rounded-lg overflow-hidden">
//                     <Image
//                       src={
//                         item.campaignProduct?.image ||
//                         "/assets/placeholder.png"
//                       }
//                       alt={item.campaignProduct?.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <p className="text-sm font-semibold">
//                       {item.campaignProduct?.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       ₹{item.price} × {item.quantity}
//                     </p>
//                   </div>

//                   <div className="text-sm font-semibold">
//                     ₹{item.totalAmount}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm mb-6">
//           <p>
//             <span className="font-semibold">Payment ID:</span>{" "}
//             {donation.razorpayPaymentId}
//           </p>
//           <p className="mt-1">
//             <span className="font-semibold">Donor:</span>{" "}
//             {donation.isAnonymous ? "Anonymous" : donation.donorName}
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <Link href="/campaigns" className="w-full">
//             <button className="w-full bg-[#D2252B] hover:bg-[#b91c1c] transition text-white py-3 rounded-xl font-semibold">
//               Explore More Campaigns
//             </button>
//           </Link>

//           <Link href="/" className="w-full">
//             <button className="w-full border border-gray-300 hover:bg-gray-100 transition py-3 rounded-xl font-semibold">
//               Go Home
//             </button>

//             <button
//               onClick={handleDownload}
//               className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
//             >
//               Download Receipt (PDF)
//             </button>
//           </Link>
//         </div>
//       </div>

//       <style jsx>{`
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-in-out;
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//     </div>
//   );
// }

// /* ================= MAIN EXPORT ================= */
// export default function SuccessPage() {
//   return (
//     <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
//       <SuccessContent />
//     </Suspense>
//   );
// }


//new ui design for success page 

// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { getDonationById, downloadInvoice } from "@/features/donations/api/donation.api";
// import Image from "next/image";
// import Link from "next/link";

// /* ========== CONFETTI PIECE ========== */
// const CONFETTI_COLORS = [
//   "bg-red-400", "bg-yellow-400", "bg-green-400", "bg-blue-400",
//   "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-teal-400",
// ];

// function ConfettiPiece({ index }: { index: number }) {
//   const left = (index * 37 + 13) % 100;
//   const delay = (index * 0.11) % 3;
//   const duration = 2.2 + (index % 5) * 0.4;
//   const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
//   const isCircle = index % 3 === 0;

//   return (
//     <span
//       className={`absolute top-0 ${color} ${isCircle ? "rounded-full w-2 h-2" : "rounded-sm w-2 h-1"} opacity-0`}
//       style={{
//         left: `${left}%`,
//         animation: `confettiFall ${duration}s ${delay}s ease-in forwards`,
//       }}
//     />
//   );
// }

// /* ========== INNER COMPONENT ========== */
// function SuccessContent() {
//   const params = useSearchParams();
//   const donationId = params.get("donationId");

//   const [donation, setDonation] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showCard, setShowCard] = useState(false);

//   useEffect(() => {
//     if (!donationId) return;
//     const fetchDonation = async () => {
//       try {
//         const res = await getDonationById(donationId);
//         setDonation(res.data);
//         setTimeout(() => setShowCard(true), 100);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDonation();
//   }, [donationId]);

//   const handleDownload = async () => {
//     try {
//       const blob = await downloadInvoice(donation.id);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `invoice-${donation.id}.pdf`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to download invoice");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 via-white to-green-50">
//         <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
//         <p className="text-emerald-700 font-medium text-lg tracking-wide">Loading your donation...</p>
//       </div>
//     );
//   }

//   if (!donation) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500 text-lg">No donation found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center px-4 py-12 overflow-hidden">

//       {/* ── Confetti layer ── */}
//       <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
//         {Array.from({ length: 50 }).map((_, i) => (
//           <ConfettiPiece key={i} index={i} />
//         ))}
//       </div>

//       {/* ── Party poppers ── */}
//       <div
//         className="pointer-events-none fixed left-0 top-1/3 text-7xl z-10 opacity-0"
//         style={{ animation: "popperLeft 0.7s 0.2s ease-out forwards" }}
//         aria-hidden
//       >🎉</div>
//       <div
//         className="pointer-events-none fixed left-6 top-1/2 text-5xl z-10 opacity-0"
//         style={{ animation: "popperLeft 0.7s 0.6s ease-out forwards" }}
//         aria-hidden
//       >🎊</div>
//       <div
//         className="pointer-events-none fixed right-0 top-1/3 text-7xl z-10 opacity-0"
//         style={{ animation: "popperRight 0.7s 0.2s ease-out forwards" }}
//         aria-hidden
//       >🎉</div>
//       <div
//         className="pointer-events-none fixed right-6 top-1/2 text-5xl z-10 opacity-0"
//         style={{ animation: "popperRight 0.7s 0.6s ease-out forwards" }}
//         aria-hidden
//       >🎊</div>

//       {/* ── Card ── */}
//       <div
//         className="relative z-20 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-lg transition-all duration-700 ease-out"
//         style={{
//           opacity: showCard ? 1 : 0,
//           transform: showCard ? "translateY(0)" : "translateY(32px)",
//           boxShadow: "0 8px 60px 0 rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.06)",
//         }}
//       >
//         {/* Green top accent bar */}
//         <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 rounded-t-3xl" />

//         <div className="p-7">

//           {/* ── Success Icon ── */}
//           <div className="flex justify-center mb-5">
//             <div className="relative">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200 animate-bounce">
//                 <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//               <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
//             </div>
//           </div>

//           {/* ── Title ── */}
//           <div className="text-center mb-6">
//             <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//               Thank You,{" "}
//               <span className="text-emerald-600">
//                 {donation.isAnonymous ? "Anonymous" : donation.donorName}!
//               </span>
//             </h1>
//             <p className="text-gray-500 mt-2 text-sm">
//               Your generosity is changing lives. Every rupee counts. ❤️
//             </p>
//           </div>

//           {/* ── Campaign Banner ── */}
//           <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 mb-5">
//             <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 ring-2 ring-emerald-200">
//               <Image
//                 src={donation.campaign?.image || "/assets/placeholder.png"}
//                 alt="campaign"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="min-w-0">
//               <p className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
//                 {donation.campaign?.title}
//               </p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {new Date(donation.createdAt).toLocaleString("en-IN", {
//                   dateStyle: "medium",
//                   timeStyle: "short",
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* ── Amount Hero ── */}
//           <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl px-6 py-4 mb-5 shadow-md shadow-emerald-100">
//             <span className="text-emerald-50 font-semibold text-sm uppercase tracking-widest">Total Donated</span>
//             <span className="text-white text-3xl font-black">₹{donation.amount}</span>
//           </div>

//           {/* ── Donated Items ── */}
//           {donation.donationItems?.length > 0 && (
//             <div className="mb-5">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Items Donated</h3>
//               <div className="space-y-2">
//                 {donation.donationItems.map((item: any) => (
//                   <div
//                     key={item.id}
//                     className="flex items-center gap-3 bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 p-3 rounded-xl transition-all duration-200"
//                   >
//                     <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-200">
//                       <Image
//                         src={item.campaignProduct?.image || "/assets/placeholder.png"}
//                         alt={item.campaignProduct?.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-gray-700 capitalize truncate">
//                         {item.campaignProduct?.name}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         ₹{item.price} × {item.quantity}
//                       </p>
//                     </div>
//                     <span className="text-sm font-bold text-emerald-600 shrink-0">
//                       ₹{item.totalAmount}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ── Payment Info ── */}
//           <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-5 py-3 mb-6 flex flex-col gap-2">
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Payment ID</span>
//               <span className="text-xs font-mono text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
//                 {donation.razorpayPaymentId}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</span>
//               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
//                 ✓ {donation.status}
//               </span>
//             </div>
//           </div>

//           {/* ── Action Buttons ── */}
//           <div className="flex flex-col gap-3">
//             <button
//               onClick={handleDownload}
//               className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-emerald-100 transition-all duration-200 active:scale-95"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
//               </svg>
//               Download Receipt
//             </button>

//             <div className="flex gap-3">
//               <Link href="/campaigns" className="flex-1">
//                 <button className="w-full bg-[#D2252B] hover:bg-[#b91c1c] text-white py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95">
//                   More Campaigns
//                 </button>
//               </Link>
//               <Link href="/" className="flex-1">
//                 <button className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95">
//                   Go Home
//                 </button>
//               </Link>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* ── Keyframes injected once via a style tag (no custom Tailwind classes) ── */}
//       <style>{`
//         @keyframes confettiFall {
//           0%   { opacity: 1; transform: translateY(-10px) rotate(0deg); }
//           80%  { opacity: 0.5; }
//           100% { opacity: 0; transform: translateY(110vh) rotate(600deg); }
//         }
//         @keyframes popperLeft {
//           0%   { opacity: 0; transform: rotate(-30deg) scale(0.2) translateX(-40px); }
//           60%  { opacity: 1; transform: rotate(10deg) scale(1.15) translateX(10px); }
//           100% { opacity: 1; transform: rotate(5deg) scale(1) translateX(0); }
//         }
//         @keyframes popperRight {
//           0%   { opacity: 0; transform: rotate(30deg) scale(0.2) translateX(40px); }
//           60%  { opacity: 1; transform: rotate(-10deg) scale(1.15) translateX(-10px); }
//           100% { opacity: 1; transform: rotate(-5deg) scale(1) translateX(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ========== MAIN EXPORT ========== */
// export default function SuccessPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
//         <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
//       </div>
//     }>
//       <SuccessContent />
//     </Suspense>
//   );
// }


//new animations more better success page 

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDonationById, downloadInvoice } from "@/features/donations/api/donation.api";
import Image from "next/image";
import Link from "next/link";

/* ========== CONFETTI PIECE ========== */
const CONFETTI_COLORS = [
  "bg-red-400", "bg-yellow-400", "bg-green-400", "bg-blue-400",
  "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-teal-400",
];

function ConfettiPiece({ index }: { index: number }) {
  const left = (index * 37 + 13) % 100;
  const delay = (index * 0.11) % 3;
  const duration = 2.4 + (index % 5) * 0.4;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const isCircle = index % 3 === 0;

  return (
    <span
      className={`absolute top-0 ${color} ${isCircle ? "rounded-full w-2 h-2" : "rounded-sm w-2 h-1"} opacity-0`}
      style={{
        left: `${left}%`,
        animation: `confettiFall ${duration}s ${delay}s ease-in forwards`,
      }}
    />
  );
}

/* ========== FLOATING POPPER ========== */
// Positioned relative to the card using absolute within the card wrapper
type PopperProps = {
  emoji: string;
  style: React.CSSProperties;
  animName: string;
  delay?: number;
};

function Popper({ emoji, style, animName, delay = 0 }: PopperProps) {
  return (
    <div
      className="pointer-events-none absolute text-5xl select-none z-30 opacity-0"
      style={{
        ...style,
        animation: `${animName} 0.8s ${delay}s cubic-bezier(0.34,1.56,0.64,1) forwards`,
      }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}

/* ========== INNER COMPONENT ========== */
function SuccessContent() {
  const params = useSearchParams();
  const donationId = params.get("donationId");

  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (!donationId) return;
    const fetchDonation = async () => {
      try {
        const res = await getDonationById(donationId);
        setDonation(res.data);
        setTimeout(() => setShowCard(true), 100);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [donationId]);

  const handleDownload = async () => {
    try {
      const blob = await downloadInvoice(donation.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${donation.id}.pdf`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
        <p className="text-emerald-700 font-medium text-lg tracking-wide">Loading your donation...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No donation found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* ── Confetti layer ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 55 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      {/* ── Card wrapper (position:relative so poppers anchor to it) ── */}
      <div className="relative w-full max-w-lg">

        {/* ── Party Poppers — anchored around the card top corners ── */}

        {/* Top-left corner poppers */}
        <Popper emoji="🎉" animName="popTopLeft" delay={0.3}
          style={{ top: "-28px", left: "-36px" }} />
        <Popper emoji="🎊" animName="popTopLeft2" delay={0.55}
          style={{ top: "30px", left: "-52px", fontSize: "2rem" }} />
        <Popper emoji="✨" animName="popTopLeft" delay={0.75}
          style={{ top: "-44px", left: "20px", fontSize: "1.8rem" }} />

        {/* Top-right corner poppers */}
        <Popper emoji="🎉" animName="popTopRight" delay={0.3}
          style={{ top: "-28px", right: "-36px" }} />
        <Popper emoji="🎊" animName="popTopRight2" delay={0.55}
          style={{ top: "30px", right: "-52px", fontSize: "2rem" }} />
        <Popper emoji="✨" animName="popTopRight" delay={0.75}
          style={{ top: "-44px", right: "20px", fontSize: "1.8rem" }} />

        {/* ── Card ── */}
        <div
          className="relative z-20 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full transition-all duration-700 ease-out"
          style={{
            opacity: showCard ? 1 : 0,
            transform: showCard ? "translateY(0)" : "translateY(32px)",
            boxShadow: "0 8px 60px 0 rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Green top accent bar */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 rounded-t-3xl" />

          <div className="p-7">

            {/* ── Success Icon ── */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200 animate-bounce">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
              </div>
            </div>

            {/* ── Title ── */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Thank You,{" "}
                <span className="text-emerald-600">
                  {donation.isAnonymous ? "Anonymous" : donation.donorName}!
                </span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Your generosity is changing lives. Every rupee counts. ❤️
              </p>
            </div>

            {/* ── Campaign Banner ── */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 mb-5">
              <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 ring-2 ring-emerald-200">
                <Image
                  src={donation.campaign?.image || "/assets/placeholder.png"}
                  alt="campaign"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                  {donation.campaign?.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(donation.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            {/* ── Amount Hero ── */}
            <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl px-6 py-4 mb-5 shadow-md shadow-emerald-100">
              <span className="text-emerald-50 font-semibold text-sm uppercase tracking-widest">Total Donated</span>
              <span className="text-white text-3xl font-black">₹{donation.amount}</span>
            </div>

            {/* ── Donated Items ── */}
            {donation.donationItems?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Items Donated</h3>
                <div className="space-y-2">
                  {donation.donationItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 p-3 rounded-xl transition-all duration-200"
                    >
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-200">
                        <Image
                          src={item.campaignProduct?.image || "/assets/placeholder.png"}
                          alt={item.campaignProduct?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 capitalize truncate">
                          {item.campaignProduct?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 shrink-0">
                        ₹{item.totalAmount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Payment Info ── */}
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-5 py-3 mb-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Payment ID</span>
                <span className="text-xs font-mono text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                  {donation.razorpayPaymentId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  ✓ {donation.status}
                </span>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-emerald-100 transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
                </svg>
                Download Receipt
              </button>

              <div className="flex gap-3">
                <Link href="/campaigns" className="flex-1">
                  <button className="w-full bg-[#D2252B] hover:bg-[#b91c1c] text-white py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95">
                    More Campaigns
                  </button>
                </Link>
                <Link href="/" className="flex-1">
                  <button className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95">
                    Go Home
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
        {/* end card */}

      </div>
      {/* end card wrapper */}

      <style>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(-10px) rotate(0deg); }
          80%  { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(110vh) rotate(600deg); }
        }

        /* Top-left poppers: fly up-left from corner */
        @keyframes popTopLeft {
          0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.3); }
          60%  { opacity: 1; transform: translate(-18px, -40px) rotate(-20deg) scale(1.2); }
          100% { opacity: 1; transform: translate(-12px, -30px) rotate(-15deg) scale(1); }
        }
        @keyframes popTopLeft2 {
          0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.3); }
          60%  { opacity: 1; transform: translate(-30px, -20px) rotate(-30deg) scale(1.1); }
          100% { opacity: 1; transform: translate(-22px, -14px) rotate(-25deg) scale(1); }
        }

        /* Top-right poppers: fly up-right from corner */
        @keyframes popTopRight {
          0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.3); }
          60%  { opacity: 1; transform: translate(18px, -40px) rotate(20deg) scale(1.2); }
          100% { opacity: 1; transform: translate(12px, -30px) rotate(15deg) scale(1); }
        }
        @keyframes popTopRight2 {
          0%   { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.3); }
          60%  { opacity: 1; transform: translate(30px, -20px) rotate(30deg) scale(1.1); }
          100% { opacity: 1; transform: translate(22px, -14px) rotate(25deg) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ========== MAIN EXPORT ========== */
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
