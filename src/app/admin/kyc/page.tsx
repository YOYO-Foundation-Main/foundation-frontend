
//new ui of kyc verification admin 

"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiCheck, FiX, FiEye, FiRefreshCw, FiShield, FiFilter, FiUser, FiFileText, FiClock, FiAlertCircle } from "react-icons/fi";
import {
  adminGetUserKyc,
  adminUpdateUserKyc,
  adminGetCampaignKyc,
  adminUpdateCampaignKyc,
} from "@/features/admin/api/admin.api";
import { isValidUrl } from "@/utils/url";

interface UserKyc {
  id: number;
  userId?: number;
  documentType: string; 
  type: string;
  status: string;
  documentUrl: string;
  rejectionNote?: string;
  remarks?: string;
  createdAt: string;
  user?: { id: number; name: string; email: string };
}

interface CampaignKyc {
  id: number;
  campaignId?: number;
  documentType: string;
  type: string;
  status: string;
  documentUrl: string;
  rejectionNote?: string;
  remarks?: string;
  createdAt: string;
  campaign?: { id: number; title: string };
  user?: { name: string; email: string };
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:  "bg-amber-50 text-amber-600 border border-amber-200 ring-1 ring-amber-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border border-emerald-200 ring-1 ring-emerald-100",
    REJECTED: "bg-rose-50 text-rose-500 border border-rose-200 ring-1 ring-rose-100",
  };
  const dot: Record<string, string> = {
    PENDING: "bg-amber-400",
    APPROVED: "bg-emerald-400",
    REJECTED: "bg-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase ${map[status] || "bg-gray-100 text-gray-500 border border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || "bg-gray-400"}`} />
      {status}
    </span>
  );
}

function DocPreview({ url }: { url: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!url || !isValidUrl(url)) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-xs text-slate-400 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-2">
        <FiFileText size={24} className="text-slate-300" />
        <span>No document URL available</span>
      </div>
    );
  }

  const isPdf = url.includes(".pdf") || url.includes("/raw/");

  if (isPdf) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4 hover:bg-indigo-100 transition-all duration-200 font-medium">
        <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
          <FiEye size={15} className="text-indigo-500" />
        </div>
        View PDF Document
        <span className="ml-auto text-indigo-400 text-xs">↗ Open</span>
      </a>
    );
  }

  if (!imgFailed) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
        <div className="relative">
          <img
            src={url}
            alt="KYC Document"
            className="w-full max-h-64 object-contain bg-white"
            onError={() => setImgFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
        <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-medium">Document Preview</span>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-semibold transition-colors">
            <FiEye size={11} /> Full size ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4 hover:bg-indigo-100 transition-all duration-200 font-medium">
      <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
        <FiEye size={15} className="text-indigo-500" />
      </div>
      View Document
      <span className="ml-auto text-indigo-400 text-xs">↗ Open</span>
    </a>
  );
}

// ── Action Modal ──────────────────────────────────────────────────────────────
function ActionModal({
  item, type, onClose, onDone,
}: {
  item: UserKyc | CampaignKyc | null;
  type: "user" | "campaign";
  onClose: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "" });

  useEffect(() => {
    setRemarks(item?.rejectionNote || "");
  }, [item]);

  if (!item) return null;

  const showToast = (msg: string, t: "success" | "error") => {
    setToast({ msg, type: t });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handle = async (status: "APPROVED" | "REJECTED") => {
    try {
      setLoading(true);
      if (type === "user") await adminUpdateUserKyc(item.id, status, remarks || undefined);
      else await adminUpdateCampaignKyc(item.id, status, remarks || undefined);
      showToast(`✅ KYC ${status.toLowerCase()}`, "success");
      setTimeout(() => { onDone(); onClose(); }, 800);
    } catch (err: any) {
      showToast(err.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-900/20 max-h-[92vh] overflow-y-auto border border-slate-100">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <FiShield size={18} className="text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Review KYC Document</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {type === "user" ? "User / Campaigner" : "Campaign / Beneficiary"} verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-all duration-150">
            <FiX size={18} />
          </button>
        </div>

        {toast.msg && (
          <div className={`mx-6 mt-5 px-4 py-3 rounded-2xl text-sm text-center font-semibold flex items-center justify-center gap-2 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-rose-50 text-rose-500 border border-rose-200"
          }`}>{toast.msg}</div>
        )}

        <div className="p-6 space-y-5">

          {/* Document Preview */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Submitted Document</p>
            <DocPreview url={item.documentUrl} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Document Type", value: item.documentType },
              { label: "Submitted As", value: item.type },
            ].map((d) => (
              <div key={d.label} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{d.label}</p>
                <p className="text-sm font-bold text-slate-700">{d.value}</p>
              </div>
            ))}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Status</p>
              <StatusBadge status={item.status} />
            </div>
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Submitted On</p>
              <p className="text-xs font-bold text-slate-700">
                {new Date(item.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* User info */}
          {"user" in item && item.user && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-2">Submitted By</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <FiUser size={14} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-800">{item.user.name}</p>
                  <p className="text-xs text-indigo-400">{item.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Campaign info */}
          {"campaign" in item && (item as CampaignKyc).campaign && (
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-4">
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider mb-2">For Campaign</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                  <FiFileText size={14} className="text-violet-500" />
                </div>
                <p className="text-sm font-bold text-violet-800">{(item as CampaignKyc).campaign!.title}</p>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Remarks <span className="text-slate-400 font-normal normal-case tracking-normal">(shown to user if rejected)</span>
            </label>
            <textarea rows={3} placeholder="Add a note for the user..."
              value={remarks} onChange={(e) => setRemarks(e.target.value)}
              className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:bg-white resize-none transition-all duration-200 placeholder:text-slate-300" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl sticky bottom-0">
          <button onClick={() => handle("REJECTED")} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-500 border-2 border-rose-200 text-sm font-bold py-3 rounded-2xl transition-all duration-200 hover:border-rose-300 shadow-sm">
            <FiX size={15} /> Reject
          </button>
          <button onClick={() => handle("APPROVED")} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-3 rounded-2xl transition-all duration-200 shadow-md shadow-emerald-200 hover:shadow-emerald-300">
            <FiCheck size={15} /> {loading ? "Updating..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, count, color, icon }: { label: string; count: number; color: string; icon: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue:    "from-blue-500 to-indigo-600 shadow-blue-200",
    amber:   "from-amber-400 to-orange-500 shadow-amber-200",
    emerald: "from-emerald-400 to-teal-500 shadow-emerald-200",
    rose:    "from-rose-400 to-red-500 shadow-rose-200",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800">{count}</p>
        <p className="text-xs text-slate-400 font-semibold">{label}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminKycPage() {
  const [tab, setTab] = useState<"user" | "campaign">("user");
  const [userKyc, setUserKyc] = useState<UserKyc[]>([]);
  const [campaignKyc, setCampaignKyc] = useState<CampaignKyc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<UserKyc | CampaignKyc | null>(null);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [userRes, campaignRes] = await Promise.all([
        adminGetUserKyc(),
        adminGetCampaignKyc(),
      ]);
      setUserKyc(Array.isArray(userRes) ? userRes : userRes?.data || userRes?.kycs || []);
      setCampaignKyc(Array.isArray(campaignRes) ? campaignRes : campaignRes?.data || campaignRes?.kycs || []);
    } catch (err) {
      console.error("KYC fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const currentList = tab === "user" ? userKyc : campaignKyc;

  const filtered = currentList.filter((k) => {
    const matchStatus = statusFilter === "ALL" || k.status === statusFilter;
    const s = search.toLowerCase();
    const matchSearch =
      k.documentType?.toLowerCase().includes(s) ||
      k.type?.toLowerCase().includes(s) ||
      (k as UserKyc).user?.name?.toLowerCase().includes(s) ||
      (k as UserKyc).user?.email?.toLowerCase().includes(s) ||
      (k as CampaignKyc).campaign?.title?.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  const counts = {
    ALL:      currentList.length,
    PENDING:  currentList.filter((k) => k.status === "PENDING").length,
    APPROVED: currentList.filter((k) => k.status === "APPROVED").length,
    REJECTED: currentList.filter((k) => k.status === "REJECTED").length,
  };

  const totalAll = userKyc.length + campaignKyc.length;
  const totalPending = userKyc.filter(k => k.status === "PENDING").length + campaignKyc.filter(k => k.status === "PENDING").length;
  const totalApproved = userKyc.filter(k => k.status === "APPROVED").length + campaignKyc.filter(k => k.status === "APPROVED").length;
  const totalRejected = userKyc.filter(k => k.status === "REJECTED").length + campaignKyc.filter(k => k.status === "REJECTED").length;

  return (
    <>
      <ActionModal item={selected} type={tab} onClose={() => setSelected(null)} onDone={fetchAll} />

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-2.5 border ${
          toast.type === "success"
            ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200"
            : "bg-rose-500 text-white border-rose-400 shadow-rose-200"
        }`}>{toast.msg}</div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Panel</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">KYC</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">KYC Management</h1>
          <p className="text-sm text-slate-400 mt-1">Verify and manage identity documents submitted by users and campaigns.</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 border-2 border-slate-200 bg-white px-4 py-2.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
          <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Submissions" count={totalAll} color="blue" icon={<FiShield size={20} />} />
        <StatCard label="Pending Review" count={totalPending} color="amber" icon={<FiClock size={20} />} />
        <StatCard label="Approved" count={totalApproved} color="emerald" icon={<FiCheck size={20} />} />
        <StatCard label="Rejected" count={totalRejected} color="rose" icon={<FiAlertCircle size={20} />} />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "user",     label: "User KYC",     count: userKyc.length,     icon: <FiUser size={14} /> },
          { key: "campaign", label: "Campaign KYC", count: campaignKyc.length, icon: <FiFileText size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key as any); setSearch(""); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
              tab === t.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white text-slate-500 border-2 border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}>
            {t.icon}
            {t.label}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              tab === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-white border-2 border-slate-100 rounded-2xl p-1.5 shadow-sm">
          <FiFilter size={12} className="text-slate-300 ml-1 mr-0.5" />
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-150 ${
                statusFilter === s
                  ? s === "PENDING"  ? "bg-amber-500 text-white shadow-sm"
                  : s === "APPROVED" ? "bg-emerald-500 text-white shadow-sm"
                  : s === "REJECTED" ? "bg-rose-500 text-white shadow-sm"
                  : "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}>
              {s}
              {counts[s] > 0 && (
                <span className={`ml-1.5 ${statusFilter === s ? "text-white/70" : "text-slate-400"}`}>
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, document type..."
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium outline-none focus:border-indigo-300 placeholder:text-slate-300 shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* ── Table / List ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">

        {/* Table Header */}
        {!loading && filtered.length > 0 && (
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-6 py-3 bg-slate-50 border-b-2 border-slate-100">
            <div className="w-14" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">Document</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">Status</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">Actions</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-16 text-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400 font-medium">Loading KYC records...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FiShield size={28} className="text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-400">No KYC records found</p>
            <p className="text-xs text-slate-300 mt-1">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.map((k, index) => (
          <div
            key={k.id}
            className={`flex items-center gap-4 px-6 py-4 border-b-2 border-slate-50 last:border-0 hover:bg-slate-50/70 transition-all duration-150 group ${
              index % 2 === 0 ? "" : "bg-slate-50/30"
            }`}
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors duration-150">
              <img
                src={k.documentUrl}
                alt="doc"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement!;
                  parent.classList.add("flex", "items-center", "justify-center");
                  const icon = document.createElement("div");
                  icon.className = "text-slate-400 text-lg";
                  icon.innerText = "📄";
                  parent.appendChild(icon);
                }}
              />
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {tab === "user"
                    ? (k as UserKyc).user?.name || `User #${k.id}`
                    : (k as CampaignKyc).campaign?.title || `Campaign KYC #${k.id}`
                  }
                </p>
                <StatusBadge status={k.status} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg font-semibold">{k.documentType}</span>
                <span className="bg-indigo-50 text-indigo-500 px-2.5 py-0.5 rounded-lg font-semibold">{k.type}</span>
                {tab === "user" && (k as UserKyc).user?.email && (
                  <span className="text-slate-400 hidden sm:inline">{(k as UserKyc).user!.email}</span>
                )}
                <span className="flex items-center gap-1 text-slate-300">
                  <FiClock size={10} />
                  {new Date(k.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {k.status === "PENDING" && (
                <>
                  <button
                    title="Quick Approve"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        if (tab === "user") await adminUpdateUserKyc(k.id, "APPROVED");
                        else await adminUpdateCampaignKyc(k.id, "APPROVED");
                        showToast("✅ KYC approved", "success");
                        fetchAll();
                      } catch (err: any) { showToast(err.message, "error"); }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-all duration-150 border-2 border-emerald-200 hover:border-emerald-300 shadow-sm"
                  >
                    <FiCheck size={14} />
                  </button>
                  <button
                    title="Quick Reject"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        if (tab === "user") await adminUpdateUserKyc(k.id, "REJECTED");
                        else await adminUpdateCampaignKyc(k.id, "REJECTED");
                        showToast("KYC rejected", "success");
                        fetchAll();
                      } catch (err: any) { showToast(err.message, "error"); }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 transition-all duration-150 border-2 border-rose-200 hover:border-rose-300 shadow-sm"
                  >
                    <FiX size={14} />
                  </button>
                </>
              )}
              <button
                onClick={() => setSelected(k)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-600 border-2 border-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 shadow-sm"
              >
                <FiEye size={12} /> Review
              </button>
            </div>
          </div>
        ))}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-600">{filtered.length}</span> of <span className="font-bold text-slate-600">{currentList.length}</span> records
            </p>
            {statusFilter !== "ALL" && (
              <button onClick={() => setStatusFilter("ALL")} className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">
                Clear filter ×
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
