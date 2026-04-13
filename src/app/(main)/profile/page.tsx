"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUser, FiHeart, FiArrowLeft, FiPhone, FiMail,
  FiCheckCircle, FiClock, FiAlertCircle, FiCamera,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdCampaign } from "react-icons/md";
import { getMyProfile, getMyFundraisers, uploadProfileImage } from "@/features/auth/api/user.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import KYCModal from "./KYCModal";

interface UserProfile {
  id: number; name: string; email: string; mobile: string;
  profileImage?: string | null;
}
interface UserStats { totalDonated: number; totalDonations: number; livesImpacted: number; profileCompletion: number; }
interface FundraiserCampaign { id: number; title: string; description: string; image: string | null; goalAmount: number; raisedAmount: number; progress: number; status: string; createdAt: string; }
interface FundraiserSummary { totalCampaigns: number; totalRaised: number; totalGoal: number; }

function isValidUrl(url: string | null | undefined) {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    APPROVED:  { label: "Active",    cls: "bg-green-50 text-green-600 border-green-200" },
    PENDING:   { label: "Pending",   cls: "bg-yellow-50 text-yellow-600 border-yellow-200" },
    DRAFT:     { label: "Draft",     cls: "bg-gray-100 text-gray-500 border-gray-200" },
    COMPLETED: { label: "Completed", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    REJECTED:  { label: "Rejected",  cls: "bg-red-50 text-red-500 border-red-200" },
  };
  const s = map[status?.toUpperCase()] || { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>;
}

function KycBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    NOT_SUBMITTED: { label: "KYC Not Submitted", cls: "bg-orange-50 text-orange-600 border-orange-200" },
    PENDING:       { label: "KYC Pending",        cls: "bg-yellow-50 text-yellow-600 border-yellow-200" },
    VERIFIED:      { label: "KYC Verified",       cls: "bg-green-50 text-green-600 border-green-200" },
    REJECTED:      { label: "KYC Rejected",       cls: "bg-red-50 text-red-500 border-red-200" },
  };
  const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${s.cls}`}>
      {status === "VERIFIED" ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />}
      {s.label}
    </span>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [tab, setTab] = useState<"profile" | "fundraisers">("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [kycStatus, setKycStatus] = useState("");
  const [campaigns, setCampaigns] = useState<FundraiserCampaign[]>([]);
  const [summary, setSummary] = useState<FundraiserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showKyc, setShowKyc] = useState(false);

  // Profile image upload
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoToast, setPhotoToast] = useState({ msg: "", type: "" });
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

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

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.push("/?login=true"); return; }
    loadData();
  }, [mounted]);

  // ── Profile image upload handler ──────────────────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const result = await uploadProfileImage(file);
      // Update profile with new image
      setProfile((prev) => prev ? { ...prev, profileImage: result?.data?.profileImage } : prev);
      setPhotoToast({ msg: "✅ Profile photo updated!", type: "success" });
    } catch (err: any) {
      setPhotoToast({ msg: err.message || "Failed to upload photo", type: "error" });
    } finally {
      setUploadingPhoto(false);
      setTimeout(() => setPhotoToast({ msg: "", type: "" }), 3000);
      // Reset file input
      if (photoRef.current) photoRef.current.value = "";
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-[72px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#D2252B] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const firstLetter = profile?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U";
  const displayName = profile?.name || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayMobile = profile?.mobile || "";
  const profileImageUrl = profile?.profileImage;
  const campaignOptions = campaigns.map((c) => ({ id: c.id, title: c.title }));

  return (
    <>
      <KYCModal
        isOpen={showKyc}
        onClose={() => setShowKyc(false)}
        campaigns={campaignOptions}
        onSuccess={() => { setShowKyc(false); loadData(); }}
      />

      {/* Photo upload toast */}
      {photoToast.msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl text-sm font-medium shadow-lg ${
          photoToast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {photoToast.msg}
        </div>
      )}

      <div className="min-h-screen bg-[#F5F5F5] pt-[72px]">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-8">

            <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition mb-6 w-fit">
              <FiArrowLeft size={14} /> Back to Home
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

              {/* ── Clickable Avatar ── */}
              <div className="relative shrink-0 group">
                <div
                  onClick={() => !uploadingPhoto && photoRef.current?.click()}
                  className="w-20 h-20 rounded-full overflow-hidden bg-[#D2252B] flex items-center justify-center text-white text-3xl font-bold shadow-lg cursor-pointer"
                >
                  {isValidUrl(profileImageUrl) ? (
                    <img src={profileImageUrl!} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{firstLetter}</span>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    {uploadingPhoto ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <FiCamera size={20} className="text-white" />
                    )}
                  </div>
                </div>

                {/* Small camera badge */}
                <div
                  onClick={() => !uploadingPhoto && photoRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-100 shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <FiCamera size={13} className="text-gray-600" />
                </div>

                {/* Hidden file input */}
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                  {kycStatus && <KycBadge status={kycStatus} />}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                  {displayEmail && <div className="flex items-center gap-1.5"><FiMail size={13} /> {displayEmail}</div>}
                  {displayMobile && <div className="flex items-center gap-1.5"><FiPhone size={13} /> {displayMobile}</div>}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Click the avatar to update your profile photo
                </p>
                {stats && (
                  <div className="mt-3 max-w-xs">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Profile completion</span>
                      <span className="font-semibold text-gray-600">{stats.profileCompletion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-[#D2252B] rounded-full" style={{ width: `${stats.profileCompletion}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Total Donated",  value: `₹${stats.totalDonated.toLocaleString("en-US")}`, color: "text-green-500",  icon: <HiOutlineCurrencyRupee size={18} /> },
                  { label: "Total Donations", value: stats.totalDonations, color: "text-pink-500",   icon: <FiHeart size={16} /> },
                  { label: "Lives Impacted",  value: stats.livesImpacted,  color: "text-blue-500",   icon: <FiUser size={16} /> },
                  { label: "My Campaigns",    value: summary?.totalCampaigns ?? 0, color: "text-purple-500", icon: <MdCampaign size={18} /> },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                    <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex border-b border-gray-100">
              {[
                { key: "profile",     label: "Profile",        icon: <FiUser size={14} /> },
                { key: "fundraisers", label: "My Fundraisers", icon: <MdCampaign size={14} /> },
              ].map((t) => (
                <button key={t.key} onClick={() => setTab(t.key as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
                    tab === t.key ? "border-[#D2252B] text-[#D2252B]" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}>
                  {t.icon} {t.label}
                  {t.key === "fundraisers" && summary && summary.totalCampaigns > 0 && (
                    <span className="bg-[#D2252B]/10 text-[#D2252B] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {summary.totalCampaigns}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-5">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name",     value: displayName },
                    { label: "Email Address", value: displayEmail },
                    { label: "Mobile Number", value: displayMobile || "—" },
                    { label: "KYC Status",    value: kycStatus?.replace(/_/g, " ") || "—" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(kycStatus === "NOT_SUBMITTED" || kycStatus === "REJECTED") && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <FiAlertCircle size={20} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-700 mb-1">
                      {kycStatus === "REJECTED" ? "KYC Rejected — Resubmit" : "Complete Your KYC"}
                    </p>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      {kycStatus === "REJECTED"
                        ? "Your KYC was rejected. Please resubmit with a valid document."
                        : "Submit your identity documents to unlock full campaign features and increase donor trust."
                      }
                    </p>
                    <button onClick={() => setShowKyc(true)}
                      className="mt-3 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition">
                      {kycStatus === "REJECTED" ? "Resubmit KYC" : "Submit KYC"}
                    </button>
                  </div>
                </div>
              )}

              {kycStatus === "PENDING" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <FiClock size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-700 mb-1">KYC Under Review</p>
                    <p className="text-xs text-yellow-600">Your documents are being reviewed. This usually takes 24–48 hours.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fundraisers Tab */}
          {tab === "fundraisers" && (
            <div className="space-y-5">
              {summary && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Campaigns", value: summary.totalCampaigns },
                    { label: "Total Raised",    value: `₹${summary.totalRaised.toLocaleString("en-US")}` },
                    { label: "Total Goal",      value: `₹${summary.totalGoal.toLocaleString("en-US")}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                      <p className="text-xl font-bold text-gray-800">{value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {campaigns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <MdCampaign size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium mb-1">No campaigns yet</p>
                  <p className="text-sm text-gray-400 mb-5">Start your first fundraising campaign today.</p>
                  <Link href="/" className="inline-flex items-center gap-2 bg-[#D2252B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-700 transition">
                    Start Campaign
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="flex gap-4 p-5">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {isValidUrl(c.image)
                            ? <img src={c.image!} alt={c.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{c.title}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge status={c.status} />
                              <button
                                onClick={() => setShowKyc(true)}
                                className="text-[10px] text-orange-500 hover:text-orange-700 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded-full transition font-medium"
                              >
                                KYC
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{c.description}</p>
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>₹{c.raisedAmount.toLocaleString("en-US")} raised</span>
                              <span className="font-semibold text-gray-700">
                                {c.goalAmount > 0 ? `₹${c.goalAmount.toLocaleString("en-US")} goal` : "Goal not set"}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full">
                              <div className="h-1.5 bg-[#D2252B] rounded-full" style={{ width: `${Math.min(c.progress, 100)}%` }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                              <span>{c.progress}% funded</span>
                              <span>{new Date(c.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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