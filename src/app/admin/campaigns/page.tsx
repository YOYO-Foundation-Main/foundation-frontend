"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiX, FiClock, FiShare2, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { adminGetCampaigns, adminDeleteCampaign, adminUpdateCampaign, adminUpdateCampaignStatus, adminUpdateFeaturedStatus } from "@/features/admin/api/admin.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";
import CreateCampaignModal from "../CreateCampaignModal";
import EditCampaignModal from "../EditCampaignModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { isValidUrl } from "@/utils/url";

// ── Helpers ───────────────────────────────────────────────────────────────────


function getProgress(raised: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

// ✅ FIXED: Handle null endDate
function getDaysLeft(endDate: string | null): number {
  if (!endDate) return 0;
  return Math.max(0, Math.ceil(
    (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ));
}

// ✅ Helper to format date safely
function formatDate(date: string | null): string {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// function mapStatus(status: string): { label: string; color: string } {
//   switch (status?.toUpperCase()) {
//     case "APPROVED": return { label: "Active", color: "bg-blue-50 text-blue-600 border border-blue-200" };
//     case "PENDING": return { label: "Pending", color: "bg-yellow-50 text-yellow-600 border border-yellow-200" };
//     case "DRAFT": return { label: "Draft", color: "bg-gray-100 text-gray-500 border border-gray-200" };
//     case "COMPLETED": return { label: "Completed", color: "bg-green-50 text-green-600 border border-green-200" };
//     case "REJECTED": return { label: "Rejected", color: "bg-red-50 text-red-500 border border-red-200" };
//     default: return { label: status || "Unknown", color: "bg-gray-100 text-gray-500 border border-gray-200" };
//   }
// }
function mapStatus(campaign: Campaign): { label: string; color: string } {
  // Archived (Soft Deleted)
  if (!campaign.isActive) {
    return {
      label: "Archived",
      color: "bg-gray-200 text-gray-700 border border-gray-300",
    };
  }

  switch (campaign.status?.toUpperCase()) {
    case "APPROVED":
      return {
        label: "Active",
        color: "bg-blue-50 text-blue-600 border border-blue-200",
      };

    case "PENDING":
      return {
        label: "Pending",
        color: "bg-yellow-50 text-yellow-600 border border-yellow-200",
      };

    case "DRAFT":
      return {
        label: "Draft",
        color: "bg-gray-100 text-gray-500 border border-gray-200",
      };

    case "COMPLETED":
      return {
        label: "Completed",
        color: "bg-green-50 text-green-600 border border-green-200",
      };

    case "REJECTED":
      return {
        label: "Rejected",
        color: "bg-red-50 text-red-500 border border-red-200",
      };

    default:
      return {
        label: campaign.status || "Unknown",
        color: "bg-gray-100 text-gray-500 border border-gray-200",
      };
  }
}


// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [perPage, setPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCampaign, setPendingCampaign] = useState<Campaign | null>(null);

  const [featuredConfirmOpen, setFeaturedConfirmOpen] = useState(false);
  const [featuredTarget, setFeaturedTarget] = useState<Campaign | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState<number | null>(null);
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

  // const fetchCampaigns = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await adminGetCampaigns();
  //     const list: Campaign[] = data?.campaigns || data || [];
  //     setCampaigns(list);
  //     if (list.length > 0 && !selected) setSelected(list[0]);
  //   } catch (err) {
  //     console.error("❌ Campaigns fetch error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCampaigns = async (pageNumber = page) => {
    try {
      setLoading(true);

      const data = await adminGetCampaigns(pageNumber, 10);

      // const list = data.campaigns || [];
      const list: Campaign[] = data.campaigns || [];

      setCampaigns(list);

      setPage(data.page);

      setTotalPages(data.totalPages);

      setCampaigns(list);

      // ✅ IMPORTANT FIX
      if (selected) {
        const updatedSelected = list.find(
          (c) => c.id === selected.id
        );

        if (updatedSelected) {
          setSelected(updatedSelected);
        }
      } else if (list.length > 0) {
        setSelected(list[0]);
      }

    } catch (err) {
      console.error("❌ Campaigns fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  const handleStatusToggle = async (campaign: Campaign) => {
    const newStatus = campaign.status?.toUpperCase() === "APPROVED" ? "PENDING" : "APPROVED";
    try {
      setStatusLoading(campaign.id);
      await adminUpdateCampaignStatus(campaign.id, newStatus);
      setCampaigns((prev) =>
        prev.map((c) => c.id === campaign.id ? { ...c, status: newStatus } : c)
      );
      if (selected?.id === campaign.id) {
        setSelected({ ...campaign, status: newStatus });
      }
      showToast(`✅ Status changed to ${newStatus === "APPROVED" ? "Active" : "Pending"}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleFeaturedToggle = async (campaign: Campaign) => {
    try {
      setFeaturedLoading(campaign.id);

      await adminUpdateFeaturedStatus(
        campaign.id,
        !campaign.isFeatured
      );

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaign.id ? { ...c, isFeatured: !c.isFeatured } : c
        )
      );

      if (selected?.id === campaign.id) {
        setSelected({ ...campaign, isFeatured: !campaign.isFeatured });
      }

      showToast(
        campaign.isFeatured
          ? "Removed from featured"
          : "Marked as featured",
        "success"
      );
    } catch (err: any) {
      showToast(err.message || "Failed to update featured", "error");
    } finally {
      setFeaturedLoading(null);
      setFeaturedConfirmOpen(false);
      setFeaturedTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    await adminDeleteCampaign(selected.id);
    setCampaigns((prev) => prev.filter((c) => c.id !== selected.id));
    setSelected(null);
    setShowDelete(false);
    showToast("✅ Campaign deleted", "success");
  };

  // const counts = {
  //   All: campaigns.length,
  //   Active: campaigns.filter((c) => c.status?.toUpperCase() === "APPROVED").length,
  //   Pending: campaigns.filter((c) => c.status?.toUpperCase() === "PENDING").length,
  //   Draft: campaigns.filter((c) => c.status?.toUpperCase() === "DRAFT").length,
  //   Completed: campaigns.filter((c) => c.status?.toUpperCase() === "COMPLETED").length,
  //   Featured: campaigns.filter((c) => c.isFeatured).length,
  // };
  const counts = {
    All: campaigns.length,
    Active: campaigns.filter(
      (c) => c.isActive && c.status?.toUpperCase() === "APPROVED"
    ).length,

    Pending: campaigns.filter(
      (c) => c.isActive && c.status?.toUpperCase() === "PENDING"
    ).length,

    Draft: campaigns.filter(
      (c) => c.isActive && c.status?.toUpperCase() === "DRAFT"
    ).length,

    Completed: campaigns.filter(
      (c) => c.isActive && c.status?.toUpperCase() === "COMPLETED"
    ).length,

    Featured: campaigns.filter(
      (c) => c.isActive && c.isFeatured
    ).length,

    Archived: campaigns.filter(
      (c) => !c.isActive
    ).length,
  };

  const filtered = campaigns.filter((c) => {
    // const tabMatch =
    //   activeTab === "All" ||
    //   (activeTab === "Active" && c.status?.toUpperCase() === "APPROVED") ||
    //   (activeTab === "Pending" && c.status?.toUpperCase() === "PENDING") ||
    //   (activeTab === "Draft" && c.status?.toUpperCase() === "DRAFT") ||
    //   (activeTab === "Completed" && c.status?.toUpperCase() === "COMPLETED") ||
    //   (activeTab === "Featured" && c.isFeatured);
    const tabMatch =
      (activeTab === "All" && c.isActive) ||

      (activeTab === "Active" &&
        c.isActive &&
        c.status?.toUpperCase() === "APPROVED") ||

      (activeTab === "Pending" &&
        c.isActive &&
        c.status?.toUpperCase() === "PENDING") ||

      (activeTab === "Draft" &&
        c.isActive &&
        c.status?.toUpperCase() === "DRAFT") ||

      (activeTab === "Completed" &&
        c.isActive &&
        c.status?.toUpperCase() === "COMPLETED") ||

      (activeTab === "Featured" &&
        c.isActive &&
        c.isFeatured) ||

      (activeTab === "Archived" &&
        !c.isActive);

    const searchMatch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.cause?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());

    return tabMatch && searchMatch;
  });
  // Calculate total products value for a campaign
  const getTotalProductsValue = (campaign: Campaign) => {
    if (!campaign.campaignProducts) return 0;
    return campaign.campaignProducts.reduce((sum, p) => sum + (p.totalAmount || p.price * p.quantity), 0);
  };

  return (
    <>
      <CreateCampaignModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchCampaigns} />
      <EditCampaignModal isOpen={showEdit} campaign={selected} onClose={() => setShowEdit(false)} onSuccess={fetchCampaigns} />
      <DeleteConfirmModal
        isOpen={showDelete}
        title={selected?.title || ""}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {toast.msg && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex gap-5 min-h-full">

        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0">
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

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 flex-wrap">
              {(["All", "Active", "Pending", "Draft", "Completed", "Featured", "Archived",] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === tab ? "bg-[#334E79] text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
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

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading && <div className="p-8 text-center text-sm text-gray-400">Loading campaigns...</div>}
            {!loading && filtered.length === 0 && <div className="p-8 text-center text-sm text-gray-400">No campaigns found</div>}

            {!loading && filtered.slice(0,).map((c) => {
              const progress = getProgress(c.raisedAmount, c.goalAmount);
              const daysLeft = getDaysLeft(c.endDate);
              const { label, color } = mapStatus(c);
              const isSelected = selected?.id === c.id;
              const productCount = c.campaignProducts?.length || 0;

              return (
                <div key={c.id} onClick={() => setSelected(c)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition border-b border-gray-50 last:border-0 ${isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
                    }`}
                >
                  <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                    {isValidUrl(c.image)
                      ? <img src={c.image || "/assets/placeholder.png"} alt={c.title} className="w-full h-full object-cover" />
                      : <span className="text-[10px] text-gray-400">No Image</span>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100">
                      {c.cause?.name || "General"}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 truncate mt-1">{c.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <FiMapPin size={10} /> {c.location}
                      {productCount > 0 && (
                        <span className="flex items-center gap-1">
                          <FiPackage size={9} /> {productCount} products
                        </span>
                      )}
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeaturedTarget(c); // ✅ FIXED
                        setFeaturedConfirmOpen(true);
                      }}
                      className={`relative w-10 h-5 rounded-full transition ${c.isFeatured ? "bg-yellow-400" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition ${c.isFeatured ? "translate-x-5" : ""
                          }`}
                      />
                    </button>
                  </div> */}

                  <div className="flex items-center gap-3 mb-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeaturedTarget(c);
                        setFeaturedConfirmOpen(true);
                      }}
                      title={c.isFeatured ? "Remove from featured" : "Mark as featured"}
                      className={`relative w-13 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${c.isFeatured
                        ? "bg-amber-400 focus:ring-amber-300"
                        : "bg-slate-200 focus:ring-slate-300"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-all duration-300 ${c.isFeatured ? "translate-x-6" : "translate-x-0"
                          }`}
                      >
                        {c.isFeatured ? (
                          <svg className="w-3 h-3 text-amber-400" viewBox="0 0 10 10" fill="currentColor">
                            <polygon points="5,1 6.2,3.8 9,4.1 7,6.1 7.5,9 5,7.5 2.5,9 3,6.1 1,4.1 3.8,3.8" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-slate-300" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="5" cy="5" r="4" />
                            <line x1="5" y1="2" x2="5" y2="5" strokeLinecap="round" />
                          </svg>
                        )}
                      </span>
                    </button>

                    {c.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <svg className="w-3 h-3" viewBox="0 0 10 10" fill="currentColor">
                          <polygon points="5,1 6.2,3.8 9,4.1 7,6.1 7.5,9 5,7.5 2.5,9 3,6.1 1,4.1 3.8,3.8" />
                        </svg>
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not featured</span>
                    )}
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
                      {c.endDate ? `${daysLeft} days left` : "No end date"}
                    </div>
                  </div>

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

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Show</span>

              <span>of {filtered.length} results</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Detail Panel with Products ── */}
        {selected && (
          <div className="w-[380px] shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto max-h-[calc(100vh-140px)] sticky top-0">

            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${mapStatus(selected).color}`}
              >
                ● {mapStatus(selected).label}
              </span>

              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <FiX size={15} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <h2 className="text-base font-bold text-gray-800">{selected.title}</h2>

              <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {isValidUrl(selected.image)
                  ? <img src={selected.image || "/assets/placeholder.png"} alt={selected.title} className="w-full h-full object-cover" />
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
                  { label: "Location", value: selected.location || "—" },
                  { label: "Products", value: selected.campaignProducts?.length || 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* ── PRODUCTS SECTION ── */}
              {selected.campaignProducts && selected.campaignProducts.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <FiPackage size={12} /> Products Needed ({selected.campaignProducts.length})
                    </p>
                    <p className="text-xs font-bold text-[#D2252B]">
                      Total: ₹{getTotalProductsValue(selected).toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selected.campaignProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {isValidUrl(product.image)
                            ? <img src={product.image || "/assets/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-400">No img</div>
                          }
                        </div>


                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400">₹{product.price.toLocaleString("en-US")} each</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-gray-800">×{product.quantity}</p>
                          <p className="text-[10px] text-[#D2252B] font-semibold">₹{product.totalAmount?.toLocaleString("en-US") || (product.price * product.quantity).toLocaleString("en-US")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* ✅ FIXED: Using formatDate helper for null safety */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400">Start Date</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">
                    {formatDate(selected.startDate)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400">End Date</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">
                    {formatDate(selected.endDate)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setPendingCampaign(selected);
                    setConfirmOpen(true);
                  }}
                  disabled={statusLoading === selected.id}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition border ${selected.status?.toUpperCase() === "APPROVED"
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


                {confirmOpen && pendingCampaign && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">

                      <h2 className="text-lg font-semibold mb-2">
                        Confirm Status Change
                      </h2>

                      <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to change this campaign status?
                      </p>

                      <div className="flex justify-end gap-3">
                        {/* Cancel */}
                        <button
                          onClick={() => {
                            setConfirmOpen(false);
                            setPendingCampaign(null);
                          }}
                          className="px-4 py-2 text-sm border rounded-lg"
                        >
                          Cancel
                        </button>

                        {/* Confirm */}
                        <button
                          onClick={async () => {
                            await handleStatusToggle(pendingCampaign);
                            setConfirmOpen(false);
                            setPendingCampaign(null);
                          }}
                          className="px-4 py-2 text-sm bg-black text-white rounded-lg"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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

      {featuredConfirmOpen && featuredTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">
              {featuredTarget.isFeatured
                ? "Remove from Featured?"
                : "Mark as Featured?"}
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              {featuredTarget.isFeatured
                ? "This campaign will be removed from featured section."
                : "This campaign will appear in featured section."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setFeaturedConfirmOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={() => handleFeaturedToggle(featuredTarget)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}