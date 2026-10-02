"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Globe,
  Mail,
  Phone,
  User,
  Building2,
  Tag,
  Shield,
  AlertTriangle,
  CalendarDays,
  ExternalLink,
  Briefcase,
  Package,
  Star,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminGetEventById,
  adminApproveEvent,
  adminRejectEvent,
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

interface EventUser {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: string;
}

interface EventRegistration {
  id: number;
  eventId: number;
  userId: number;
  volunteerId: number;
  status: string;
  cancellationReason?: string | null;
  joinedAt: string;
  updatedAt: string;
  attendanceStatus: string;
  attendanceMarkedAt?: string | null;
  attendanceMarkedBy?: number | null;
}

interface EventReview {
  id: number;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

interface AdminEventDetail {
  id: number;
  ngoId?: number;
  createdBy?: number;
  userId?: number;
  organizerName?: string;
  organizerLogo?: string | null;
  contactPerson?: string;
  contactDesignation?: string;
  contactEmail?: string;
  contactPhone?: string;
  title: string;
  description?: string;
  image?: string | null;
  category: string;
  causeId?: number;
  eventDate: string;
  registrationDeadline?: string | null;
  timeZone?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  googleMapsLink?: string | null;
  benefits?: string;
  requiredSkills?: string[];
  responsibilities?: string[];
  volunteerBenefits?: string[];
  thingsToBring?: string[];
  externalLink?: string | null;
  volunteersNeeded: number;
  volunteerSafetyAgreement?: boolean;
  emergencyInfoUsage?: boolean;
  platformPolicyAgreement?: boolean;
  customTerms?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  approvedBy?: number | null;
  rejectedAt?: string | null;
  rejectedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  cause?: EventCause;
  ngo?: EventNgo;
  user?: EventUser;
  registrations?: EventRegistration[];
  reviews?: EventReview[];
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDateTime(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */

function StatusBadge({ status }: { status: AdminEventDetail["status"] }) {
  const cfg = {
    PENDING:  { cls: "bg-amber-50 text-amber-700 border-amber-200",         icon: <Clock className="h-3 w-3" />,         label: "Pending Approval" },
    APPROVED: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200",   icon: <CheckCircle2 className="h-3 w-3" />,  label: "Approved" },
    REJECTED: { cls: "bg-red-50 text-red-600 border-red-200",               icon: <XCircle className="h-3 w-3" />,       label: "Rejected" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   APPROVE MODAL
───────────────────────────────────────────── */

function ApproveModal({
  event, onClose, onDone,
}: { event: AdminEventDetail; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    try {
      setBusy(true);
      await adminApproveEvent(event.id);
      toast.success("Event approved — now live on the website");
      onDone();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to approve");
    } finally { setBusy(false); }
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
            <p className="text-xs text-slate-400 mt-0.5">Once approved, this event will become live on the public website.</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-800 bg-slate-50 rounded-xl px-4 py-3 mb-5 border border-slate-200 line-clamp-2">
          {event.title}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition">Cancel</button>
          <button onClick={handle} disabled={busy} className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 transition">
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

function RejectModal({
  event, onClose, onDone,
}: { event: AdminEventDetail; onClose: () => void; onDone: () => void }) {
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
      toast.error(e instanceof Error ? e.message : "Failed to reject");
    } finally { setBusy(false); }
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
        <p className="text-sm font-semibold text-slate-700 mb-3 line-clamp-2">{event.title}</p>
        <textarea autoFocus rows={4} placeholder="Enter rejection reason…"
          value={reason}
          onChange={(e) => { setReason(e.target.value); setErr(""); }}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#D2252B] focus:bg-white focus:ring-2 focus:ring-red-100 transition"
        />
        {err && <p className="mt-1.5 text-xs text-red-500 font-medium">{err}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition">Cancel</button>
          <button onClick={handle} disabled={busy} className="flex items-center gap-2 rounded-xl bg-[#D2252B] hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 transition">
            {busy ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Rejecting…</> : <><XCircle className="h-3.5 w-3.5" /> Reject Event</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION CARD WRAPPER
───────────────────────────────────────────── */

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">{icon}</div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFO ROW
───────────────────────────────────────────── */

function InfoRow({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 pt-0.5 w-32 shrink-0">{label}</span>
      <span className={`text-sm text-slate-700 flex-1 ${mono ? "font-mono" : "font-medium"}`}>{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BADGE CHIP
───────────────────────────────────────────── */

function Chip({ label, accent }: { label: string; accent?: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${accent ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ATTENDANCE BADGE
───────────────────────────────────────────── */

function AttendanceBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    PRESENT:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    ABSENT:     "bg-red-50 text-red-600 border-red-200",
    NOT_MARKED: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cfg[status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

/* ─────────────────────────────────────────────
   REGISTRATION STATUS BADGE
───────────────────────────────────────────── */

function RegStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    REGISTERED:  "bg-blue-50 text-blue-700 border-blue-200",
    CANCELLED:   "bg-red-50 text-red-600 border-red-200",
    ATTENDED:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cfg[status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-64 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-56 bg-slate-200 rounded-2xl" />
        </div>
        <div className="space-y-5">
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN DETAIL PAGE
───────────────────────────────────────────── */

export default function AdminEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params?.id);

  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen]   = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!eventId || isNaN(eventId)) return;
    try {
      setLoading(true);
      setError("");
      const res = await adminGetEventById(eventId);
      const data: AdminEventDetail = res?.data ?? res;
      setEvent(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load event";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  /* ── After approve/reject, refresh ── */
  const handleActionDone = () => { fetchEvent(); };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
        </div>
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-[#D2252B]" />
        </div>
        <p className="text-base font-bold text-slate-800">Unable to load event</p>
        <p className="text-sm text-slate-400 max-w-xs">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button onClick={fetchEvent} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-red-700 transition">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const regCount = event.registrations?.length ?? 0;
  const remaining = Math.max(0, event.volunteersNeeded - regCount);
  const isPending  = event.status === "PENDING";
  const isApproved = event.status === "APPROVED";
  const isRejected = event.status === "REJECTED";

  return (
    <>
      {approveOpen && <ApproveModal event={event} onClose={() => setApproveOpen(false)} onDone={handleActionDone} />}
      {rejectOpen  && <RejectModal  event={event} onClose={() => setRejectOpen(false)}  onDone={handleActionDone} />}

      <div className="max-w-7xl mx-auto pb-10 space-y-6">

        {/* ── Back + actions bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            {isPending && (
              <>
                <button
                  onClick={() => setRejectOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-[#D2252B] text-sm font-bold hover:bg-red-100 transition"
                >
                  <XCircle className="h-4 w-4" /> Reject Event
                </button>
                <button
                  onClick={() => setApproveOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve Event
                </button>
              </>
            )}
            {isApproved && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold">
                <CheckCircle2 className="h-4 w-4" />
                Approved · Live on website
              </div>
            )}
            {isRejected && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
                <XCircle className="h-4 w-4" /> Rejected
              </div>
            )}
          </div>
        </div>

        {/* ── Hero card ── */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg min-h-[260px]">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-72 object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-72 bg-gradient-to-br from-slate-800 to-slate-700" />
          )}
          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StatusBadge status={event.status} />
              {event.status === "APPROVED" && event.isActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                </span>
              )}
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold border border-white/30">
                {event.category}
              </span>
              {event.cause && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold border border-white/30">
                  {event.cause.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/75">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{fmtDate(event.eventDate)}</span>
              {event.startTime && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</span>}
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{event.volunteersNeeded} volunteers needed</span>
            </div>
          </div>
        </div>

        {/* ── Rejection reason banner ── */}
        {isRejected && event.rejectionReason && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
            <AlertTriangle className="h-5 w-5 text-[#D2252B] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-600 leading-relaxed">{event.rejectionReason}</p>
              {event.rejectedAt && (
                <p className="text-xs text-red-400 mt-1.5">Rejected on {fmtDate(event.rejectedAt)}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT / MAIN COL ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Description */}
            {event.description && (
              <Section title="About This Event" icon={<CalendarDays className="h-4 w-4" />}>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{event.description}</p>
              </Section>
            )}

            {/* Event details */}
            <Section title="Event Details" icon={<Calendar className="h-4 w-4" />}>
              <div className="space-y-3">
                <InfoRow label="Event Date"     value={fmtDate(event.eventDate)} />
                <InfoRow label="Start Time"     value={event.startTime} />
                <InfoRow label="End Time"       value={event.endTime} />
                <InfoRow label="Time Zone"      value={event.timeZone} />
                <InfoRow label="Reg. Deadline"  value={event.registrationDeadline ? fmtDateTime(event.registrationDeadline) : null} />
                <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
                  <InfoRow label="Venue"        value={event.venueName} />
                  <InfoRow label="Address"      value={event.address} />
                  <InfoRow label="City"         value={event.city} />
                  <InfoRow label="State"        value={event.state} />
                  <InfoRow label="Pincode"      value={event.pincode} />
                  <InfoRow label="Location"     value={event.location} />
                </div>
                {event.googleMapsLink && (
                  <a href={event.googleMapsLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition mt-1">
                    <Globe className="h-3.5 w-3.5" /> View on Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Section>

            {/* Volunteer information */}
            <Section title="Volunteer Information" icon={<Users className="h-4 w-4" />}>
              {/* Capacity */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Needed",      value: event.volunteersNeeded, color: "text-blue-600",    bg: "bg-blue-50" },
                  { label: "Registered",  value: regCount,               color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Remaining",   value: remaining,              color: remaining === 0 ? "text-red-600" : "text-amber-600", bg: remaining === 0 ? "bg-red-50" : "bg-amber-50" },
                ].map((c) => (
                  <div key={c.label} className={`rounded-xl ${c.bg} p-3 text-center`}>
                    <p className={`text-xl font-extrabold ${c.color}`}>{c.value}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {(event.requiredSkills ?? []).length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {event.requiredSkills!.map((s) => <Chip key={s} label={s} accent="bg-blue-50 text-blue-700 border-blue-200" />)}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {(event.responsibilities ?? []).length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Responsibilities</p>
                  <ul className="space-y-1.5">
                    {event.responsibilities!.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {(event.volunteerBenefits ?? []).length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Volunteer Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {event.volunteerBenefits!.map((b) => <Chip key={b} label={b} accent="bg-emerald-50 text-emerald-700 border-emerald-200" />)}
                  </div>
                </div>
              )}

              {/* Things to bring */}
              {(event.thingsToBring ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Things to Bring</p>
                  <ul className="space-y-1.5">
                    {event.thingsToBring!.map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* External link */}
              {event.externalLink && (
                <a href={event.externalLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D2252B] hover:underline mt-4">
                  <ExternalLink className="h-3.5 w-3.5" /> Event External Link
                </a>
              )}
            </Section>

            {/* Registrations */}
            <Section
              title={`Registrations (${regCount})`}
              icon={<Users className="h-4 w-4" />}
            >
              {regCount === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No registrations yet</p>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["#", "Reg. ID", "Status", "Joined", "Attendance"].map((h) => (
                            <th key={h} className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider pb-2 pr-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {event.registrations!.map((reg, i) => (
                          <tr key={reg.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 pr-4 text-xs text-slate-400">{i + 1}</td>
                            <td className="py-3 pr-4 text-xs font-mono text-slate-600">#{reg.id}</td>
                            <td className="py-3 pr-4"><RegStatusBadge status={reg.status} /></td>
                            <td className="py-3 pr-4 text-xs text-slate-500">{fmtDate(reg.joinedAt)}</td>
                            <td className="py-3"><AttendanceBadge status={reg.attendanceStatus} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-2">
                    {event.registrations!.map((reg, i) => (
                      <div key={reg.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Registration #{reg.id}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Joined {fmtDate(reg.joinedAt)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <RegStatusBadge status={reg.status} />
                          <AttendanceBadge status={reg.attendanceStatus} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Section>

            {/* Reviews */}
            <Section title={`Reviews (${(event.reviews ?? []).length})`} icon={<Star className="h-4 w-4" />}>
              {(event.reviews ?? []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No reviews yet</p>
              ) : (
                <div className="space-y-3">
                  {event.reviews!.map((rev) => (
                    <div key={rev.id} className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
                      {rev.rating !== undefined && (
                        <div className="flex items-center gap-0.5 mb-1">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`h-3.5 w-3.5 ${s <= rev.rating! ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                          ))}
                        </div>
                      )}
                      {rev.comment && <p className="text-sm text-slate-600">{rev.comment}</p>}
                      {rev.createdAt && <p className="text-[10px] text-slate-400 mt-1">{fmtDate(rev.createdAt)}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Organizer */}
            <Section title="Organizer" icon={<Building2 className="h-4 w-4" />}>
              <div className="flex items-center gap-3 mb-4">
                {event.organizerLogo ? (
                  <img src={event.organizerLogo} alt={event.organizerName ?? "NGO"} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-800 text-sm">{event.ngo?.ngoName ?? event.organizerName ?? "—"}</p>
                  {event.organizerName && event.ngo?.ngoName !== event.organizerName && (
                    <p className="text-xs text-slate-400">{event.organizerName}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                {event.contactPerson && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-semibold">{event.contactPerson}</p>
                      {event.contactDesignation && <p className="text-slate-400">{event.contactDesignation}</p>}
                    </div>
                  </div>
                )}
                {event.contactEmail && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.contactEmail}</span>
                  </div>
                )}
                {event.contactPhone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{event.contactPhone}</span>
                  </div>
                )}
              </div>
              {event.user && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted by</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                      {event.user.name.trim().split(" ").map((w) => w[0].toUpperCase()).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{event.user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{event.user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            {/* Status & Approval info */}
            <Section title="Status & Approval" icon={<Shield className="h-4 w-4" />}>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Current Status</p>
                  <StatusBadge status={event.status} />
                </div>
                <InfoRow label="Created"   value={fmtDateTime(event.createdAt)} />
                <InfoRow label="Updated"   value={fmtDateTime(event.updatedAt)} />
                {event.approvedAt && <InfoRow label="Approved"  value={fmtDateTime(event.approvedAt)} />}
                {event.rejectedAt && <InfoRow label="Rejected"  value={fmtDateTime(event.rejectedAt)} />}
                {event.rejectionReason && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Rejection Reason</p>
                    <p className="text-xs text-red-600 leading-relaxed">{event.rejectionReason}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* Terms & Safety */}
            <Section title="Terms & Safety" icon={<Shield className="h-4 w-4" />}>
              <div className="space-y-2">
                {[
                  { label: "Volunteer safety agreement",   val: event.volunteerSafetyAgreement },
                  { label: "Emergency information usage",  val: event.emergencyInfoUsage },
                  { label: "Platform policy agreement",    val: event.platformPolicyAgreement },
                ].map(({ label, val }) => val !== undefined ? (
                  <div key={label} className={`flex items-center gap-2 text-xs rounded-xl px-3 py-2 ${val ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    {val
                      ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      : <XCircle     className="h-3.5 w-3.5 shrink-0" />
                    }
                    <span className="capitalize">{label}</span>
                  </div>
                ) : null)}
                {event.customTerms && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Custom Terms</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{event.customTerms}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* Benefits (string field) */}
            {event.benefits && (
              <Section title="Benefits" icon={<Briefcase className="h-4 w-4" />}>
                <p className="text-sm text-slate-600 leading-relaxed">{event.benefits}</p>
              </Section>
            )}

            {/* Quick meta */}
            <Section title="Quick Info" icon={<Tag className="h-4 w-4" />}>
              <div className="space-y-2.5">
                <InfoRow label="Category"  value={event.category} />
                <InfoRow label="Cause"     value={event.cause?.name} />
                <InfoRow label="Event ID"  value={`#${event.id}`} mono />
              </div>
            </Section>

          </div>
        </div>
      </div>
    </>
  );
}
