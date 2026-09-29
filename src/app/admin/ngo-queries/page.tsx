"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle,
  Clock,
  Eye,
  Headphones,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminSupportTicket,
  getAdminSupportTickets,
  replyToAdminSupportTicket,
  resolveAdminSupportTicket,
  type SupportTicket,
  type TicketStatus,
} from "@/features/admin/api/admin.api";

/* ---------- helpers ---------- */

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const getErrorMessage = (err: unknown, fallback: string) => {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message || e?.message || fallback;
};

function StatusBadge({ status }: { status: TicketStatus }) {
  const resolved = status === "RESOLVED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${
        resolved
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {resolved ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      {resolved ? "RESOLVED" : "IN PROGRESS"}
    </span>
  );
}

function NgoAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const [failed, setFailed] = useState(false);
  if (logoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        onError={() => setFailed(true)}
        className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D2252B]/10 text-[#D2252B]">
      <Building2 className="h-4 w-4" />
    </div>
  );
}

/* ---------- confirm modal ---------- */

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#D2252B]/10 text-[#D2252B]">
          <CheckCircle className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1.5 text-sm text-gray-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D2252B] focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D2252B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b81f25] focus:outline-none focus:ring-2 focus:ring-[#D2252B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Resolving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- detail drawer ---------- */

function TicketDrawer({
  ticket,
  loading,
  reply,
  sending,
  onReplyChange,
  onSend,
  onResolve,
  onClose,
}: {
  ticket: SupportTicket;
  loading: boolean;
  reply: string;
  sending: boolean;
  onReplyChange: (v: string) => void;
  onSend: () => void;
  onResolve: () => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = ticket.messages ?? [];
  const isOpen = ticket.status === "IN_PROGRESS";

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} aria-hidden="true" />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">{ticket.ticketNumber}</span>
              <StatusBadge status={ticket.status} />
            </div>
            <h2 className="mt-1.5 text-lg font-semibold leading-snug text-gray-900">
              {ticket.subject}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D2252B]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* meta */}
        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 bg-gray-50/60 px-5 py-4 text-sm">
          <div className="col-span-2 flex items-center gap-3">
            <NgoAvatar name={ticket.ngo.ngoName} logoUrl={ticket.ngo.logoUrl} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{ticket.ngo.ngoName}</p>
              <p className="truncate text-gray-500">{ticket.user.email}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Category</p>
            <p className="mt-0.5 font-medium text-gray-800">{ticket.category}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Created</p>
            <p className="mt-0.5 font-medium text-gray-800">{formatDate(ticket.createdAt)}</p>
          </div>
          {ticket.resolvedAt && (
            <div className="col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Resolved</p>
              <p className="mt-0.5 font-medium text-green-700">
                {formatDateTime(ticket.resolvedAt)}
              </p>
            </div>
          )}
        </div>

        {/* conversation */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <MessageSquare className="h-4 w-4" />
            Conversation
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          </div>

          {messages.length === 0 && !loading && (
            <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
              No messages yet.
            </p>
          )}

          {messages.map((m) => {
            const isAdmin = m.senderType === "ADMIN";
            return (
              <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl border px-4 py-3 shadow-sm ${
                    isAdmin
                      ? "border-[#D2252B]/20 bg-[#D2252B]/5"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-6">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isAdmin ? "text-[#D2252B]" : "text-gray-600"
                      }`}
                    >
                      {isAdmin ? "ADMIN" : "NGO"}
                    </span>
                    <span className="text-xs text-gray-400">{formatDateTime(m.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
                    {m.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="border-t border-gray-100 bg-white px-5 py-4">
          {isOpen ? (
            <div className="space-y-3">
              <textarea
                value={reply}
                onChange={(e) => onReplyChange(e.target.value)}
                rows={3}
                placeholder="Write your response..."
                disabled={sending}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-[#D2252B] focus:outline-none focus:ring-2 focus:ring-[#D2252B]/30 disabled:bg-gray-50"
              />
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onResolve}
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D2252B] focus:ring-offset-2 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Resolve Ticket
                </button>
                <button
                  type="button"
                  onClick={onSend}
                  disabled={sending || !reply.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D2252B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b81f25] focus:outline-none focus:ring-2 focus:ring-[#D2252B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {sending ? "Sending..." : "Send Response"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              This ticket has been resolved. Replies are closed.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ---------- page ---------- */

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resolving, setResolving] = useState(false);

  const sendingRef = useRef(false);
  const resolvingRef = useRef(false);
  const selectedIdRef = useRef<number | null>(null);

  const loadTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getAdminSupportTickets();
      setTickets(data);
      if (isRefresh) toast.success("Tickets refreshed");
    } catch (err) {
      console.error("Failed to load support tickets", err);
      setError(getErrorMessage(err, "Unable to load support tickets."));
      if (isRefresh) toast.error("Unable to refresh tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // lock body scroll while drawer is open + Escape to close
  useEffect(() => {
    if (!selected) return;
    document.body.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmOpen) closeTicket();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, confirmOpen]);

  const upsertTicket = useCallback((t: SupportTicket) => {
    setTickets((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...t } : x)));
    setSelected((prev) => (prev && prev.id === t.id ? { ...prev, ...t } : prev));
  }, []);

  const openTicket = async (ticket: SupportTicket) => {
    setSelected(ticket);
    selectedIdRef.current = ticket.id;
    setReply("");
    setDetailLoading(true);
    try {
      const full = await getAdminSupportTicket(ticket.id);
      if (full && selectedIdRef.current === ticket.id) upsertTicket(full);
    } catch (err) {
      console.error("Failed to load ticket detail", err);
      toast.error("Could not load the latest conversation");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeTicket = () => {
    selectedIdRef.current = null;
    setSelected(null);
    setReply("");
    setConfirmOpen(false);
  };

  const handleSend = async () => {
    if (!selected || sendingRef.current) return;
    const message = reply.trim();
    if (!message) {
      toast.error("Please write a response before sending");
      return;
    }
    sendingRef.current = true;
    setSending(true);
    try {
      await replyToAdminSupportTicket(selected.id, message);
      setReply("");
      const full = await getAdminSupportTicket(selected.id);
      if (full) upsertTicket(full);
      toast.success("Response sent");
    } catch (err) {
      console.error("Failed to send reply", err);
      toast.error(getErrorMessage(err, "Failed to send response"));
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const handleResolve = async () => {
    if (!selected || resolvingRef.current) return;
    resolvingRef.current = true;
    setResolving(true);
    const id = selected.id;
    try {
      await resolveAdminSupportTicket(id);
      try {
        const full = await getAdminSupportTicket(id);
        if (full) upsertTicket(full);
      } catch {
        upsertTicket({
          ...selected,
          status: "RESOLVED",
          resolvedAt: new Date().toISOString(),
        });
      }
      setConfirmOpen(false);
      toast.success("Ticket resolved");
    } catch (err) {
      console.error("Failed to resolve ticket", err);
      toast.error(getErrorMessage(err, "Failed to resolve ticket"));
    } finally {
      resolvingRef.current = false;
      setResolving(false);
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.category).filter(Boolean))).sort(),
    [tickets]
  );

  const stats = useMemo(() => {
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
    return {
      total: tickets.length,
      inProgress,
      resolved: tickets.length - inProgress,
    };
  }, [tickets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
      if (!q) return true;
      return [t.ticketNumber, t.ngo?.ngoName, t.user?.email, t.category, t.subject]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [tickets, search, statusFilter, categoryFilter]);

  const summaryCards = [
    { label: "Total Tickets", value: stats.total, icon: MessageSquare, tone: "bg-[#D2252B]/10 text-[#D2252B]" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, tone: "bg-amber-50 text-amber-600" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, tone: "bg-green-50 text-green-600" },
  ];

  const hasFilters = search.trim() !== "" || statusFilter !== "ALL" || categoryFilter !== "ALL";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D2252B] text-white shadow-sm">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Help &amp; Support</h1>
            <p className="text-sm text-gray-500">Manage and respond to support requests from NGOs.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => loadTickets(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D2252B] focus:ring-offset-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              {loading ? (
                <div className="mt-1 h-7 w-12 animate-pulse rounded bg-gray-100" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-[#D2252B] focus:outline-none focus:ring-2 focus:ring-[#D2252B]/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | TicketStatus)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#D2252B] focus:outline-none focus:ring-2 focus:ring-[#D2252B]/30"
        >
          <option value="ALL">All Status</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#D2252B] focus:outline-none focus:ring-2 focus:ring-[#D2252B]/30"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* list */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Support Tickets</h2>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-4">
                <div className="h-4 w-20 rounded bg-gray-100" />
                <div className="h-9 w-9 rounded-full bg-gray-100" />
                <div className="h-4 flex-1 rounded bg-gray-100" />
                <div className="hidden h-4 w-24 rounded bg-gray-100 md:block" />
                <div className="h-6 w-24 rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D2252B]/10 text-[#D2252B]">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
              Unable to load support tickets.
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={() => loadTickets()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D2252B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b81f25] focus:outline-none focus:ring-2 focus:ring-[#D2252B] focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
              {hasFilters ? "No matching tickets" : "No support tickets"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "There are currently no support requests from NGOs."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                }}
                className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D2252B]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Ticket</th>
                    <th className="px-5 py-3 font-semibold">NGO</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Subject</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => openTicket(t)}
                      className="cursor-pointer transition-colors hover:bg-gray-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                        {t.ticketNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <NgoAvatar name={t.ngo.ngoName} logoUrl={t.ngo.logoUrl} />
                          <span className="max-w-[10rem] truncate font-medium text-gray-800">
                            {t.ngo.ngoName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          {t.category}
                        </span>
                      </td>
                      <td className="max-w-xs px-5 py-4 text-gray-700">
                        <p className="truncate">{t.subject}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTicket(t);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#D2252B] hover:text-[#D2252B] focus:outline-none focus:ring-2 focus:ring-[#D2252B]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => openTicket(t)}
                  className="block w-full space-y-3 px-4 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-900">{t.ticketNumber}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-sm font-medium text-gray-800">{t.subject}</p>
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                    <span className="flex min-w-0 items-center gap-2">
                      <NgoAvatar name={t.ngo.ngoName} logoUrl={t.ngo.logoUrl} />
                      <span className="truncate">{t.ngo.ngoName}</span>
                    </span>
                    <span className="shrink-0">{formatDate(t.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
              Showing {filtered.length} of {tickets.length} tickets
            </div>
          </>
        )}
      </div>

      {selected && (
        <TicketDrawer
          ticket={selected}
          loading={detailLoading}
          reply={reply}
          sending={sending}
          onReplyChange={setReply}
          onSend={handleSend}
          onResolve={() => setConfirmOpen(true)}
          onClose={closeTicket}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Resolve this support ticket?"
        description="This will mark the ticket as resolved and close the active support request."
        confirmLabel="Resolve Ticket"
        loading={resolving}
        onConfirm={handleResolve}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}