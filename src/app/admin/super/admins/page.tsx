// "use client";

// import { useEffect, useState } from "react";
// import { Admin } from "@/features/super-admin/types/admin.types";
// import {
//     getAdmins,
//     toggleAdminStatus,
//     deleteAdmin,
// } from "@/features/super-admin/api/adminManagement.api";
// import AdminFormModal from "@/features/super-admin/components/AdminFormModal";

// export default function AdminManagementPage() {
//     const [admins, setAdmins] = useState<Admin[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [openModal, setOpenModal] = useState(false);
//     const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
//     const [mode, setMode] = useState<"create" | "edit">("create");

//     const fetchAdmins = async () => {
//         try {
//             setLoading(true);

//             const res = await getAdmins();

//             setAdmins(res.data);
//         } catch (error: any) {
//             console.error(error);
//             alert(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleStatus = async (id: number, status: boolean) => {
//         try {
//             await toggleAdminStatus(id, !status);
//             fetchAdmins();
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     const handleDelete = async (id: number) => {
//         const ok = window.confirm("Delete this admin?");
//         if (!ok) return;

//         try {
//             await deleteAdmin(id);
//             fetchAdmins();
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     useEffect(() => {
//         fetchAdmins();
//     }, []);

//     return (
//         <div className="space-y-6">

//             {/* Header */}

//             <div className="flex items-center justify-between">

//                 <div>

//                     <h1 className="text-3xl font-bold">
//                         Admin Management
//                     </h1>

//                     <p className="text-gray-500 mt-1">
//                         Manage platform administrators
//                     </p>

//                 </div>
//                 <button
//                     onClick={() => {
//                         setSelectedAdmin(null);
//                         setMode("create");
//                         setOpenModal(true);
//                     }}
//                     className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
//                 >
//                     + Create Admin
//                 </button>

//             </div>

//             {/* Table */}

//             <div className="bg-white rounded-xl shadow border overflow-hidden">

//                 <table className="w-full">

//                     <thead className="bg-gray-50">

//                         <tr className="text-left">

//                             <th className="px-5 py-3">Name</th>
//                             <th className="px-5 py-3">Email</th>
//                             <th className="px-5 py-3">Mobile</th>
//                             <th className="px-5 py-3">Role</th>
//                             <th className="px-5 py-3">Status</th>
//                             <th className="px-5 py-3">Created</th>
//                             <th className="px-5 py-3 text-center">Actions</th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {loading ? (

//                             <tr>

//                                 <td
//                                     colSpan={7}
//                                     className="text-center py-12"
//                                 >
//                                     Loading admins...
//                                 </td>

//                             </tr>

//                         ) : admins.length === 0 ? (

//                             <tr>

//                                 <td
//                                     colSpan={7}
//                                     className="text-center py-12"
//                                 >
//                                     No admins found.
//                                 </td>

//                             </tr>

//                         ) : (

//                             admins.map((admin) => (

//                                 <tr
//                                     key={admin.id}
//                                     className="border-t hover:bg-gray-50"
//                                 >

//                                     <td className="px-5 py-4 font-medium">
//                                         {admin.name}
//                                     </td>

//                                     <td className="px-5 py-4">
//                                         {admin.email}
//                                     </td>

//                                     <td className="px-5 py-4">
//                                         {admin.mobile}
//                                     </td>

//                                     <td className="px-5 py-4">
//                                         {admin.role}
//                                     </td>

//                                     <td className="px-5 py-4">
//                                         <button
//                                             onClick={() => handleStatus(admin.id, admin.isActive)}
//                                             className={`px-3 py-1 rounded-full text-xs font-medium ${admin.isActive
//                                                 ? "bg-green-100 text-green-700"
//                                                 : "bg-red-100 text-red-700"
//                                                 }`}
//                                         >
//                                             {admin.isActive ? "Active" : "Inactive"}
//                                         </button>
//                                     </td>

//                                     <td className="px-5 py-4">
//                                         {new Date(
//                                             admin.createdAt
//                                         ).toLocaleDateString()}
//                                     </td>

//                                     <td className="px-5 py-4">

//                                         <div className="flex justify-center gap-2">

//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedAdmin(admin);
//                                                     setMode("edit");
//                                                     setOpenModal(true);
//                                                 }}
//                                                 className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
//                                             >
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 onClick={() => handleDelete(admin.id)}
//                                                 className="text-red-600 hover:underline"
//                                             >
//                                                 Delete
//                                             </button>

//                                             <AdminFormModal
//                                                 open={openModal}
//                                                 onClose={() => setOpenModal(false)}
//                                                 onSuccess={fetchAdmins}
//                                                 mode={mode}
//                                                 admin={selectedAdmin}
//                                             />

//                                         </div>

//                                     </td>

//                                 </tr>

//                             ))

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiEdit2,
  FiInbox,
  FiMail,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiUserX,
  FiXCircle,
} from "react-icons/fi";
import { Admin } from "@/features/super-admin/types/admin.types";
import {
  getAdmins,
  toggleAdminStatus,
  deleteAdmin,
} from "@/features/super-admin/api/adminManagement.api";
import AdminFormModal from "@/features/super-admin/components/AdminFormModal";

type StatusFilter = "all" | "active" | "inactive";

interface ToastState {
  type: "success" | "error";
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function getInitials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRole(role: string | null | undefined): string {
  if (!role) return "Admin";
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

/* -------------------------------------------------------------------------- */
/*                               SMALL COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function Avatar({ name, active }: { name: string; active: boolean }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
        active ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400"
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

function RoleBadge({ role }: { role: string | null | undefined }) {
  return (
    <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">
      {formatRole(role)}
    </span>
  );
}

function StatusSwitch({
  active,
  disabled,
  onToggle,
  name,
}: {
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
  name: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={`${active ? "Deactivate" : "Activate"} ${name}`}
        disabled={disabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          active ? "bg-red-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            active ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className={`text-xs font-semibold ${active ? "text-red-600" : "text-gray-400"}`}>
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function IconAction({
  label,
  onClick,
  children,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
        danger
          ? "border-red-100 bg-red-50 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

function LoadingRows() {
  return (
    <div className="divide-y divide-gray-100" aria-busy="true" aria-label="Loading admins">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <SkeletonBlock className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-56" />
          </div>
          <SkeletonBlock className="hidden h-6 w-24 md:block" />
          <SkeletonBlock className="hidden h-6 w-20 md:block" />
          <SkeletonBlock className="h-9 w-20" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CONFIRM DELETE                                */
/* -------------------------------------------------------------------------- */

function ConfirmDelete({
  admin,
  busy,
  onCancel,
  onConfirm,
}: {
  admin: Admin;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <FiAlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">Delete this admin?</h3>
        <p className="mt-1.5 text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{admin.name}</span> will immediately lose access to the admin
          panel. This action cannot be undone.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            <FiTrash2 className="h-4 w-4" />
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [openModal, setOpenModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [deleting, setDeleting] = useState<Admin | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [busyIds, setBusyIds] = useState<number[]>([]);

  const [toast, setToast] = useState<ToastState | null>(null);

  const fetchAdmins = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const res = await getAdmins();
      setAdmins(Array.isArray(res?.data) ? (res.data as Admin[]) : []);
    } catch (err) {
      console.error("Failed to load admins:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchAdmins(false);
  }, [fetchAdmins]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const active = admins.filter((a) => a.isActive).length;
    return { total: admins.length, active, inactive: admins.length - active };
  }, [admins]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return admins.filter((a) => {
      if (status === "active" && !a.isActive) return false;
      if (status === "inactive" && a.isActive) return false;
      if (!q) return true;
      return `${a.name} ${a.email} ${a.mobile} ${a.role}`.toLowerCase().includes(q);
    });
  }, [admins, query, status]);

  const openCreate = () => {
    setSelectedAdmin(null);
    setMode("create");
    setOpenModal(true);
  };

  const openEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setMode("edit");
    setOpenModal(true);
  };

  const handleSaved = () => {
    setToast({
      type: "success",
      message: mode === "create" ? "Admin created successfully" : "Admin updated successfully",
    });
    void fetchAdmins(true);
  };

  const handleStatus = async (admin: Admin) => {
    const next = !admin.isActive;
    setBusyIds((ids) => [...ids, admin.id]);
    setAdmins((list) => list.map((a) => (a.id === admin.id ? { ...a, isActive: next } : a)));
    try {
      await toggleAdminStatus(admin.id, next);
      setToast({
        type: "success",
        message: next ? `${admin.name} activated` : `${admin.name} deactivated`,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      setAdmins((list) => list.map((a) => (a.id === admin.id ? { ...a, isActive: !next } : a)));
      setToast({ type: "error", message: errorMessage(err, "Could not update status") });
    } finally {
      setBusyIds((ids) => ids.filter((id) => id !== admin.id));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteAdmin(deleting.id);
      setAdmins((list) => list.filter((a) => a.id !== deleting.id));
      setToast({ type: "success", message: "Admin deleted" });
      setDeleting(null);
    } catch (err) {
      console.error("Failed to delete admin:", err);
      setToast({ type: "error", message: errorMessage(err, "Could not delete admin") });
    } finally {
      setDeleteBusy(false);
    }
  };

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "active", label: "Active", count: stats.active },
    { key: "inactive", label: "Inactive", count: stats.inactive },
  ];

  const hasData = admins.length > 0;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-stretch gap-4">
            <div className="w-1 rounded-full bg-red-600" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Super Admin</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Admin Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">Manage platform administrators and their access.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void fetchAdmins(true)}
              disabled={loading || refreshing}
              title="Refresh"
              aria-label="Refresh admins"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 sm:flex-none"
            >
              <FiPlus className="h-4 w-4" />
              Create Admin
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white sm:flex">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-gray-900">{stats.total}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white sm:flex">
              <FiUserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-red-600">{stats.active}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Active</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500 sm:flex">
              <FiUserX className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-gray-500">{stats.inactive}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Inactive</p>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setStatus(t.key)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    status === t.key
                      ? "bg-red-50 text-red-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      status === t.key ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative lg:w-80">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email or mobile"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          {loading ? (
            <LoadingRows />
          ) : error && !hasData ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Unable to load admins</h2>
              <p className="mt-1 text-sm text-gray-500">Something went wrong. Please try again.</p>
              <button
                type="button"
                onClick={() => void fetchAdmins(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                <FiRefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <FiInbox className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900">
                {hasData ? "No admins match your filters" : "No admins found"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {hasData ? "Try a different search or status filter." : "Create your first administrator to get started."}
              </p>
              {!hasData ? (
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <FiPlus className="h-4 w-4" />
                  Create Admin
                </button>
              ) : null}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-[11px] uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-3 font-semibold">Administrator</th>
                      <th className="px-5 py-3 font-semibold">Mobile</th>
                      <th className="px-5 py-3 font-semibold">Role</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Created</th>
                      <th className="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((admin) => (
                      <tr key={admin.id} className="transition-colors hover:bg-red-50/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <Avatar name={admin.name} active={admin.isActive} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900">{admin.name}</p>
                              <p className="truncate text-xs text-gray-500">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-700">{admin.mobile || "—"}</td>
                        <td className="px-5 py-4">
                          <RoleBadge role={admin.role} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusSwitch
                            active={admin.isActive}
                            disabled={busyIds.includes(admin.id)}
                            onToggle={() => void handleStatus(admin)}
                            name={admin.name}
                          />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDate(admin.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <IconAction label={`Edit ${admin.name}`} onClick={() => openEdit(admin)}>
                              <FiEdit2 className="h-4 w-4" />
                            </IconAction>
                            <IconAction label={`Delete ${admin.name}`} onClick={() => setDeleting(admin)} danger>
                              <FiTrash2 className="h-4 w-4" />
                            </IconAction>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="divide-y divide-gray-100 md:hidden">
                {filtered.map((admin) => (
                  <li key={admin.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={admin.name} active={admin.isActive} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">{admin.name}</p>
                          <div className="mt-1">
                            <RoleBadge role={admin.role} />
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <IconAction label={`Edit ${admin.name}`} onClick={() => openEdit(admin)}>
                          <FiEdit2 className="h-4 w-4" />
                        </IconAction>
                        <IconAction label={`Delete ${admin.name}`} onClick={() => setDeleting(admin)} danger>
                          <FiTrash2 className="h-4 w-4" />
                        </IconAction>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2.5">
                        <FiMail className="h-4 w-4 shrink-0 text-red-500" />
                        <span className="truncate">{admin.email}</span>
                      </p>
                      <p className="flex items-center gap-2.5">
                        <FiPhone className="h-4 w-4 shrink-0 text-red-500" />
                        {admin.mobile || "—"}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <FiCalendar className="h-4 w-4 shrink-0 text-red-500" />
                        Created {formatDate(admin.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2.5">
                      <StatusSwitch
                        active={admin.isActive}
                        disabled={busyIds.includes(admin.id)}
                        onToggle={() => void handleStatus(admin)}
                        name={admin.name}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{" "}
                <span className="font-semibold text-gray-700">{admins.length}</span> administrators
              </div>
            </>
          )}
        </div>
      </div>

      <AdminFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleSaved}
        mode={mode}
        admin={selectedAdmin}
      />

      {deleting ? (
        <ConfirmDelete
          admin={deleting}
          busy={deleteBusy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void handleDelete()}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0" role="status">
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${
              toast.type === "success" ? "bg-gray-900" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <FiCheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <FiXCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
