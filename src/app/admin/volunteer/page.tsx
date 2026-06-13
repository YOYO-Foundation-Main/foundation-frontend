// "use client";

// import { useEffect, useState } from "react";

// import {
//     getAllVolunteers,
//     getVolunteerStats,
//     updateVolunteerStatus,
//     deleteVolunteer,
// } from "@/features/admin/api/admin.api";

// import Link from "next/link";

// export default function VolunteersPage() {

//     const [loading, setLoading] =
//         useState(true);

//     const [volunteers, setVolunteers] =
//         useState([]);

//     const [stats, setStats] =
//         useState<any>(null);

//     const [search, setSearch] =
//         useState("");

//     const [status, setStatus] =
//         useState("");

//     const loadData = async () => {

//         try {

//             setLoading(true);

//             const [
//                 volunteersRes,
//                 statsRes,
//             ] = await Promise.all([
//                 getAllVolunteers(
//                     1,
//                     20,
//                     search,
//                     status
//                 ),
//                 getVolunteerStats(),
//             ]);

//             setVolunteers(
//                 volunteersRes.data || []
//             );

//             setStats(statsRes);

//         } finally {

//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadData();
//     }, [search, status]);

//     const handleStatus = async (
//         id: number,
//         newStatus:
//             | "APPROVED"
//             | "REJECTED"
//     ) => {

//         await updateVolunteerStatus(
//             id,
//             newStatus
//         );

//         loadData();
//     };

//     const handleDelete =
//         async (id: number) => {

//             const confirmed =
//                 window.confirm(
//                     "Delete volunteer?"
//                 );

//             if (!confirmed) return;

//             await deleteVolunteer(id);

//             loadData();
//         };

//     if (loading) {
//         return (
//             <div className="p-6">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 space-y-6">

//             {/* Stats */}
//             <div className="grid grid-cols-4 gap-4">

//                 <div className="bg-white p-5 rounded-xl border">
//                     <p>Total</p>
//                     <h2 className="text-3xl font-bold">
//                         {stats?.total || 0}
//                     </h2>
//                 </div>

//                 <div className="bg-white p-5 rounded-xl border">
//                     <p>Pending</p>
//                     <h2 className="text-3xl font-bold text-yellow-500">
//                         {stats?.pending || 0}
//                     </h2>
//                 </div>

//                 <div className="bg-white p-5 rounded-xl border">
//                     <p>Approved</p>
//                     <h2 className="text-3xl font-bold text-green-600">
//                         {stats?.approved || 0}
//                     </h2>
//                 </div>

//                 <div className="bg-white p-5 rounded-xl border">
//                     <p>Rejected</p>
//                     <h2 className="text-3xl font-bold text-red-600">
//                         {stats?.rejected || 0}
//                     </h2>
//                 </div>

//             </div>

//             {/* Filters */}

//             <div className="flex gap-4">

//                 <input
//                     placeholder="Search volunteer..."
//                     value={search}
//                     onChange={(e) =>
//                         setSearch(e.target.value)
//                     }
//                     className="border rounded-lg px-4 py-2"
//                 />

//                 <select
//                     value={status}
//                     onChange={(e) =>
//                         setStatus(e.target.value)
//                     }
//                     className="border rounded-lg px-4 py-2"
//                 >

//                     <option value="">
//                         All
//                     </option>

//                     <option value="PENDING">
//                         Pending
//                     </option>

//                     <option value="APPROVED">
//                         Approved
//                     </option>

//                     <option value="REJECTED">
//                         Rejected
//                     </option>

//                 </select>

//             </div>

//             {/* Table */}

//             <div className="bg-white rounded-xl border overflow-hidden">

//                 <table className="w-full">

//                     <thead>

//                         <tr className="border-b bg-gray-50">

//                             <th className="p-3 text-left">
//                                 Name
//                             </th>

//                             <th className="p-3 text-left">
//                                 Email
//                             </th>

//                             <th className="p-3 text-left">
//                                 Mobile
//                             </th>

//                             <th className="p-3 text-left">
//                                 City
//                             </th>

//                             <th className="p-3 text-left">
//                                 Availability
//                             </th>

//                             <th className="p-3 text-left">
//                                 Status
//                             </th>

//                             <th className="p-3 text-left">
//                                 Applied
//                             </th>

//                             <th className="p-3 text-left">
//                                 Actions
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {volunteers.map(
//                             (volunteer: any) => (

//                                 <tr
//                                     key={volunteer.id}
//                                     className="border-b"
//                                 >

//                                     <td className="p-3">
//                                         {volunteer.fullName}
//                                     </td>

//                                     <td className="p-3">
//                                         {volunteer.email}
//                                     </td>

//                                     <td className="p-3">
//                                         {volunteer.mobile}
//                                     </td>

//                                     <td className="p-3">
//                                         {volunteer.city}
//                                     </td>

//                                     <td className="p-3">
//                                         {volunteer.availability}
//                                     </td>

//                                     <td className="p-3">
//                                         {volunteer.status}
//                                     </td>

//                                     <td className="p-3">
//                                         {new Date(
//                                             volunteer.createdAt
//                                         ).toLocaleDateString()}
//                                     </td>

//                                     <td className="p-3 flex gap-2">

//                                         <Link
//                                             href={`/admin/volunteer/${volunteer.id}`}
//                                             className="px-3 py-1 rounded bg-blue-500 text-white"
//                                         >
//                                             View
//                                         </Link>

//                                         <button
//                                             onClick={() =>
//                                                 handleStatus(
//                                                     volunteer.id,
//                                                     "APPROVED"
//                                                 )
//                                             }
//                                             className="px-3 py-1 rounded bg-green-600 text-white"
//                                         >
//                                             Approve
//                                         </button>

//                                         <button
//                                             onClick={() =>
//                                                 handleStatus(
//                                                     volunteer.id,
//                                                     "REJECTED"
//                                                 )
//                                             }
//                                             className="px-3 py-1 rounded bg-yellow-500 text-white"
//                                         >
//                                             Reject
//                                         </button>

//                                         <button
//                                             onClick={() =>
//                                                 handleDelete(
//                                                     volunteer.id
//                                                 )
//                                             }
//                                             className="px-3 py-1 rounded bg-red-600 text-white"
//                                         >
//                                             Delete
//                                         </button>

//                                     </td>

//                                 </tr>
//                             ))}

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     );
// }



//new page table 

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllVolunteers,
  getVolunteerStats,
  updateVolunteerStatus,
  deleteVolunteer,
} from "@/features/admin/api/admin.api";
import {
  Users, Clock, CheckCircle2, XCircle, Search, Eye,
  Check, X, Trash2, Loader2, AlertTriangle, Calendar,
  Mail, Phone, MapPin, Inbox,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    PENDING:  { bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-500" },
    APPROVED: { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500"  },
    REJECTED: { bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500"    },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, accent }: {
  label: string; value: number; icon: any; accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-0.5">{value}</h2>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM ACTION MODAL
// ─────────────────────────────────────────────────────────────────────────────
interface ConfirmState {
  type: "approve" | "reject" | "delete";
  volunteer: any;
}

function ConfirmModal({
  confirm, onClose, onConfirm, processing,
}: {
  confirm: ConfirmState | null;
  onClose: () => void;
  onConfirm: () => void;
  processing: boolean;
}) {
  if (!confirm) return null;

  const config = {
    approve: {
      title: "Approve Volunteer",
      message: `Are you sure you want to approve "${confirm.volunteer.fullName}"? They will be notified of their approval.`,
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      iconBg: "bg-green-100",
      confirmLabel: "Approve",
      confirmClass: "bg-green-600 hover:bg-green-700",
    },
    reject: {
      title: "Reject Volunteer",
      message: `Are you sure you want to reject "${confirm.volunteer.fullName}"? This action can be reversed later.`,
      icon: <XCircle className="h-6 w-6 text-yellow-600" />,
      iconBg: "bg-yellow-100",
      confirmLabel: "Reject",
      confirmClass: "bg-yellow-500 hover:bg-yellow-600",
    },
    delete: {
      title: "Delete Volunteer",
      message: `Are you sure you want to permanently delete "${confirm.volunteer.fullName}"? This action cannot be undone.`,
      icon: <AlertTriangle className="h-6 w-6 text-[#D2252B]" />,
      iconBg: "bg-red-100",
      confirmLabel: "Delete",
      confirmClass: "bg-[#D2252B] hover:bg-[#b81e23]",
    },
  }[confirm.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{config.message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={processing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 ${config.confirmClass}`}
          >
            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function VolunteersPage() {
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [volunteersRes, statsRes] = await Promise.all([
        getAllVolunteers(1, 20, search, status),
        getVolunteerStats(),
      ]);

      setVolunteers(volunteersRes.data || []);
      setStats(statsRes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const openConfirm = (type: ConfirmState["type"], volunteer: any) => {
    setConfirm({ type, volunteer });
  };

  const closeConfirm = () => {
    if (processing) return;
    setConfirm(null);
  };

  const handleConfirm = async () => {
    if (!confirm) return;

    try {
      setProcessing(true);

      if (confirm.type === "approve") {
        await updateVolunteerStatus(confirm.volunteer.id, "APPROVED");
      } else if (confirm.type === "reject") {
        await updateVolunteerStatus(confirm.volunteer.id, "REJECTED");
      } else if (confirm.type === "delete") {
        await deleteVolunteer(confirm.volunteer.id);
      }

      await loadData();
      setConfirm(null);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#D2252B] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
        <p className="text-sm text-gray-500 mt-1">Manage volunteer applications and review their status</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={stats?.total || 0} icon={Users} accent="bg-[#D2252B]/10 text-[#D2252B]" />
        <StatCard label="Pending Review"      value={stats?.pending || 0} icon={Clock} accent="bg-yellow-100 text-yellow-600" />
        <StatCard label="Approved"            value={stats?.approved || 0} icon={CheckCircle2} accent="bg-green-100 text-green-600" />
        <StatCard label="Rejected"            value={stats?.rejected || 0} icon={XCircle} accent="bg-red-100 text-red-600" />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition cursor-pointer focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10 sm:w-48"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* ── Table (desktop) ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden lg:block">
        {volunteers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Availability</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Applied</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer: any) => (
                  <tr key={volunteer.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#D2252B]/10 flex items-center justify-center text-[#D2252B] font-semibold text-sm shrink-0">
                          {volunteer.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{volunteer.fullName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{volunteer.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{volunteer.mobile}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm text-gray-700">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />{volunteer.city}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{volunteer.availability || "—"}</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={volunteer.status} />
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(volunteer.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/volunteer/${volunteer.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                        <button
                          onClick={() => openConfirm("approve", volunteer)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => openConfirm("reject", volunteer)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold hover:bg-yellow-100 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => openConfirm("delete", volunteer)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-[#D2252B] text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Cards (mobile / tablet) ── */}
      <div className="lg:hidden space-y-3">
        {volunteers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <EmptyState />
          </div>
        ) : (
          volunteers.map((volunteer: any) => (
            <div key={volunteer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#D2252B]/10 flex items-center justify-center text-[#D2252B] font-semibold text-sm shrink-0">
                    {volunteer.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{volunteer.fullName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(volunteer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={volunteer.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3 shrink-0" />{volunteer.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" />{volunteer.mobile}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" />{volunteer.city}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 shrink-0" />{volunteer.availability || "—"}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <Link
                  href={`/admin/volunteer/${volunteer.id}`}
                  className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </Link>
                <button
                  onClick={() => openConfirm("approve", volunteer)}
                  className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={() => openConfirm("reject", volunteer)}
                  className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold hover:bg-yellow-100 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
                <button
                  onClick={() => openConfirm("delete", volunteer)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-[#D2252B] text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        confirm={confirm}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        processing={processing}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Inbox className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">No volunteers found</h3>
      <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
    </div>
  );
}
