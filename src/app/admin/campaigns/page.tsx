"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiX, FiClock, FiShare2, FiMapPin, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { adminGetCampaigns, adminDeleteCampaign, adminUpdateCampaign, adminUpdateCampaignStatus  } from "@/features/admin/api/admin.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";
import CreateCampaignModal from "../CreateCampaignModal";
import EditCampaignModal from "../EditCampaignModal";
import DeleteConfirmModal from "../DeleteConfirmModal";

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

function getProgress(raised: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

function getDaysLeft(endDate: string): number {
  return Math.max(0, Math.ceil(
    (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ));
}

function mapStatus(status: string): { label: string; color: string } {
  switch (status?.toUpperCase()) {
    case "APPROVED":  return { label: "Active",    color: "bg-blue-50 text-blue-600 border border-blue-200" };
    case "PENDING":   return { label: "Pending",   color: "bg-yellow-50 text-yellow-600 border border-yellow-200" };
    case "DRAFT":     return { label: "Draft",     color: "bg-gray-100 text-gray-500 border border-gray-200" };
    case "COMPLETED": return { label: "Completed", color: "bg-green-50 text-green-600 border border-green-200" };
    case "REJECTED":  return { label: "Rejected",  color: "bg-red-50 text-red-500 border border-red-200" };
    default:          return { label: status || "Unknown", color: "bg-gray-100 text-gray-500 border border-gray-200" };
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [perPage, setPerPage] = useState(8);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await adminGetCampaigns();
      const list: Campaign[] = data?.campaigns || data || [];
      setCampaigns(list);
      if (list.length > 0 && !selected) setSelected(list[0]);
    } catch (err) {
      console.error("❌ Campaigns fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  // ── Status Toggle ─────────────────────────────────────────────────────────
  const handleStatusToggle = async (campaign: Campaign) => {
  const newStatus =
    campaign.status?.toUpperCase() === "APPROVED" ? "PENDING" : "APPROVED";

  try {
    setStatusLoading(campaign.id);

    await adminUpdateCampaignStatus(campaign.id, newStatus);

    // update UI
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id ? { ...c, status: newStatus } : c
      )
    );

    if (selected?.id === campaign.id) {
      setSelected({ ...campaign, status: newStatus });
    }

    showToast(
      `✅ Status changed to ${
        newStatus === "APPROVED" ? "Active" : "Pending"
      }`,
      "success"
    );
  } catch (err: any) {
    showToast(err.message || "Failed to update status", "error");
  } finally {
    setStatusLoading(null);
  }
};

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selected) return;
    await adminDeleteCampaign(selected.id);
    setCampaigns((prev) => prev.filter((c) => c.id !== selected.id));
    setSelected(null);
    setShowDelete(false);
    showToast("✅ Campaign deleted", "success");
  };

  const counts = {
    All:       campaigns.length,
    Active:    campaigns.filter((c) => c.status?.toUpperCase() === "APPROVED").length,
    Pending:   campaigns.filter((c) => c.status?.toUpperCase() === "PENDING").length,
    Draft:     campaigns.filter((c) => c.status?.toUpperCase() === "DRAFT").length,
    Completed: campaigns.filter((c) => c.status?.toUpperCase() === "COMPLETED").length,
  };

  const filtered = campaigns.filter((c) => {
    const tabMatch =
      activeTab === "All" ||
      (activeTab === "Active"    && c.status?.toUpperCase() === "APPROVED") ||
      (activeTab === "Pending"   && c.status?.toUpperCase() === "PENDING") ||
      (activeTab === "Draft"     && c.status?.toUpperCase() === "DRAFT") ||
      (activeTab === "Completed" && c.status?.toUpperCase() === "COMPLETED");
    const searchMatch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.cause?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <>
      {/* Modals */}
      <CreateCampaignModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchCampaigns} />
      <EditCampaignModal isOpen={showEdit} campaign={selected} onClose={() => setShowEdit(false)} onSuccess={fetchCampaigns} />
      <DeleteConfirmModal
        isOpen={showDelete}
        title={selected?.title || ""}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Global toast */}
      {toast.msg && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex gap-5 min-h-full">

        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Campaigns</h1>
              <p className="text-xs text-gray-400 mt-0.5">Dashboard / Campaigns</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-[#334E79] hover:bg-[#2a3e60] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-200"
            >
              <FiPlus size={16} /> Create Campaign
            </button>
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 flex-wrap">
              {(["All", "Active", "Pending", "Draft", "Completed"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeTab === tab ? "bg-[#334E79] text-white" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {counts[tab as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1 relative min-w-[160px]">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for campaign"
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-400 placeholder:text-gray-400" />
            </div>

            <button className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition">
              <HiOutlineAdjustmentsHorizontal size={16} />
            </button>
          </div>

          {/* List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading && <div className="p-8 text-center text-sm text-gray-400">Loading campaigns...</div>}
            {!loading && filtered.length === 0 && <div className="p-8 text-center text-sm text-gray-400">No campaigns found</div>}

            {!loading && filtered.slice(0, perPage).map((c) => {
              const progress = getProgress(c.raisedAmount, c.goalAmount);
              const daysLeft = getDaysLeft(c.endDate);
              const { label, color } = mapStatus(c.status);
              const isSelected = selected?.id === c.id;

              return (
                <div key={c.id} onClick={() => setSelected(c)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition border-b border-gray-50 last:border-0 ${
                    isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                    {isValidUrl(c.image)
                      ? <img src={c.image!} alt={c.title} className="w-full h-full object-cover" />
                      : <span className="text-[10px] text-gray-400">No Image</span>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100">
                      {c.cause?.name || "General"}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 truncate mt-1">{c.title}</p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                      <FiMapPin size={10} /> {c.location}
                    </div>
                  </div>

                  <div className="w-40 shrink-0 hidden md:block">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>Progress: <span className="font-semibold text-gray-700">{progress}%</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      ₹{c.raisedAmount.toLocaleString("en-US")} / ₹{c.goalAmount.toLocaleString("en-US")}
                    </p>
                  </div>

                  <div className="shrink-0 text-right hidden sm:block">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${color}`}>● {label}</span>
                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-gray-400">
                      <FiClock size={10} />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                    </div>
                  </div>

                  {/* Row action buttons */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelected(c); setShowEdit(true); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={12} />
                    </button>
                    <button
                      onClick={() => { setSelected(c); setShowDelete(true); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Show</span>
              <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none">
                {[8, 12, 16].map((n) => <option key={n}>{n}</option>)}
              </select>
              <span>of {filtered.length} results</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition ${
                  p === 1 ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Detail Panel ── */}
        {selected && (
          <div className="w-[340px] shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto max-h-[calc(100vh-140px)] sticky top-0">

            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${mapStatus(selected.status).color}`}>
                ● {mapStatus(selected.status).label}
              </span>
              <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
                <FiX size={15} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <h2 className="text-base font-bold text-gray-800">{selected.title}</h2>

              <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {isValidUrl(selected.image)
                  ? <img src={selected.image!} alt={selected.title} className="w-full h-full object-cover" />
                  : <span className="text-sm text-gray-400">No Image</span>
                }
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Raised</p>
                <div className="flex items-end gap-2 mb-1">
                  <p className="text-2xl font-bold text-gray-800">₹{selected.raisedAmount.toLocaleString("en-US")}</p>
                  <p className="text-xs text-gray-400 mb-1">/ ₹{selected.goalAmount.toLocaleString("en-US")}</p>
                  <p className="text-xs text-blue-500 font-semibold mb-1 ml-auto">
                    {getProgress(selected.raisedAmount, selected.goalAmount)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${getProgress(selected.raisedAmount, selected.goalAmount)}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Days Left", value: getDaysLeft(selected.endDate) },
                  { label: "Location",  value: selected.location || "—" },
                  { label: "Status",    value: mapStatus(selected.status).label },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-2">Cause:</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {selected.cause?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{selected.cause?.name || "—"}</p>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{selected.cause?.description || ""}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Description</p>
                <p className="text-xs text-gray-500 leading-relaxed">{selected.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400">Start Date</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">
                    {new Date(selected.startDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400">End Date</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">
                    {new Date(selected.endDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="space-y-2 pt-2">

                {/* Status Toggle */}
                <button
                  onClick={() => handleStatusToggle(selected)}
                  disabled={statusLoading === selected.id}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition border ${
                    selected.status?.toUpperCase() === "APPROVED"
                      ? "bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100"
                      : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {statusLoading === selected.id
                    ? "Updating..."
                    : selected.status?.toUpperCase() === "APPROVED"
                    ? "⏸ Set to Pending"
                    : "✅ Set to Active"
                  }
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="flex-1 bg-[#334E79] hover:bg-[#2a3e60] text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <FiEdit2 size={13} /> Edit Campaign
                  </button>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2.5 rounded-xl transition border border-red-200 flex items-center justify-center gap-2"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition">
                    <FiShare2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}