// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   FiUser, FiHeart, FiArrowLeft, FiPhone, FiMail,
//   FiCheckCircle, FiClock, FiAlertCircle, FiCamera,
// } from "react-icons/fi";
// import { HiOutlineCurrencyRupee } from "react-icons/hi2";
// import { MdCampaign } from "react-icons/md";
// import { getMyProfile, getMyFundraisers, uploadProfileImage } from "@/features/auth/api/user.api";
// import { useAuthStore } from "@/features/auth/store/auth.store";
// import { useSearchParams } from "next/navigation";
// import KYCModal from "./KYCModal";
// import { isValidUrl } from "@/utils/url";

// interface UserProfile {
//   id: number; name: string; email: string; mobile: string;
//   profileImage?: string | null;
// }
// interface UserStats { totalDonated: number; totalDonations: number; livesImpacted: number; profileCompletion: number; }
// interface FundraiserCampaign { id: number; title: string; description: string; image: string | null; goalAmount: number; raisedAmount: number; progress: number; status: string; createdAt: string; }
// interface FundraiserSummary { totalCampaigns: number; totalRaised: number; totalGoal: number; }

// // function isValidUrl(url: string | null | undefined) {
// //   if (!url) return false;
// //   try { new URL(url); return true; } catch { return false; }
// // }

// function StatusBadge({ status }: { status: string }) {
//   const map: Record<string, { label: string; cls: string }> = {
//     APPROVED: { label: "Active", cls: "bg-green-50 text-green-600 border-green-200" },
//     PENDING: { label: "Pending", cls: "bg-yellow-50 text-yellow-600 border-yellow-200" },
//     DRAFT: { label: "Draft", cls: "bg-gray-100 text-gray-500 border-gray-200" },
//     COMPLETED: { label: "Completed", cls: "bg-blue-50 text-blue-600 border-blue-200" },
//     REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-500 border-red-200" },
//   };
//   const s = map[status?.toUpperCase()] || { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
//   return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>;
// }

// function KycBadge({ status }: { status: string }) {
//   const map: Record<string, { label: string; cls: string }> = {
//     NOT_SUBMITTED: { label: "KYC Not Submitted", cls: "bg-orange-50 text-orange-600 border-orange-200" },
//     PENDING: { label: "KYC Pending", cls: "bg-yellow-50 text-yellow-600 border-yellow-200" },
//     VERIFIED: { label: "KYC Verified", cls: "bg-green-50 text-green-600 border-green-200" },
//     REJECTED: { label: "KYC Rejected", cls: "bg-red-50 text-red-500 border-red-200" },
//   };
//   const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
//   return (
//     <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${s.cls}`}>
//       {status === "VERIFIED" ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />}
//       {s.label}
//     </span>
//   );
// }

// export default function ProfilePage() {
//   const router = useRouter();
//   const { user } = useAuthStore();
//  const searchParams = useSearchParams();
// const [tab, setTab] = useState<"profile" | "fundraisers">(
//   (searchParams.get("tab") as "profile" | "fundraisers") || "profile"
// );  const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [stats, setStats] = useState<UserStats | null>(null);
//   const [kycStatus, setKycStatus] = useState("");
//   const [campaigns, setCampaigns] = useState<FundraiserCampaign[]>([]);
//   const [summary, setSummary] = useState<FundraiserSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [showKyc, setShowKyc] = useState(false);

//   // Profile image upload
//   const [uploadingPhoto, setUploadingPhoto] = useState(false);
//   const [photoToast, setPhotoToast] = useState({ msg: "", type: "" });
//   const photoRef = useRef<HTMLInputElement>(null);

//   useEffect(() => { setMounted(true); }, []);
  
//   useEffect(() => {
//   const tabParam = searchParams.get("tab");
//   if (tabParam === "fundraisers") {
//     setTab("fundraisers");
//   }
// }, [searchParams]);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [profileRes, fundraiserRes] = await Promise.all([
//         getMyProfile(),
//         getMyFundraisers(),
//       ]);
//       setProfile(profileRes?.data?.user ?? null);
//       setStats(profileRes?.data?.stats ?? null);
//       setKycStatus(profileRes?.data?.kycStatus ?? "");
//       setSummary(fundraiserRes?.data?.summary ?? null);
//       setCampaigns(fundraiserRes?.data?.campaigns ?? []);
//     } catch (err) {
//       console.error("Profile load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!mounted) return;
//     if (!user) { router.push("/?login=true"); return; }
//     loadData();
//   }, [mounted]);

//   // ── Profile image upload handler ──────────────────────────────────────────
//   const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setUploadingPhoto(true);
//       const result = await uploadProfileImage(file);
//       // Update profile with new image
//       setProfile((prev) => prev ? { ...prev, profileImage: result?.data?.profileImage } : prev);
//       setPhotoToast({ msg: "✅ Profile photo updated!", type: "success" });
//     } catch (err: any) {
//       setPhotoToast({ msg: err.message || "Failed to upload photo", type: "error" });
//     } finally {
//       setUploadingPhoto(false);
//       setTimeout(() => setPhotoToast({ msg: "", type: "" }), 3000);
//       // Reset file input
//       if (photoRef.current) photoRef.current.value = "";
//     }
//   };

//   if (!mounted || loading) {
//     return (
//       <div className="min-h-screen bg-[#F5F5F5] pt-[72px] flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <div className="w-12 h-12 rounded-full border-4 border-[#D2252B] border-t-transparent animate-spin mx-auto" />
//           <p className="text-sm text-gray-400">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   const firstLetter = profile?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U";
//   const displayName = profile?.name || user?.name || "User";
//   const displayEmail = profile?.email || user?.email || "";
//   const displayMobile = profile?.mobile || "";
//   const profileImageUrl = profile?.profileImage;
//   const campaignOptions = campaigns.map((c) => ({ id: c.id, title: c.title }));

//   return (
//     <>
//       <KYCModal
//         isOpen={showKyc}
//         onClose={() => setShowKyc(false)}
//         campaigns={campaignOptions}
//         onSuccess={() => { setShowKyc(false); loadData(); }}
//       />

//       {/* Photo upload toast */}
//       {photoToast.msg && (
//         <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl text-sm font-medium shadow-lg ${photoToast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
//           }`}>
//           {photoToast.msg}
//         </div>
//       )}

//       <div className="min-h-screen bg-[#F5F5F5] pt-[72px]">
//         <div className="bg-white border-b border-gray-100">
//           <div className="max-w-4xl mx-auto px-6 py-8">

//             <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition mb-6 w-fit">
//               <FiArrowLeft size={14} /> Back to Home
//             </Link>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

//               {/* ── Clickable Avatar ── */}
//               <div className="relative shrink-0 group">
//                 <div
//                   onClick={() => !uploadingPhoto && photoRef.current?.click()}
//                   className="w-20 h-20 rounded-full overflow-hidden bg-[#D2252B] flex items-center justify-center text-white text-3xl font-bold shadow-lg cursor-pointer"
//                 >
//                   {isValidUrl(profileImageUrl) ? (
//                     <img src={profileImageUrl!} alt={displayName} className="w-full h-full object-cover" />
//                   ) : (
//                     <span>{firstLetter}</span>
//                   )}

//                   {/* Hover overlay */}
//                   <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                     {uploadingPhoto ? (
//                       <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
//                     ) : (
//                       <FiCamera size={20} className="text-white" />
//                     )}
//                   </div>
//                 </div>

//                 {/* Small camera badge */}
//                 <div
//                   onClick={() => !uploadingPhoto && photoRef.current?.click()}
//                   className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-100 shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
//                 >
//                   <FiCamera size={13} className="text-gray-600" />
//                 </div>

//                 {/* Hidden file input */}
//                 <input
//                   ref={photoRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handlePhotoChange}
//                 />
//               </div>

//               <div className="flex-1">
//                 <div className="flex flex-wrap items-center gap-3 mb-1">
//                   <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
//                   {kycStatus && <KycBadge status={kycStatus} />}
//                 </div>
//                 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
//                   {displayEmail && <div className="flex items-center gap-1.5"><FiMail size={13} /> {displayEmail}</div>}
//                   {displayMobile && <div className="flex items-center gap-1.5"><FiPhone size={13} /> {displayMobile}</div>}
//                 </div>
//                 <p className="text-[11px] text-gray-400 mt-2">
//                   Click the avatar to update your profile photo
//                 </p>
//                 {stats && (
//                   <div className="mt-3 max-w-xs">
//                     <div className="flex justify-between text-xs text-gray-400 mb-1">
//                       <span>Profile completion</span>
//                       <span className="font-semibold text-gray-600">{stats.profileCompletion}%</span>
//                     </div>
//                     <div className="w-full h-1.5 bg-gray-100 rounded-full">
//                       <div className="h-1.5 bg-[#D2252B] rounded-full" style={{ width: `${stats.profileCompletion}%` }} />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Stats */}
//             {stats && (
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
//                 {[
//                   { label: "Total Donated", value: `₹${stats.totalDonated.toLocaleString("en-US")}`, color: "text-green-500", icon: <HiOutlineCurrencyRupee size={18} /> },
//                   { label: "Total Donations", value: stats.totalDonations, color: "text-pink-500", icon: <FiHeart size={16} /> },
//                   { label: "Lives Impacted", value: stats.livesImpacted, color: "text-blue-500", icon: <FiUser size={16} /> },
//                   { label: "My Campaigns", value: summary?.totalCampaigns ?? 0, color: "text-purple-500", icon: <MdCampaign size={18} /> },
//                 ].map(({ label, value, color, icon }) => (
//                   <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
//                     <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
//                     <p className="text-xl font-bold text-gray-800">{value}</p>
//                     <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Tabs */}
//           <div className="max-w-4xl mx-auto px-6">
//             <div className="flex border-b border-gray-100">
//               {[
//                 { key: "profile", label: "Profile", icon: <FiUser size={14} /> },
//                 { key: "fundraisers", label: "My Fundraisers", icon: <MdCampaign size={14} /> },
//               ].map((t) => (
//                 <button key={t.key} onClick={() => setTab(t.key as any)}
//                   className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${tab === t.key ? "border-[#D2252B] text-[#D2252B]" : "border-transparent text-gray-500 hover:text-gray-700"
//                     }`}>
//                   {t.icon} {t.label}
//                   {t.key === "fundraisers" && summary && summary.totalCampaigns > 0 && (
//                     <span className="bg-[#D2252B]/10 text-[#D2252B] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
//                       {summary.totalCampaigns}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="max-w-4xl mx-auto px-6 py-8">

//           {/* Profile Tab */}
//           {tab === "profile" && (
//             <div className="space-y-5">
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//                 <h2 className="text-base font-bold text-gray-800 mb-5">Personal Information</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   {[
//                     { label: "Full Name", value: displayName },
//                     { label: "Email Address", value: displayEmail },
//                     { label: "Mobile Number", value: displayMobile || "—" },
//                     { label: "KYC Status", value: kycStatus?.replace(/_/g, " ") || "—" },
//                   ].map(({ label, value }) => (
//                     <div key={label}>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
//                       <p className="text-sm font-medium text-gray-800">{value}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {(kycStatus === "NOT_SUBMITTED" || kycStatus === "REJECTED") && (
//                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4">
//                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
//                     <FiAlertCircle size={20} className="text-orange-500" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-orange-700 mb-1">
//                       {kycStatus === "REJECTED" ? "KYC Rejected — Resubmit" : "Complete Your KYC"}
//                     </p>
//                     <p className="text-xs text-orange-600 leading-relaxed">
//                       {kycStatus === "REJECTED"
//                         ? "Your KYC was rejected. Please resubmit with a valid document."
//                         : "Submit your identity documents to unlock full campaign features and increase donor trust."
//                       }
//                     </p>
//                     <button onClick={() => setShowKyc(true)}
//                       className="mt-3 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition">
//                       {kycStatus === "REJECTED" ? "Resubmit KYC" : "Submit KYC"}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {kycStatus === "PENDING" && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-4">
//                   <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
//                     <FiClock size={20} className="text-yellow-500" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-yellow-700 mb-1">KYC Under Review</p>
//                     <p className="text-xs text-yellow-600">Your documents are being reviewed. This usually takes 24–48 hours.</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Fundraisers Tab */}
//           {tab === "fundraisers" && (
//             <div className="space-y-5">
//               {summary && (
//                 <div className="grid grid-cols-3 gap-4">
//                   {[
//                     { label: "Total Campaigns", value: summary.totalCampaigns },
//                     { label: "Total Raised", value: `₹${summary.totalRaised.toLocaleString("en-US")}` },
//                     { label: "Total Goal", value: `₹${summary.totalGoal.toLocaleString("en-US")}` },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
//                       <p className="text-xl font-bold text-gray-800">{value}</p>
//                       <p className="text-xs text-gray-400 mt-0.5">{label}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {campaigns.length === 0 ? (
//                 <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
//                   <MdCampaign size={40} className="text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500 font-medium mb-1">No campaigns yet</p>
//                   <p className="text-sm text-gray-400 mb-5">Start your first fundraising campaign today.</p>
//                   <Link href="/" className="inline-flex items-center gap-2 bg-[#D2252B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-700 transition">
//                     Start Campaign
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {campaigns.map((c) => (
//                     <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                       <div className="flex gap-4 p-5">
//                         <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
//                           {isValidUrl(c.image)
//                             ? <img
//                               src={c.image || "/assets/placeholder.png"}
//                               alt={c.title}
//                               className="w-full h-full object-cover"
//                             />
//                             : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
//                           }
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between gap-3 mb-1">
//                             <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{c.title}</h3>
//                             <div className="flex items-center gap-2 shrink-0">
//                               <StatusBadge status={c.status} />
//                               <button
//                                 onClick={() => setShowKyc(true)}
//                                 className="text-[10px] text-orange-500 hover:text-orange-700 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded-full transition font-medium"
//                               >
//                                 KYC
//                               </button>
//                             </div>
//                           </div>
//                           <p className="text-xs text-gray-400 line-clamp-2 mb-3">{c.description}</p>
//                           <div>
//                             <div className="flex justify-between text-xs text-gray-500 mb-1">
//                               <span>₹{c.raisedAmount.toLocaleString("en-US")} raised</span>
//                               <span className="font-semibold text-gray-700">
//                                 {c.goalAmount > 0 ? `₹${c.goalAmount.toLocaleString("en-US")} goal` : "Goal not set"}
//                               </span>
//                             </div>
//                             <div className="w-full h-1.5 bg-gray-100 rounded-full">
//                               <div className="h-1.5 bg-[#D2252B] rounded-full" style={{ width: `${Math.min(c.progress, 100)}%` }} />
//                             </div>
//                             <div className="flex justify-between text-[10px] text-gray-400 mt-1">
//                               <span>{c.progress}% funded</span>
//                               <span>{new Date(c.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// new profile page

// "use client";
// import { useEffect, useState, useRef, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import {
//   FiUser, FiHeart, FiArrowLeft, FiPhone, FiMail,
//   FiCheckCircle, FiClock, FiAlertCircle, FiCamera,
//   FiTrendingUp, FiEdit3,
// } from "react-icons/fi";
// import { HiOutlineCurrencyRupee } from "react-icons/hi2";
// import { MdCampaign } from "react-icons/md";
// import { getMyProfile, getMyFundraisers, uploadProfileImage, } from "@/features/auth/api/user.api";
// import { useAuthStore } from "@/features/auth/store/auth.store";
// import KYCModal from "./KYCModal";
// import { isValidUrl } from "@/utils/url";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface UserProfile {
//   id: number; name: string; email: string; mobile: string;
//   profileImage?: string | null;
// }
// interface UserStats {
//   totalDonated: number; totalDonations: number;
//   livesImpacted: number; profileCompletion: number;
// }
// interface FundraiserCampaign {
//   id: number; title: string; description: string; image: string | null;
//   goalAmount: number; raisedAmount: number; progress: number;
//   status: string; createdAt: string;
// }
// interface FundraiserSummary { totalCampaigns: number; totalRaised: number; totalGoal: number; }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function fmt(n: number) { return n.toLocaleString("en-IN"); }

// /**
//  * Progress color tiers — consistent with CampaignListSection & DetailPage
//  * 0–25   → gray
//  * 26–50  → amber
//  * 51–75  → blue
//  * 76–99  → green
//  * 100    → emerald
//  */
// function getProgressMeta(p: number) {
//   if (p === 100) return { bar: "bg-emerald-500", track: "bg-emerald-100", text: "text-emerald-600", label: "Complete" };
//   if (p >= 76)   return { bar: "bg-green-500",   track: "bg-green-100",   text: "text-green-600",   label: "Almost Done" };
//   if (p >= 51)   return { bar: "bg-blue-500",    track: "bg-blue-100",    text: "text-blue-600",    label: "On Track" };
//   if (p >= 26)   return { bar: "bg-amber-500",   track: "bg-amber-100",   text: "text-amber-600",   label: "In Progress" };
//   return           { bar: "bg-gray-400",    track: "bg-gray-200",    text: "text-gray-500",    label: "Just Started" };
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function StatusBadge({ status }: { status: string }) {
//   const map: Record<string, { label: string; cls: string; dot: string }> = {
//     APPROVED:  { label: "Active",     cls: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
//     PENDING:   { label: "Pending",    cls: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
//     DRAFT:     { label: "Draft",      cls: "bg-gray-100 text-gray-500 border-gray-200",     dot: "bg-gray-400" },
//     COMPLETED: { label: "Completed",  cls: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-500" },
//     REJECTED:  { label: "Rejected",   cls: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-500" },
//   };
//   const s = map[status?.toUpperCase()] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
//   return (
//     <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
//       {s.label}
//     </span>
//   );
// }

// function KycBadge({ status }: { status: string }) {
//   const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
//     NOT_SUBMITTED: { label: "KYC Not Submitted", cls: "bg-orange-50 text-orange-600 border-orange-200", icon: <FiAlertCircle size={11} /> },
//     PENDING:       { label: "KYC Under Review",  cls: "bg-amber-50 text-amber-600 border-amber-200",   icon: <FiClock size={11} /> },
//     VERIFIED:      { label: "KYC Verified",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <FiCheckCircle size={11} /> },
//     APPROVED:      { label: "KYC Verified",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <FiCheckCircle size={11} /> },
//     REJECTED:      { label: "KYC Rejected",      cls: "bg-red-50 text-red-600 border-red-200",         icon: <FiAlertCircle size={11} /> },
//   };
//   const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200", icon: null };
//   return (
//     <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${s.cls}`}>
//       {s.icon} {s.label}
//     </span>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// function ProfileContent() {
//   const router = useRouter();
//   const { user } = useAuthStore();
//   const searchParams = useSearchParams();
//   const [tab, setTab] = useState<"profile" | "fundraisers">(
//     (searchParams.get("tab") as "profile" | "fundraisers") || "profile"
//   );

//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [stats, setStats] = useState<UserStats | null>(null);
//   const [kycStatus, setKycStatus] = useState("");
//   const [campaigns, setCampaigns] = useState<FundraiserCampaign[]>([]);
//   const [summary, setSummary] = useState<FundraiserSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [showKyc, setShowKyc] = useState(false);

//   const [uploadingPhoto, setUploadingPhoto] = useState(false);
//   const [photoToast, setPhotoToast] = useState({ msg: "", type: "" });
//   const photoRef = useRef<HTMLInputElement>(null);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const tabParam = searchParams.get("tab");
//     if (tabParam === "fundraisers") setTab("fundraisers");
//   }, [searchParams]);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [profileRes, fundraiserRes] = await Promise.all([
//         getMyProfile(),
//         getMyFundraisers(),
//       ]);
//       setProfile(profileRes?.data?.user ?? null);
//       setStats(profileRes?.data?.stats ?? null);
//       setKycStatus(profileRes?.data?.kycStatus ?? "");
//       setSummary(fundraiserRes?.data?.summary ?? null);
//       setCampaigns(fundraiserRes?.data?.campaigns ?? []);
//     } catch (err) {
//       console.error("Profile load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!mounted) return;
//     if (!user) { router.push("/?login=true"); return; }
//     loadData();
//   }, [mounted]);

//   const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       setUploadingPhoto(true);
//       const result = await uploadProfileImage(file);
//       setProfile((prev) => prev ? { ...prev, profileImage: result?.data?.profileImage } : prev);
//       setPhotoToast({ msg: "✅ Profile photo updated!", type: "success" });
//     } catch (err: any) {
//       setPhotoToast({ msg: err.message || "Failed to upload photo", type: "error" });
//     } finally {
//       setUploadingPhoto(false);
//       setTimeout(() => setPhotoToast({ msg: "", type: "" }), 3000);
//       if (photoRef.current) photoRef.current.value = "";
//     }
//   };

//   // ── Loading ──
//   if (!mounted || loading) {
//     return (
//       <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-gray-400">
//           <div className="w-11 h-11 rounded-full border-4 border-[#D2252B]/20 border-t-[#D2252B] animate-spin" />
//           <p className="text-sm font-medium">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   // ── Derived ──
//   const firstLetter = profile?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U";
//   const displayName = profile?.name || user?.name || "User";
//   const displayEmail = profile?.email || user?.email || "";
//   const displayMobile = profile?.mobile || "";
//   const profileImageUrl = profile?.profileImage;
//   const campaignOptions = campaigns.map((c) => ({ id: c.id, title: c.title }));
//   const profileMeta = getProgressMeta(stats?.profileCompletion ?? 0);

//   return (
//     <>
//       <KYCModal
//         isOpen={showKyc}
//         onClose={() => setShowKyc(false)}
//         campaigns={campaignOptions}
//         onSuccess={() => { setShowKyc(false); loadData(); }}
//       />

//       {/* Toast */}
//       {photoToast.msg && (
//         <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all ${
//           photoToast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
//         }`}>
//           {photoToast.msg}
//         </div>
//       )}

//       <div className="min-h-screen bg-[#F5F5F5] pt-[72px]">

//         {/* ── Hero Header ── */}
//         <div className="bg-white border-b border-gray-100">
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">

//             {/* Back */}
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition mb-6 group"
//             >
//               <FiArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
//               Back to Home
//             </Link>

//             {/* Profile identity row */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-6">

//               {/* Avatar */}
//               <div className="relative shrink-0 group">
//                 <div
//                   onClick={() => !uploadingPhoto && photoRef.current?.click()}
//                   className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-[#D2252B] to-[#a01c21] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg cursor-pointer ring-4 ring-white"
//                 >
//                   {isValidUrl(profileImageUrl) ? (
//                     <img src={profileImageUrl!} alt={displayName} className="w-full h-full object-cover" />
//                   ) : (
//                     <span>{firstLetter}</span>
//                   )}
//                   {/* Hover overlay */}
//                   <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                     {uploadingPhoto
//                       ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
//                       : <FiCamera size={22} className="text-white" />
//                     }
//                   </div>
//                 </div>
//                 {/* Camera badge */}
//                 <div
//                   onClick={() => !uploadingPhoto && photoRef.current?.click()}
//                   className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border-2 border-gray-100 shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
//                 >
//                   <FiEdit3 size={12} className="text-gray-500" />
//                 </div>
//                 <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
//               </div>

//               {/* Identity info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex flex-wrap items-center gap-2.5 mb-1">
//                   <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{displayName}</h1>
//                   {kycStatus && <KycBadge status={kycStatus} />}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-gray-500 mb-3">
//                   {displayEmail && (
//                     <span className="flex items-center gap-1.5">
//                       <FiMail size={13} className="text-gray-400" /> {displayEmail}
//                     </span>
//                   )}
//                   {displayMobile && (
//                     <span className="flex items-center gap-1.5">
//                       <FiPhone size={13} className="text-gray-400" /> {displayMobile}
//                     </span>
//                   )}
//                 </div>

//                 {/* Profile completion bar */}
//                 {stats && (
//                   <div className="max-w-xs">
//                     <div className="flex justify-between items-center text-xs mb-1.5">
//                       <span className="text-gray-400 font-medium">Profile completion</span>
//                       <span className={`font-extrabold text-xs ${profileMeta.text}`}>
//                         {stats.profileCompletion}% · {profileMeta.label}
//                       </span>
//                     </div>
//                     <div className={`w-full h-2 rounded-full overflow-hidden ${profileMeta.track}`}>
//                       <div
//                         className={`h-2 rounded-full transition-all duration-700 ${profileMeta.bar}`}
//                         style={{ width: `${stats.profileCompletion}%` }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ── Stats row ── */}
//             {stats && (
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//                 {[
//                   { label: "Total Donated",   value: `₹${fmt(stats.totalDonated)}`,  icon: <HiOutlineCurrencyRupee size={18} />, color: "text-emerald-500", bg: "bg-emerald-50",  border: "border-emerald-100" },
//                   { label: "Donations Made",  value: stats.totalDonations,            icon: <FiHeart size={15} />,               color: "text-pink-500",    bg: "bg-pink-50",    border: "border-pink-100" },
//                   { label: "Lives Impacted",  value: stats.livesImpacted,             icon: <FiUser size={15} />,                color: "text-blue-500",    bg: "bg-blue-50",    border: "border-blue-100" },
//                   { label: "My Campaigns",    value: summary?.totalCampaigns ?? 0,    icon: <MdCampaign size={17} />,            color: "text-violet-500",  bg: "bg-violet-50",  border: "border-violet-100" },
//                 ].map(({ label, value, icon, color, bg, border }) => (
//                   <div key={label} className={`${bg} ${border} border rounded-2xl p-4 flex items-center gap-3`}>
//                     <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center ${color} shrink-0`}>
//                       {icon}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">{value}</p>
//                       <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ── Tabs ── */}
//             <div className="flex gap-0 border-b border-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
//               {[
//                 { key: "profile",      label: "Profile",         icon: <FiUser size={13} /> },
//                 { key: "fundraisers",  label: "My Fundraisers",  icon: <MdCampaign size={13} /> },
//               ].map((t) => (
//                 <button
//                   key={t.key}
//                   onClick={() => setTab(t.key as any)}
//                   className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
//                     tab === t.key
//                       ? "border-[#D2252B] text-[#D2252B]"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
//                   }`}
//                 >
//                   {t.icon}
//                   <span>{t.label}</span>
//                   {t.key === "fundraisers" && summary && summary.totalCampaigns > 0 && (
//                     <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-all ${
//                       tab === "fundraisers" ? "bg-[#D2252B]/10 text-[#D2252B]" : "bg-gray-100 text-gray-500"
//                     }`}>
//                       {summary.totalCampaigns}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── Tab Content ── */}
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">

//           {/* ════ PROFILE TAB ════ */}
//           {tab === "profile" && (
//             <div className="space-y-5">

//               {/* Personal info card */}
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//                 <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider mb-5">
//                   Personal Information
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
//                   {[
//                     { label: "Full Name",      value: displayName },
//                     { label: "Email Address",  value: displayEmail },
//                     { label: "Mobile Number",  value: displayMobile || "—" },
//                     { label: "KYC Status",     value: kycStatus?.replace(/_/g, " ") || "—" },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="space-y-1">
//                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
//                       <p className="text-sm font-semibold text-gray-800">{value}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* KYC banners */}
//               {(kycStatus === "NOT_SUBMITTED" || kycStatus === "REJECTED") && (
//                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4">
//                   <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
//                     <FiAlertCircle size={19} className="text-orange-500" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-bold text-orange-700 mb-1">
//                       {kycStatus === "REJECTED" ? "KYC Rejected — Please Resubmit" : "Complete Your KYC"}
//                     </p>
//                     <p className="text-xs text-orange-600 leading-relaxed">
//                       {kycStatus === "REJECTED"
//                         ? "Your documents were rejected. Please resubmit with valid identity proof."
//                         : "Submit your identity documents to unlock full campaign features and build donor trust."
//                       }
//                     </p>
//                     <button
//                       onClick={() => setShowKyc(true)}
//                       className="mt-3 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition"
//                     >
//                       {kycStatus === "REJECTED" ? "Resubmit KYC" : "Submit KYC"}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {kycStatus === "PENDING" && (
//                 <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
//                   <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
//                     <FiClock size={19} className="text-amber-500" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-amber-700 mb-1">KYC Under Review</p>
//                     <p className="text-xs text-amber-600 leading-relaxed">
//                       Your documents are being reviewed. This usually takes 24–48 hours.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ════ FUNDRAISERS TAB ════ */}
//           {tab === "fundraisers" && (
//             <div className="space-y-5">

//               {/* Summary tiles */}
//               {summary && (
//                 <div className="grid grid-cols-3 gap-4">
//                   {[
//                     { label: "Total Campaigns", value: summary.totalCampaigns,                       icon: <MdCampaign size={16} />,             color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
//                     { label: "Total Raised",     value: `₹${fmt(summary.totalRaised)}`,              icon: <HiOutlineCurrencyRupee size={17} />, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
//                     { label: "Total Goal",       value: `₹${fmt(summary.totalGoal)}`,                icon: <FiTrendingUp size={15} />,           color: "text-blue-500",   bg: "bg-blue-50",   border: "border-blue-100" },
//                   ].map(({ label, value, icon, color, bg, border }) => (
//                     <div key={label} className={`${bg} ${border} border rounded-2xl p-4 text-center`}>
//                       <div className={`flex justify-center mb-1.5 ${color}`}>{icon}</div>
//                       <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">{value}</p>
//                       <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Empty state */}
//               {campaigns.length === 0 ? (
//                 <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
//                   <MdCampaign size={40} className="text-gray-200 mx-auto mb-3" />
//                   <p className="text-gray-600 font-bold mb-1">No campaigns yet</p>
//                   <p className="text-sm text-gray-400 mb-5">Start your first fundraising campaign today.</p>
//                   <Link
//                     href="/"
//                     className="inline-flex items-center gap-2 bg-[#D2252B] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b51e23] transition shadow-sm hover:shadow"
//                   >
//                     Start a Campaign
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {campaigns.map((c) => {
//                     const cp = Math.min(c.progress, 100);
//                     const cm = getProgressMeta(cp);
//                     return (
//                       <div
//                         key={c.id}
//                         className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
//                       >
//                         <div className="flex gap-4 p-4 sm:p-5">

//                           {/* Thumbnail */}
//                           <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
//                             {isValidUrl(c.image) ? (
//                               <img
//                                 src={c.image || "/assets/placeholder.png"}
//                                 alt={c.title}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center">
//                                 <MdCampaign size={22} className="text-gray-300" />
//                               </div>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="flex-1 min-w-0">

//                             {/* Title + badges row */}
//                             <div className="flex items-start justify-between gap-2 mb-1">
//                               <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
//                                 {c.title}
//                               </h3>
//                               <div className="flex items-center gap-1.5 shrink-0">
//                                 <StatusBadge status={c.status} />
//                                 <button
//                                   onClick={() => setShowKyc(true)}
//                                   className="text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-full transition"
//                                 >
//                                   KYC
//                                 </button>
//                               </div>
//                             </div>

//                             {/* Description */}
//                             <p className="text-xs text-gray-400 line-clamp-1 mb-3 leading-relaxed">
//                               {c.description}
//                             </p>

//                             {/* Progress */}
//                             <div>
//                               <div className="flex justify-between items-end text-xs mb-1.5">
//                                 <span className="font-semibold text-gray-700">
//                                   ₹{fmt(c.raisedAmount)}
//                                   <span className="text-gray-400 font-normal ml-1">raised</span>
//                                 </span>
//                                 <div className="flex items-center gap-2">
//                                   <span className={`font-extrabold text-xs ${cm.text}`}>{cp}%</span>
//                                   <span className="text-gray-400 text-[10px]">
//                                     {c.goalAmount > 0 ? `of ₹${fmt(c.goalAmount)}` : "No goal set"}
//                                   </span>
//                                 </div>
//                               </div>
//                               <div className={`w-full h-1.5 rounded-full overflow-hidden ${cm.track}`}>
//                                 <div
//                                   className={`h-1.5 rounded-full transition-all duration-500 ${cm.bar}`}
//                                   style={{ width: `${cp}%` }}
//                                 />
//                               </div>
//                               <p className="text-[10px] text-gray-400 mt-1.5">
//                                 Created {new Date(c.createdAt).toLocaleDateString("en-IN", {
//                                   day: "numeric", month: "short", year: "numeric",
//                                 })}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }


// /* ================= MAIN EXPORT ================= */
// export default function ProfilePage() {
//   return (
//     <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
//       <ProfileContent />
//     </Suspense>
//   );
// }

"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiUser, FiHeart, FiArrowLeft, FiPhone, FiMail,
  FiCheckCircle, FiClock, FiAlertCircle, FiCamera,
  FiTrendingUp, FiEdit3, FiPackage, FiShoppingBag,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdCampaign } from "react-icons/md";
import { getMyProfile, getMyFundraisers, uploadProfileImage, getMyDonations } from "@/features/auth/api/user.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import KYCModal from "./KYCModal";
import { isValidUrl } from "@/utils/url";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number; name: string; email: string; mobile: string;
  profileImage?: string | null;
}
interface UserStats {
  totalDonated: number; totalDonations: number;
  livesImpacted: number; profileCompletion: number;
}
interface FundraiserCampaign {
  id: number; title: string; description: string; image: string | null;
  goalAmount: number; raisedAmount: number; progress: number;
  status: string; createdAt: string;
}
interface FundraiserSummary { totalCampaigns: number; totalRaised: number; totalGoal: number; }

interface DonationProduct {
  name: string; image: string; price: number; quantity: number; total: number;
}
interface Donation {
  id: string;
  campaign: { id: number; title: string; image: string };
  amount: number;
  type: "PRODUCT" | "MONEY";
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
  isAnonymous: boolean;
  products: DonationProduct[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) { return n.toLocaleString("en-IN"); }

function getProgressMeta(p: number) {
  if (p === 100) return { bar: "bg-emerald-500", track: "bg-emerald-100", text: "text-emerald-600", label: "Complete" };
  if (p >= 76)   return { bar: "bg-green-500",   track: "bg-green-100",   text: "text-green-600",   label: "Almost Done" };
  if (p >= 51)   return { bar: "bg-blue-500",    track: "bg-blue-100",    text: "text-blue-600",    label: "On Track" };
  if (p >= 26)   return { bar: "bg-amber-500",   track: "bg-amber-100",   text: "text-amber-600",   label: "In Progress" };
  return           { bar: "bg-gray-400",    track: "bg-gray-200",    text: "text-gray-500",    label: "Just Started" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    APPROVED:  { label: "Active",     cls: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
    PENDING:   { label: "Pending",    cls: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
    DRAFT:     { label: "Draft",      cls: "bg-gray-100 text-gray-500 border-gray-200",     dot: "bg-gray-400" },
    COMPLETED: { label: "Completed",  cls: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-500" },
    REJECTED:  { label: "Rejected",   cls: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-500" },
  };
  const s = map[status?.toUpperCase()] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function KycBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    NOT_SUBMITTED: { label: "KYC Not Submitted", cls: "bg-orange-50 text-orange-600 border-orange-200", icon: <FiAlertCircle size={11} /> },
    PENDING:       { label: "KYC Under Review",  cls: "bg-amber-50 text-amber-600 border-amber-200",   icon: <FiClock size={11} /> },
    VERIFIED:      { label: "KYC Verified",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <FiCheckCircle size={11} /> },
    APPROVED:      { label: "KYC Verified",      cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <FiCheckCircle size={11} /> },
    REJECTED:      { label: "KYC Rejected",      cls: "bg-red-50 text-red-600 border-red-200",         icon: <FiAlertCircle size={11} /> },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
}

function DonationStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    SUCCESS: { label: "Success", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-400" },
    FAILED:  { label: "Failed",  cls: "bg-red-50 text-red-600 border-red-200",             dot: "bg-red-500" },
  };
  const s = map[status?.toUpperCase()] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function DonationTypeBadge({ type }: { type: string }) {
  const isProduct = type === "PRODUCT";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
      isProduct
        ? "bg-violet-50 text-violet-700 border-violet-200"
        : "bg-blue-50 text-blue-700 border-blue-200"
    }`}>
      {isProduct ? <FiPackage size={10} /> : <HiOutlineCurrencyRupee size={10} />}
      {isProduct ? "Products" : "Money"}
    </span>
  );
}

// ─── Donation Card ─────────────────────────────────────────────────────────────

function DonationCard({ donation }: { donation: Donation }) {
  const [expanded, setExpanded] = useState(false);
  const hasProducts = donation.products && donation.products.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4 p-4 sm:p-5">

        {/* Campaign thumbnail */}
        <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
          {isValidUrl(donation.campaign?.image) ? (
            <img
              src={donation.campaign.image}
              alt={donation.campaign.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiHeart size={22} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Top row: campaign title + badges */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
              {donation.campaign?.title || "Campaign"}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <DonationStatusBadge status={donation.status} />
              <DonationTypeBadge type={donation.type} />
            </div>
          </div>

          {/* Amount + anonymous row */}
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex items-center gap-1 text-emerald-600">
              <HiOutlineCurrencyRupee size={15} />
              <span className="text-base font-extrabold">{fmt(donation.amount)}</span>
            </div>
            {donation.isAnonymous && (
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                Anonymous
              </span>
            )}
          </div>

          {/* Date + expand button */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-400">
              {new Date(donation.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}{" "}
              <span className="text-gray-300">·</span>{" "}
              {new Date(donation.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
            {hasProducts && (
              <button
                onClick={() => setExpanded((p) => !p)}
                className="text-[11px] font-bold text-[#D2252B] hover:text-[#b51e23] flex items-center gap-1 transition"
              >
                <FiShoppingBag size={11} />
                {expanded ? "Hide items" : `${donation.products.length} item${donation.products.length > 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Expandable product list ── */}
      {hasProducts && expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-4 sm:px-5 py-4">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
            Donated Items
          </p>
          <div className="space-y-2.5">
            {donation.products.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2.5">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  {isValidUrl(p.image) ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage size={14} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-gray-400">
                    ₹{fmt(p.price)} × {p.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-gray-900">₹{fmt(p.total)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-500">Total Value</span>
            <span className="text-sm font-extrabold text-emerald-600">₹{fmt(donation.amount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ProfileContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"profile" | "fundraisers" | "donations">(
    (searchParams.get("tab") as "profile" | "fundraisers" | "donations") || "profile"
  );

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [kycStatus, setKycStatus] = useState("");
  const [campaigns, setCampaigns] = useState<FundraiserCampaign[]>([]);
  const [summary, setSummary] = useState<FundraiserSummary | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsLoaded, setDonationsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showKyc, setShowKyc] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoToast, setPhotoToast] = useState({ msg: "", type: "" });
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "fundraisers") setTab("fundraisers");
    if (tabParam === "donations") setTab("donations");
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, fundraiserRes] = await Promise.all([
        getMyProfile(),
        getMyFundraisers(),
      ]);
      setProfile(profileRes?.data?.user ?? null);
      setStats(profileRes?.data?.stats ?? null);
      setKycStatus(profileRes?.data?.kycStatus ?? "");
      setSummary(fundraiserRes?.data?.summary ?? null);
      setCampaigns(fundraiserRes?.data?.campaigns ?? []);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    if (donationsLoaded) return;
    try {
      setDonationsLoading(true);
      const res = await getMyDonations();
      setDonations(res?.data ?? []);
      setDonationsLoaded(true);
    } catch (err) {
      console.error("Donations load error:", err);
    } finally {
      setDonationsLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.push("/?login=true"); return; }
    loadData();
  }, [mounted]);

  // Lazy-load donations when tab is first opened
  useEffect(() => {
    if (tab === "donations" && mounted && user) {
      loadDonations();
    }
  }, [tab, mounted]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPhoto(true);
      const result = await uploadProfileImage(file);
      setProfile((prev) => prev ? { ...prev, profileImage: result?.data?.profileImage } : prev);
      setPhotoToast({ msg: "✅ Profile photo updated!", type: "success" });
    } catch (err: any) {
      setPhotoToast({ msg: err.message || "Failed to upload photo", type: "error" });
    } finally {
      setUploadingPhoto(false);
      setTimeout(() => setPhotoToast({ msg: "", type: "" }), 3000);
      if (photoRef.current) photoRef.current.value = "";
    }
  };

  // ── Derived donation stats ──
  const totalDonationAmount = donations.reduce((s, d) => d.status === "SUCCESS" ? s + d.amount : s, 0);
  const successfulDonations = donations.filter((d) => d.status === "SUCCESS").length;
  const productDonations = donations.filter((d) => d.type === "PRODUCT").length;

  // ── Loading ──
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-11 h-11 rounded-full border-4 border-[#D2252B]/20 border-t-[#D2252B] animate-spin" />
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Derived ──
  const firstLetter = profile?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U";
  const displayName = profile?.name || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayMobile = profile?.mobile || "";
  const profileImageUrl = profile?.profileImage;
  const campaignOptions = campaigns.map((c) => ({ id: c.id, title: c.title }));
  const profileMeta = getProgressMeta(stats?.profileCompletion ?? 0);

  return (
    <>
      <KYCModal
        isOpen={showKyc}
        onClose={() => setShowKyc(false)}
        campaigns={campaignOptions}
        onSuccess={() => { setShowKyc(false); loadData(); }}
      />

      {/* Toast */}
      {photoToast.msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all ${
          photoToast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          {photoToast.msg}
        </div>
      )}

      <div className="min-h-screen bg-[#F5F5F5] pt-[72px]">

        {/* ── Hero Header ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">

            {/* Back */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition mb-6 group"
            >
              <FiArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>

            {/* Profile identity row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-6">

              {/* Avatar */}
              <div className="relative shrink-0 group">
                <div
                  onClick={() => !uploadingPhoto && photoRef.current?.click()}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-[#D2252B] to-[#a01c21] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg cursor-pointer ring-4 ring-white"
                >
                  {isValidUrl(profileImageUrl) ? (
                    <img src={profileImageUrl!} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{firstLetter}</span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    {uploadingPhoto
                      ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      : <FiCamera size={22} className="text-white" />
                    }
                  </div>
                </div>
                {/* Camera badge */}
                <div
                  onClick={() => !uploadingPhoto && photoRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border-2 border-gray-100 shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <FiEdit3 size={12} className="text-gray-500" />
                </div>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>

              {/* Identity info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{displayName}</h1>
                  {kycStatus && <KycBadge status={kycStatus} />}
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-gray-500 mb-3">
                  {displayEmail && (
                    <span className="flex items-center gap-1.5">
                      <FiMail size={13} className="text-gray-400" /> {displayEmail}
                    </span>
                  )}
                  {displayMobile && (
                    <span className="flex items-center gap-1.5">
                      <FiPhone size={13} className="text-gray-400" /> {displayMobile}
                    </span>
                  )}
                </div>

                {/* Profile completion bar */}
                {stats && (
                  <div className="max-w-xs">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-gray-400 font-medium">Profile completion</span>
                      <span className={`font-extrabold text-xs ${profileMeta.text}`}>
                        {stats.profileCompletion}% · {profileMeta.label}
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${profileMeta.track}`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${profileMeta.bar}`}
                        style={{ width: `${stats.profileCompletion}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Stats row ── */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Donated",   value: `₹${fmt(stats.totalDonated)}`,  icon: <HiOutlineCurrencyRupee size={18} />, color: "text-emerald-500", bg: "bg-emerald-50",  border: "border-emerald-100" },
                  { label: "Donations Made",  value: stats.totalDonations,            icon: <FiHeart size={15} />,               color: "text-pink-500",    bg: "bg-pink-50",    border: "border-pink-100" },
                  { label: "Lives Impacted",  value: stats.livesImpacted,             icon: <FiUser size={15} />,                color: "text-blue-500",    bg: "bg-blue-50",    border: "border-blue-100" },
                  { label: "My Campaigns",    value: summary?.totalCampaigns ?? 0,    icon: <MdCampaign size={17} />,            color: "text-violet-500",  bg: "bg-violet-50",  border: "border-violet-100" },
                ].map(({ label, value, icon, color, bg, border }) => (
                  <div key={label} className={`${bg} ${border} border rounded-2xl p-4 flex items-center gap-3`}>
                    <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center ${color} shrink-0`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">{value}</p>
                      <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-0 border-b border-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              {[
                { key: "profile",     label: "Profile",        icon: <FiUser size={13} /> },
                { key: "fundraisers", label: "My Fundraisers", icon: <MdCampaign size={13} /> },
                { key: "donations",   label: "My Donations",   icon: <FiHeart size={13} /> },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                    tab === t.key
                      ? "border-[#D2252B] text-[#D2252B]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                  {t.key === "fundraisers" && summary && summary.totalCampaigns > 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-all ${
                      tab === "fundraisers" ? "bg-[#D2252B]/10 text-[#D2252B]" : "bg-gray-100 text-gray-500"
                    }`}>
                      {summary.totalCampaigns}
                    </span>
                  )}
                  {t.key === "donations" && donationsLoaded && donations.length > 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-all ${
                      tab === "donations" ? "bg-[#D2252B]/10 text-[#D2252B]" : "bg-gray-100 text-gray-500"
                    }`}>
                      {donations.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">

          {/* ════ PROFILE TAB ════ */}
          {tab === "profile" && (
            <div className="space-y-5">

              {/* Personal info card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wider mb-5">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    { label: "Full Name",      value: displayName },
                    { label: "Email Address",  value: displayEmail },
                    { label: "Mobile Number",  value: displayMobile || "—" },
                    { label: "KYC Status",     value: kycStatus?.replace(/_/g, " ") || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KYC banners */}
              {(kycStatus === "NOT_SUBMITTED" || kycStatus === "REJECTED") && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <FiAlertCircle size={19} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-orange-700 mb-1">
                      {kycStatus === "REJECTED" ? "KYC Rejected — Please Resubmit" : "Complete Your KYC"}
                    </p>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      {kycStatus === "REJECTED"
                        ? "Your documents were rejected. Please resubmit with valid identity proof."
                        : "Submit your identity documents to unlock full campaign features and build donor trust."
                      }
                    </p>
                    <button
                      onClick={() => setShowKyc(true)}
                      className="mt-3 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition"
                    >
                      {kycStatus === "REJECTED" ? "Resubmit KYC" : "Submit KYC"}
                    </button>
                  </div>
                </div>
              )}

              {kycStatus === "PENDING" && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <FiClock size={19} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-700 mb-1">KYC Under Review</p>
                    <p className="text-xs text-amber-600 leading-relaxed">
                      Your documents are being reviewed. This usually takes 24–48 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ FUNDRAISERS TAB ════ */}
          {tab === "fundraisers" && (
            <div className="space-y-5">

              {/* Summary tiles */}
              {summary && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Campaigns", value: summary.totalCampaigns,                       icon: <MdCampaign size={16} />,             color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
                    { label: "Total Raised",     value: `₹${fmt(summary.totalRaised)}`,              icon: <HiOutlineCurrencyRupee size={17} />, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { label: "Total Goal",       value: `₹${fmt(summary.totalGoal)}`,                icon: <FiTrendingUp size={15} />,           color: "text-blue-500",   bg: "bg-blue-50",   border: "border-blue-100" },
                  ].map(({ label, value, icon, color, bg, border }) => (
                    <div key={label} className={`${bg} ${border} border rounded-2xl p-4 text-center`}>
                      <div className={`flex justify-center mb-1.5 ${color}`}>{icon}</div>
                      <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">{value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {campaigns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
                  <MdCampaign size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold mb-1">No campaigns yet</p>
                  <p className="text-sm text-gray-400 mb-5">Start your first fundraising campaign today.</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#D2252B] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b51e23] transition shadow-sm hover:shadow"
                  >
                    Start a Campaign
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((c) => {
                    const cp = Math.min(c.progress, 100);
                    const cm = getProgressMeta(cp);
                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex gap-4 p-4 sm:p-5">

                          {/* Thumbnail */}
                          <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                            {isValidUrl(c.image) ? (
                              <img
                                src={c.image || "/assets/placeholder.png"}
                                alt={c.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MdCampaign size={22} className="text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">

                            {/* Title + badges row */}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                                {c.title}
                              </h3>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <StatusBadge status={c.status} />
                                <button
                                  onClick={() => setShowKyc(true)}
                                  className="text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-full transition"
                                >
                                  KYC
                                </button>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-400 line-clamp-1 mb-3 leading-relaxed">
                              {c.description}
                            </p>

                            {/* Progress */}
                            <div>
                              <div className="flex justify-between items-end text-xs mb-1.5">
                                <span className="font-semibold text-gray-700">
                                  ₹{fmt(c.raisedAmount)}
                                  <span className="text-gray-400 font-normal ml-1">raised</span>
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-extrabold text-xs ${cm.text}`}>{cp}%</span>
                                  <span className="text-gray-400 text-[10px]">
                                    {c.goalAmount > 0 ? `of ₹${fmt(c.goalAmount)}` : "No goal set"}
                                  </span>
                                </div>
                              </div>
                              <div className={`w-full h-1.5 rounded-full overflow-hidden ${cm.track}`}>
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-500 ${cm.bar}`}
                                  style={{ width: `${cp}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1.5">
                                Created {new Date(c.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ DONATIONS TAB ════ */}
          {tab === "donations" && (
            <div className="space-y-5">

              {/* Loading state */}
              {donationsLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-9 h-9 rounded-full border-4 border-[#D2252B]/20 border-t-[#D2252B] animate-spin" />
                    <p className="text-sm font-medium">Loading donations...</p>
                  </div>
                </div>
              )}

              {/* Summary tiles */}
              {!donationsLoading && donationsLoaded && donations.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Given",         value: `₹${fmt(totalDonationAmount)}`,  icon: <HiOutlineCurrencyRupee size={17} />, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { label: "Successful",           value: successfulDonations,             icon: <FiCheckCircle size={15} />,         color: "text-blue-500",    bg: "bg-blue-50",   border: "border-blue-100" },
                    { label: "Product Donations",    value: productDonations,                icon: <FiPackage size={15} />,             color: "text-violet-500",  bg: "bg-violet-50", border: "border-violet-100" },
                  ].map(({ label, value, icon, color, bg, border }) => (
                    <div key={label} className={`${bg} ${border} border rounded-2xl p-4 text-center`}>
                      <div className={`flex justify-center mb-1.5 ${color}`}>{icon}</div>
                      <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">{value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!donationsLoading && donationsLoaded && donations.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto mb-4">
                    <FiHeart size={28} className="text-pink-300" />
                  </div>
                  <p className="text-gray-700 font-bold mb-1">No donations yet</p>
                  <p className="text-sm text-gray-400 mb-5">
                    Your generosity starts here — browse campaigns and make your first donation.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#D2252B] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b51e23] transition shadow-sm hover:shadow"
                  >
                    <FiHeart size={14} />
                    Explore Campaigns
                  </Link>
                </div>
              )}

              {/* Donation list */}
              {!donationsLoading && donations.length > 0 && (
                <div className="space-y-3">
                  {donations.map((d) => (
                    <DonationCard key={d.id} donation={d} />
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
}


/* ================= MAIN EXPORT ================= */
export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

