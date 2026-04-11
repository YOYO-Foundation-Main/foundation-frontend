"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiCheck, FiX, FiEye, FiRefreshCw, FiShield } from "react-icons/fi";
import {
  adminGetUserKyc,
  adminUpdateUserKyc,
  adminGetCampaignKyc,
  adminUpdateCampaignKyc,
} from "@/features/admin/api/admin.api";

interface UserKyc {
  id: number;
  userId?: number;
  documentType: string;
  type: string;
  status: string;
  documentUrl: string;      // ✅ Changed from 'document'
  rejectionNote?: string;   // ✅ Changed from 'remarks'
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
  documentUrl: string;      // ✅ Changed from 'document'
  rejectionNote?: string;   // ✅ Changed from 'remarks'
  remarks?: string;
  createdAt: string;
  campaign?: { id: number; title: string };
  user?: { name: string; email: string };
}

function isValidUrl(url: string | null | undefined) {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:  "bg-yellow-50 text-yellow-600 border-yellow-200",
    APPROVED: "bg-green-50 text-green-600 border-green-200",
    REJECTED: "bg-red-50 text-red-500 border-red-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${map[status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {status}
    </span>
  );
}

// ✅ Smart document preview — works with Cloudinary URLs (no extension needed)
function DocPreview({ url }: { url: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!url || !isValidUrl(url)) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-xs text-gray-400 text-center border-2 border-dashed border-gray-200">
        No document URL available
      </div>
    );
  }

  const isPdf = url.includes(".pdf") || url.includes("/raw/");

  if (isPdf) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 hover:bg-blue-100 transition">
        <FiEye size={16} /> View PDF Document ↗
      </a>
    );
  }

  // ✅ Always try as image first — Cloudinary image URLs don't always have extension
  if (!imgFailed) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <img
          src={url}
          alt="KYC Document"
          className="w-full max-h-56 object-contain bg-white"
          onError={() => setImgFailed(true)}
        />
        <div className="flex justify-end px-3 py-2 bg-gray-50 border-t border-gray-100">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline flex items-center gap-1">
            <FiEye size={11} /> Open full size ↗
          </a>
        </div>
      </div>
    );
  }

  // Image failed — fallback to link
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 hover:bg-blue-100 transition">
      <FiEye size={16} /> View Document ↗
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-bold text-gray-800">Review KYC Document</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {type === "user" ? "User / Campaigner" : "Campaign / Beneficiary"} verification
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <FiX size={18} />
          </button>
        </div>

        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>{toast.msg}</div>
        )}

        <div className="p-6 space-y-4">

          {/* ✅ Document preview */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Submitted Document</p>
            <DocPreview url={item.documentUrl} />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Document Type</p>
              <p className="text-sm font-semibold text-gray-800">{item.documentType}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Submitted As</p>
              <p className="text-sm font-semibold text-gray-800">{item.type}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Current Status</p>
              <StatusBadge status={item.status} />
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Submitted On</p>
              <p className="text-xs font-semibold text-gray-700">
                {new Date(item.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* User info */}
          {"user" in item && item.user && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">Submitted by</p>
              <p className="text-sm font-bold text-blue-800">{item.user.name}</p>
              <p className="text-xs text-blue-500">{item.user.email}</p>
            </div>
          )}

          {/* Campaign info */}
          {"campaign" in item && (item as CampaignKyc).campaign && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
              <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">For Campaign</p>
              <p className="text-sm font-bold text-purple-800">{(item as CampaignKyc).campaign!.title}</p>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Remarks <span className="text-gray-400 font-normal">(shown to user)</span>
            </label>
            <textarea rows={2} placeholder="Add a note if rejecting..."
              value={remarks} onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none transition" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
          <button onClick={() => handle("REJECTED")} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-sm font-semibold py-2.5 rounded-xl transition">
            <FiX size={14} /> Reject
          </button>
          <button onClick={() => handle("APPROVED")} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition">
            <FiCheck size={14} /> {loading ? "Updating..." : "Approve"}
          </button>
        </div>
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

  return (
    <>
      <ActionModal item={selected} type={tab} onClose={() => setSelected(null)} onDone={fetchAll} />

      {toast.msg && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">KYC Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Dashboard / KYC</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 bg-white px-3 py-2 rounded-xl hover:bg-gray-50 transition">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-5">
        {[
          { key: "user",     label: "User KYC",     count: userKyc.length },
          { key: "campaign", label: "Campaign KYC", count: campaignKyc.length },
        ].map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key as any); setSearch(""); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.key ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"
            }`}>
            <FiShield size={14} /> {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              tab === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Status filter + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === s
                  ? s === "PENDING"  ? "bg-yellow-500 text-white"
                  : s === "APPROVED" ? "bg-green-500 text-white"
                  : s === "REJECTED" ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {s}{counts[s] > 0 && ` (${counts[s]})`}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, document type..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-400 placeholder:text-gray-400" />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading && <div className="p-10 text-center text-sm text-gray-400">Loading KYC records...</div>}
        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center">
            <FiShield size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No KYC records found</p>
          </div>
        )}

        {!loading && filtered.map((k) => (
          <div key={k.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">

            {/* Doc thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
              <img
                src={k.documentUrl}
                alt="doc"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                }}
              />
              <FiShield size={16} className="text-gray-300 hidden" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">
                  {tab === "user"
                    ? (k as UserKyc).user?.name || `User #${k.id}`
                    : (k as CampaignKyc).campaign?.title || `Campaign KYC #${k.id}`
                  }
                </p>
                <StatusBadge status={k.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{k.documentType}</span>
                <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-medium">{k.type}</span>
                {tab === "user" && (k as UserKyc).user?.email && <span>{(k as UserKyc).user!.email}</span>}
                <span>{new Date(k.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>

            {/* Actions */}
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
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition border border-green-200"
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
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition border border-red-200"
                  >
                    <FiX size={14} />
                  </button>
                </>
              )}
              <button
                onClick={() => setSelected(k)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
              >
                <FiEye size={12} /> Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}