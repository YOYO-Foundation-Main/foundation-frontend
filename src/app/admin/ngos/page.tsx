
"use client";
 
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  X,
  Users,
  FileText,
  MapPin,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { getAllNgos } from "@/features/admin/api/admin.api";
 
type Ngo = {
  id: number;
  ngoName: string;
  registrationType: string;
  district: string;
  state: string;
  email: string;
  mobile: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  documents: {
    id: number;
    type: string;
    status: string;
  }[];
  representatives: {
    id: number;
    fullName: string;
    designation: string;
  }[];
  bank: {
    id: number;
    bankName: string;
    status: string;
  } | null;
};
 
type Toast = {
  id: number;
  type: "error" | "success" | "warning";
  message: string;
};
 
// ─── Toast Component ────────────────────────────────────────────────────────
function ToastNotification({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);
 
  const styles = {
    error: {
      wrapper: "bg-red-50 border-red-200 text-red-800",
      icon: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
      bar: "bg-red-400",
    },
    success: {
      wrapper: "bg-green-50 border-green-200 text-green-800",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />,
      bar: "bg-green-400",
    },
    warning: {
      wrapper: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
      bar: "bg-amber-400",
    },
  };
 
  const s = styles[toast.type];
 
  return (
    <div
      className={`relative flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg overflow-hidden min-w-[300px] max-w-sm animate-in slide-in-from-right-5 ${s.wrapper}`}
    >
      {s.icon}
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
      <div
        className={`absolute bottom-0 left-0 h-0.5 w-full ${s.bar} opacity-40`}
      />
    </div>
  );
}
 
// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col gap-1 border ${color}`}
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-extrabold leading-none">{value}</p>
    </div>
  );
}
 
// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> =
    {
      VERIFIED: {
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        label: "Verified",
      },
      REJECTED: {
        cls: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="h-3.5 w-3.5" />,
        label: "Rejected",
      },
      UNDER_REVIEW: {
        cls: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        label: "Under Review",
      },
      PENDING: {
        cls: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        label: "Pending",
      },
      DRAFT: {
        cls: "bg-gray-50 text-gray-600 border-gray-200",
        icon: <Clock3 className="h-3.5 w-3.5" />,
        label: "Draft",
      },
    };
 
  const cfg = map[status] ?? {
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <Clock3 className="h-3.5 w-3.5" />,
    label: status,
  };
 
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
 
// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm animate-pulse">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <div className="h-7 w-48 rounded-lg bg-gray-100" />
            <div className="h-7 w-20 rounded-full bg-gray-100" />
            <div className="h-7 w-24 rounded-full bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-gray-100" />
                <div className="h-4 w-28 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-11 w-32 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
 
// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminNgosPage() {
  const [loading, setLoading] = useState(true);
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
 
  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };
 
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
 
  const fetchNgos = async () => {
    try {
      setLoading(true);
      const response = await getAllNgos();
      setNgos(response?.data || []);
    } catch (error: any) {
      addToast(
        "error",
        error?.message || "Failed to load NGOs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchNgos();
  }, []);
 
  const statuses = ["ALL", "VERIFIED", "PENDING", "UNDER_REVIEW", "REJECTED", "DRAFT"];
 
  const filteredNgos = ngos.filter((ngo) => {
    const matchesSearch = ngo.ngoName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || ngo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
 
  const stats = [
    {
      label: "Total NGOs",
      value: ngos.length,
      color: "border-orange-100 bg-orange-50 text-orange-700",
    },
    {
      label: "Verified",
      value: ngos.filter((n) => n.status === "VERIFIED").length,
      color: "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    {
      label: "Pending",
      value: ngos.filter(
        (n) => n.status === "PENDING" || n.status === "DRAFT"
      ).length,
      color: "border-amber-100 bg-amber-50 text-amber-700",
    },
    {
      label: "Rejected",
      value: ngos.filter((n) => n.status === "REJECTED").length,
      color: "border-red-100 bg-red-50 text-red-700",
    },
  ];
 
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">
      {/* ── Toast Container ── */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastNotification key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
 
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f97316] shadow-sm shadow-orange-200">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  NGO Verification Panel
                </h1>
                <p className="text-sm text-gray-400">
                  Manage and review NGO applications
                </p>
              </div>
            </div>
 
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((s) => (
                <StatCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  color={s.color}
                />
              ))}
            </div>
          </div>
        </div>
      </header>
 
      {/* ── Body ── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search by NGO name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
 
          {/* Refresh */}
          <button
            onClick={fetchNgos}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm hover:border-orange-300 hover:text-orange-600 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
 
        {/* Status Filter Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                statusFilter === s
                  ? "bg-[#f97316] text-white border-[#f97316] shadow-sm shadow-orange-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
 
        {/* Results Count */}
        {!loading && (
          <p className="mb-4 text-sm text-gray-400">
            {filteredNgos.length === 0
              ? "No results"
              : `Showing ${filteredNgos.length} NGO${filteredNgos.length !== 1 ? "s" : ""}`}
          </p>
        )}
 
        {/* NGO List */}
        {loading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <Building2 className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No NGOs Found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {search
                ? `No results for "${search}". Try a different search.`
                : "No NGOs match the selected filter."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-100 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-orange-200 sm:p-6"
              >
                {/* Top Row */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name + Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                        <Building2 className="h-4 w-4 text-orange-500" />
                      </div>
                      <h2 className="text-base font-bold text-gray-900 sm:text-lg truncate">
                        {ngo.ngoName}
                      </h2>
                      {ngo.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="h-3 w-3" />
                          Verified NGO
                        </span>
                      )}
                      <StatusBadge status={ngo.status} />
                    </div>
 
                    {/* Meta Info Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                          Reg. Type
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-700">
                          {ngo.registrationType}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                          Location
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-gray-700">
                          <MapPin className="h-3 w-3 text-orange-400 shrink-0" />
                          {ngo.district}, {ngo.state}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                          Documents
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-gray-700">
                          <FileText className="h-3 w-3 text-orange-400 shrink-0" />
                          {ngo.documents.length} Uploaded
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                          Representatives
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-gray-700">
                          <Users className="h-3 w-3 text-orange-400 shrink-0" />
                          {ngo.representatives.length} Added
                        </p>
                      </div>
                    </div>
 
                    {/* Contact Row */}
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                      <span>{ngo.email}</span>
                      <span>{ngo.mobile}</span>
                      {ngo.bank && (
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Bank: {ngo.bank.bankName}
                        </span>
                      )}
                    </div>
                  </div>
 
                  {/* Right — CTA */}
                  <div className="shrink-0">
                    <Link
                      href={`/admin/ngos/${ngo.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-orange-300 active:scale-95 group-hover:gap-3"
                    >
                      Review NGO
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
 
                {/* Bottom accent bar on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 rounded-b-2xl bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
 
 