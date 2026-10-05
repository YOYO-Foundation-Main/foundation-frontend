
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  Plus,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  Trash2,
  BarChart3,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminGetEvents,
  adminApproveEvent,
  adminRejectEvent,
  adminDeleteEvent,
} from "@/features/admin/api/admin.api";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

interface EventCause {
  id: number;
  name: string;
}

interface EventNgo {
  id: number;
  ngoName: string;
}

interface AdminEvent {
  id: number;
  title: string;
  description?: string;
  image?: string | null;
  category: string;
  location: string;
  city?: string;
  state?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  volunteersNeeded: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  rejectionReason?: string | null;
  organizerName?: string;
  organizerLogo?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  cause?: EventCause;
  ngo?: EventNgo;
  registrations?: { id: number }[];
  _count?: { registrations: number };
}

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function initials(name: string) {
  return name.trim().split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */

function StatusBadge({ status }: { status: AdminEvent["status"] }) {
  const cfg = {
    PENDING: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock className="h-2.5 w-2.5" />, label: "Pending" },
    APPROVED: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="h-2.5 w-2.5" />, label: "Approved" },
    REJECTED: { cls: "bg-red-50 text-red-600 border-red-200", icon: <XCircle className="h-2.5 w-2.5" />, label: "Rejected" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */

function StatCard({ label, value, icon, accent }: { label: string; value: number | string; icon: React.ReactNode; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-slate-200 rounded-xl flex-1" />
          <div className="h-8 bg-slate-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APPROVE MODAL
───────────────────────────────────────────── */

function ApproveModal({ event, onClose, onDone }: { event: AdminEvent; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    try {
      setBusy(true);
      await adminApproveEvent(event.id);
      toast.success("Event approved — now live on the website");
      onDone();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to approve event");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Approve Event?</h3>
            <p className="text-xs text-slate-400 mt-0.5">This will make the event live on the public website.</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-800 bg-slate-50 rounded-xl px-4 py-3 mb-5 border border-slate-200">
          {event.title}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">Cancel</button>
          <button onClick={handle} disabled={busy} className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60">
            {busy ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Approving…</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Approve Event</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REJECT MODAL
───────────────────────────────────────────── */

function RejectModal({ event, onClose, onDone }: { event: AdminEvent; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    const t = reason.trim();
    if (!t) { setErr("Rejection reason is required."); return; }
    try {
      setBusy(true);
      await adminRejectEvent(event.id, t);
      toast.success("Event rejected");
      onDone();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to reject event");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5 text-[#D2252B]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Reject Event</h3>
            <p className="text-xs text-slate-400 mt-0.5">Provide a reason — it will be visible to the NGO.</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-3 truncate">{event.title}</p>
        <textarea
          autoFocus rows={4} placeholder="Enter rejection reason…"
          value={reason}
          onChange={(e) => { setReason(e.target.value); setErr(""); }}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#D2252B] focus:bg-white focus:ring-2 focus:ring-red-100 transition"
        />
        {err && <p className="mt-1.5 text-xs text-red-500 font-medium">{err}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">Cancel</button>
          <button onClick={handle} disabled={busy} className="flex items-center gap-2 rounded-xl bg-[#D2252B] hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60">
            {busy ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Rejecting…</> : <><XCircle className="h-3.5 w-3.5" /> Reject Event</>}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────
   DELETE MODAL
───────────────────────────────────────────── */

function DeleteModal({
  event,
  onClose,
  onDone,
}: {
  event: AdminEvent;
  onClose: () => void;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);


  const handle = async () => {
    try {
      setBusy(true);
      setDeleteError(null);

      await adminDeleteEvent(event.id);

      toast.success("Event permanently deleted");

      onDone();
      onClose();
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Failed to delete event";

      setDeleteError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">

        <h3 className="font-bold text-slate-900 mb-2">
          Delete Event?
        </h3>

        <p className="text-sm text-slate-500 mb-1">
          This will permanently delete the event from the database.
        </p>

        <p className="text-sm font-semibold text-slate-800 mb-4 truncate">
          {event.title}
        </p>

        {/* DELETE BLOCKED MESSAGE */}
        {deleteError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700 mb-1">
              Cannot Delete Event
            </p>

            <p className="text-sm leading-5 text-red-600">
              {deleteError}
            </p>
          </div>
        )}

        {!deleteError && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs leading-5 text-amber-700">
              An active event cannot be deleted if volunteers have
              already joined it.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            {deleteError ? "Close" : "Cancel"}
          </button>

          {!deleteError && (
            <button
              onClick={handle}
              disabled={busy}
              className="flex items-center gap-2 rounded-xl bg-[#D2252B] hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 transition"
            >
              {busy && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}

              Delete Permanently
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



/* ─────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────── */

function EventCard({
  event,
  onApprove,
  onReject,
  onDelete,
  onView,
}: {
  event: AdminEvent;
  onApprove: (e: AdminEvent) => void;
  onReject: (e: AdminEvent) => void;
  onDelete: (e: AdminEvent) => void;
  onView: (e: AdminEvent) => void;
}) {
  const regCount = event.registrations?.length ?? event._count?.registrations ?? 0;
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        {event.image && !imgErr ? (
          <img src={event.image} alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarDays className="h-10 w-10 text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 left-3"><StatusBadge status={event.status} /></div>
        {event.status === "APPROVED" && event.isActive && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category tag */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{event.category}</span>
          {event.cause && <span className="text-[10px] text-slate-400 truncate">{event.cause.name}</span>}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1 leading-snug">{event.title}</h3>

        {/* Organizer */}
        <p className="text-[11px] text-slate-400 mb-3 truncate">
          {event.ngo?.ngoName ?? event.organizerName ?? "—"}
        </p>

        {/* Meta row */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
            <span>{fmtDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><Users className="h-3 w-3 text-slate-400" />{event.volunteersNeeded} needed</span>
            <span className="text-slate-300">·</span>
            <span>{regCount} registered</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onView(event)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
          >
            View <ChevronRight className="h-3 w-3" />
          </button>
          {event.status === "PENDING" && (
            <>
              <button
                onClick={() => onApprove(event)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition"
              >
                <CheckCircle2 className="h-3 w-3" /> Approve
              </button>
              <button
                onClick={() => onReject(event)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-[#D2252B] border border-red-200 text-xs font-bold hover:bg-red-100 transition"
              >
                <XCircle className="h-3 w-3" /> Reject
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(event)}
            className="flex items-center justify-center px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:text-[#D2252B] hover:bg-red-50 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [approveTarget, setApproveTarget] = useState<AdminEvent | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminGetEvents(statusFilter === "ALL" ? undefined : statusFilter);
      const raw: AdminEvent[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setEvents(raw);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load events";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  /* ── Derived ── */
  const totalPending = events.filter((e) => e.status === "PENDING").length;
  const totalApproved = events.filter((e) => e.status === "APPROVED" && e.isActive).length;
  const totalRejected = events.filter((e) => e.status === "REJECTED").length;
  const totalVolunteers = events.reduce((s, e) => s + e.volunteersNeeded, 0);
  const totalRegistrations = events.reduce(
    (s, e) => s + (e.registrations?.length ?? e._count?.registrations ?? 0),
    0
  );

  const filtered = events.filter((e) => {
    const s = search.toLowerCase();
    return (
      !s ||
      e.title.toLowerCase().includes(s) ||
      e.location.toLowerCase().includes(s) ||
      (e.cause?.name ?? "").toLowerCase().includes(s) ||
      (e.ngo?.ngoName ?? e.organizerName ?? "").toLowerCase().includes(s) ||
      e.category.toLowerCase().includes(s)
    );
  });

  const TABS: { key: StatusFilter; label: string; cls: string; active: string }[] = [
    { key: "ALL", label: "All", cls: "text-slate-500 hover:bg-slate-50", active: "bg-[#D2252B] text-white" },
    { key: "PENDING", label: "Pending", cls: "text-amber-600 hover:bg-amber-50", active: "bg-amber-500 text-white" },
    { key: "APPROVED", label: "Approved", cls: "text-emerald-600 hover:bg-emerald-50", active: "bg-emerald-600 text-white" },
    { key: "REJECTED", label: "Rejected", cls: "text-red-600 hover:bg-red-50", active: "bg-[#D2252B] text-white" },
  ];

  if (!loading && error && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-[#D2252B]" />
        </div>
        <p className="text-base font-bold text-slate-800">Unable to load events</p>
        <p className="text-sm text-slate-400 max-w-xs">{error}</p>
        <button onClick={fetchEvents} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-red-700 transition">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {approveTarget && <ApproveModal event={approveTarget} onClose={() => setApproveTarget(null)} onDone={fetchEvents} />}
      {rejectTarget && <RejectModal event={rejectTarget} onClose={() => setRejectTarget(null)} onDone={fetchEvents} />}
      {deleteTarget && <DeleteModal event={deleteTarget} onClose={() => setDeleteTarget(null)} onDone={fetchEvents} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D2252B] mb-1">Admin Panel</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage community events, NGO submissions and volunteer activities.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button onClick={fetchEvents}
            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => router.push("/admin/events/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] hover:bg-red-700 text-white text-sm font-semibold transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Events" value={events.length} icon={<CalendarDays className="h-5 w-5 text-blue-600" />} accent="bg-blue-50" />
        <StatCard label="Pending Approval" value={totalPending} icon={<Clock className="h-5 w-5 text-amber-600" />} accent="bg-amber-50" />
        <StatCard label="Approved / Live" value={totalApproved} icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} accent="bg-emerald-50" />
        <StatCard label="Rejected" value={totalRejected} icon={<XCircle className="h-5 w-5 text-red-600" />} accent="bg-red-50" />
        <StatCard label="Volunteers Needed" value={totalVolunteers.toLocaleString("en-IN")} icon={<Users className="h-5 w-5 text-violet-600" />} accent="bg-violet-50" />
      </div>

      {/* Filter tabs + Search */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setStatusFilter(t.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${statusFilter === t.key ? t.active : t.cls}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, category, NGO…"
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 placeholder:text-slate-400 shadow-sm transition" />
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 flex flex-col items-center gap-4 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <CalendarDays className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">
            {statusFilter === "PENDING" ? "No events pending approval" :
              statusFilter === "APPROVED" ? "No approved events" :
                statusFilter === "REJECTED" ? "No rejected events" :
                  search ? "No events match your search" : "No events yet"}
          </p>
          <p className="text-xs text-slate-300 max-w-xs">
            {statusFilter === "PENDING" ? "There are currently no events waiting for approval." :
              search ? "Try adjusting your search." : "Events created by NGOs will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onApprove={setApproveTarget}
              onReject={setRejectTarget}
              onDelete={setDeleteTarget}
              onView={(e) => router.push(`/admin/events/${e.id}`)}
            />
          ))}
        </div>
      )}

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-slate-400 mt-4 text-center">
          Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{" "}
          <span className="font-bold text-slate-600">{events.length}</span> events
          {search && <> · <button onClick={() => setSearch("")} className="text-[#D2252B] font-semibold hover:underline">clear search</button></>}
        </p>
      )}
    </>
  );
}

