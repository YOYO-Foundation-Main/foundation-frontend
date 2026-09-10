// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Search,
//   Check,
//   X,
//   Eye,
//   RefreshCw,
//   Shield,
//   Filter,
//   User,
//   FileText,
//   Clock,
//   AlertCircle,
//   ChevronRight,
//   Building2,
//   Landmark,
//   Camera,
//   ExternalLink,
//   Loader2,
//   CreditCard,
// } from "lucide-react";
// import {
//   adminGetUserKyc,
//   adminUpdateUserKyc,
//   adminUpdateUserBank,
//   adminUpdateBeneficiaryIdentity,
//   adminUpdateBeneficiaryBank,
//   adminUpdateCampaignProof,
//   adminGetCampaignProofs
// } from "@/features/admin/api/admin.api";
// import { toast } from "sonner";

// /* ─────────────────────────────────────────────
//    TYPES
// ───────────────────────────────────────────── */

// type ApprovalStatus =
//   | "PENDING"
//   | "UNDER_REVIEW"
//   | "APPROVED"
//   | "REJECTED"
//   | string;

// interface KycUser {
//   id: number;
//   name: string;
//   email: string;
//   mobile?: string;
// }

// interface UserKycItem {
//   id: number;
//   userId?: number;
//   documentType: string;
//   type?: string;
//   status: ApprovalStatus;
//   documentUrl: string;
//   rejectionNote?: string;
//   createdAt: string;
//   user?: KycUser;
// }

// interface UserBankItem {
//   id: number;
//   userId?: number;
//   accountHolderName?: string;
//   accountNumber?: string;
//   ifscCode?: string;
//   bankName?: string;
//   branchName?: string;
//   cancelledChequeUrl?: string;
//   status: ApprovalStatus;
//   rejectionReason?: string;
//   createdAt: string;
//   user?: KycUser;
// }

// interface BeneficiaryIdentityItem {
//   campaignId: number;
//   campaignTitle?: string;
//   beneficiaryName?: string;
//   beneficiaryEmail?: string;
//   beneficiaryMobile?: string;
//   documentType?: string;
//   documentUrl?: string;
//   identityStatus: ApprovalStatus;
//   rejectionReason?: string;
//   createdAt: string;
//   user?: KycUser;
// }

// interface BeneficiaryBankItem {
//   campaignId: number;
//   campaignTitle?: string;
//   beneficiaryName?: string;
//   accountHolderName?: string;
//   accountNumber?: string;
//   ifscCode?: string;
//   bankName?: string;
//   branchName?: string;
//   cancelledChequeUrl?: string;
//   bankStatus: ApprovalStatus;
//   rejectionReason?: string;
//   createdAt: string;
//   user?: KycUser;
// }

// interface CampaignProofItem {
//   id: number;
//   campaignId?: number;
//   campaignTitle?: string;
//   documentType?: string;
//   documentUrl?: string;
//   description?: string;
//   type?: string;
//   status: ApprovalStatus;
//   rejectionNote?: string;
//   createdAt: string;
//   campaign?: {
//     id: number;
//     title: string;
//     createdBy?: number;
//   };
//   user?: KycUser;
// }

// type ActiveTab =
//   | "user-identity"
//   | "user-bank"
//   | "beneficiary-identity"
//   | "beneficiary-bank"
//   | "campaign-proof";

// type ModalTarget =
//   | { kind: "approve"; label: string; execute: () => Promise<void> }
//   | { kind: "reject"; label: string; execute: (r: string) => Promise<void> }
//   | null;

// /* ─────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────── */

// function maskAccount(num?: string) {
//   if (!num) return "—";
//   if (num.length <= 4) return num;
//   return "XXXX XXXX " + num.slice(-4);
// }

// function isValidUrl(url?: string) {
//   if (!url) return false;
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// }

// function fmtDate(d?: string) {
//   if (!d) return "—";
//   return new Date(d).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// }

// function normaliseArray(res: unknown): unknown[] {
//   if (Array.isArray(res)) return res;
//   if (res && typeof res === "object") {
//     const r = res as Record<string, unknown>;
//     return (
//       (r.data as unknown[]) ??
//       (r.kycs as unknown[]) ??
//       (r.records as unknown[]) ??
//       []
//     );
//   }
//   return [];
// }

// /* ─────────────────────────────────────────────
//    STATUS BADGE
// ───────────────────────────────────────────── */

// const statusMap: Record<string, { pill: string; dot: string; label: string }> =
// {
//   APPROVED: {
//     pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     dot: "bg-emerald-500",
//     label: "Approved",
//   },
//   REJECTED: {
//     pill: "bg-red-50 text-red-600 border border-red-200",
//     dot: "bg-red-500",
//     label: "Rejected",
//   },
//   PENDING: {
//     pill: "bg-amber-50 text-amber-700 border border-amber-200",
//     dot: "bg-amber-400",
//     label: "Pending",
//   },
//   UNDER_REVIEW: {
//     pill: "bg-amber-50 text-amber-700 border border-amber-200",
//     dot: "bg-amber-400",
//     label: "Under Review",
//   },
// };

// function StatusBadge({ status }: { status: string }) {
//   const s = statusMap[status] ?? {
//     pill: "bg-slate-100 text-slate-500 border border-slate-200",
//     dot: "bg-slate-400",
//     label: status,
//   };
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase ${s.pill}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
//       {s.label}
//     </span>
//   );
// }

// /* ─────────────────────────────────────────────
//    DOCUMENT PREVIEW
// ───────────────────────────────────────────── */

// function DocPreview({ url, label }: { url?: string; label?: string }) {
//   const [imgFailed, setImgFailed] = useState(false);

//   if (!url || !isValidUrl(url)) {
//     return (
//       <div className="bg-slate-50 rounded-xl p-6 text-xs text-slate-400 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-2">
//         <FileText className="h-6 w-6 text-slate-300" />
//         <span>{label ?? "No document available"}</span>
//       </div>
//     );
//   }

//   const isPdf = url.includes(".pdf") || url.includes("raw/");

//   if (isPdf || imgFailed) {
//     return (
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center gap-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-100 transition font-medium"
//       >
//         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
//           <Eye className="h-4 w-4 text-blue-500" />
//         </div>
//         {label ?? "View Document"}
//         <ExternalLink className="h-3.5 w-3.5 ml-auto text-blue-400" />
//       </a>
//     );
//   }

//   return (
//     <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
//       <img
//         src={url}
//         alt={label ?? "Document"}
//         className="w-full max-h-52 object-contain bg-white"
//         onError={() => setImgFailed(true)}
//       />
//       <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50">
//         <span className="text-[10px] text-slate-400 font-medium">
//           {label ?? "Preview"}
//         </span>
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-semibold"
//         >
//           <ExternalLink className="h-3 w-3" /> Full size
//         </a>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    REJECTION MODAL
// ───────────────────────────────────────────── */

// function RejectModal({
//   open,
//   title,
//   onClose,
//   onConfirm,
//   busy,
// }: {
//   open: boolean;
//   title: string;
//   onClose: () => void;
//   onConfirm: (reason: string) => void;
//   busy: boolean;
// }) {
//   const [reason, setReason] = useState("");
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (open) {
//       setReason("");
//       setErr("");
//     }
//   }, [open]);

//   if (!open) return null;

//   const submit = () => {
//     const t = reason.trim();
//     if (!t) {
//       setErr("Rejection reason is required.");
//       return;
//     }
//     onConfirm(t);
//   };

//   return (
// <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
//             <X className="h-5 w-5 text-red-500" />
//           </div>
//           <div>
//             <h3 className="font-bold text-slate-900">{title}</h3>
//             <p className="text-xs text-slate-400 mt-0.5">
//               This reason will be shown to the applicant.
//             </p>
//           </div>
//         </div>
//         <textarea
//           autoFocus
//           rows={4}
//           placeholder="Enter rejection reason…"
//           value={reason}
//           onChange={(e) => {
//             setReason(e.target.value);
//             setErr("");
//           }}
//           className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 transition"
//         />
//         {err && (
//           <p className="mt-1.5 text-xs text-red-500 font-medium">{err}</p>
//         )}
//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             onClick={onClose}
//             disabled={busy}
//             className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={submit}
//             disabled={busy}
//             className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
//           >
//             {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
//             Reject
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    CONFIRM MODAL
// ───────────────────────────────────────────── */

// function ConfirmModal({
//   open,
//   title,
//   description,
//   onClose,
//   onConfirm,
//   busy,
// }: {
//   open: boolean;
//   title: string;
//   description: string;
//   onClose: () => void;
//   onConfirm: () => void;
//   busy: boolean;
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
//             <Check className="h-5 w-5 text-emerald-600" />
//           </div>
//           <h3 className="font-bold text-slate-900">{title}</h3>
//         </div>
//         <p className="text-sm text-slate-500 mb-5">{description}</p>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             disabled={busy}
//             className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={busy}
//             className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
//           >
//             {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
//             Approve
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    STAT CARD
// ───────────────────────────────────────────── */

// function StatCard({
//   label,
//   count,
//   icon,
//   accent,
// }: {
//   label: string;
//   count: number;
//   icon: React.ReactNode;
//   accent: string;
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
//       <div
//         className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
//       >
//         {icon}
//       </div>
//       <div>
//         <p className="text-2xl font-extrabold text-slate-900">{count}</p>
//         <p className="text-xs text-slate-400 font-medium">{label}</p>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    EMPTY / LOADING STATES
// ───────────────────────────────────────────── */

// function LoadingState() {
//   return (
//     <div className="py-16 flex flex-col items-center gap-3">
//       <Loader2 className="h-8 w-8 animate-spin text-red-600" />
//       <p className="text-sm text-slate-400 font-medium">Loading records…</p>
//     </div>
//   );
// }

// function EmptyState({ message }: { message?: string }) {
//   return (
//     <div className="py-16 flex flex-col items-center gap-3">
//       <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
//         <Shield className="h-7 w-7 text-slate-300" />
//       </div>
//       <p className="text-sm font-bold text-slate-400">
//         {message ?? "No records found"}
//       </p>
//       <p className="text-xs text-slate-300">
//         Try adjusting your search or filter
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    ROW ACTION BUTTONS
// ───────────────────────────────────────────── */

// function RowActions({
//   status,
//   onReview,
// }: {
//   status: ApprovalStatus;
//   onReview: () => void;
// }) {
//   return (
//     <div className="flex items-center gap-2 shrink-0">
//       <button
//         onClick={onReview}
//         className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-red-600 hover:text-white transition"
//       >
//         Review <ChevronRight className="h-3 w-3" />
//       </button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    DRAWER SHELL
// ───────────────────────────────────────────── */

// function Drawer({
//   title,
//   subtitle,
//   statusEl,
//   onClose,
//   children,
//   footer,
// }: {
//   title: string;
//   subtitle?: string;
//   statusEl?: React.ReactNode;
//   onClose: () => void;
//   children: React.ReactNode;
//   footer?: React.ReactNode;
// }) {
//   return (
//     <>
//       <div
//         className="fixed inset-0 z-40 bg-black/40"
//         onClick={onClose}
//       />
//       <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
//         <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 shrink-0 bg-white">
//           <button
//             onClick={onClose}
//             className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
//           >
//             <X className="h-4 w-4" />
//           </button>
//           <div className="flex-1 min-w-0">
//             <h2 className="font-extrabold text-slate-900 truncate">{title}</h2>
//             {subtitle && (
//               <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
//             )}
//           </div>
//           {statusEl}
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>
//         {footer && (
//           <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50">
//             {footer}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    ACTION FOOTER (approve / reject buttons)
// ───────────────────────────────────────────── */

// function ActionFooter({
//   status,
//   busy,
//   onApprove,
//   onReject,
//   approvedLabel,
// }: {
//   status: ApprovalStatus;
//   busy: boolean;
//   onApprove: () => void;
//   onReject: () => void;
//   approvedLabel?: string;
// }) {
//   if (status === "APPROVED") {
//     return (
//       <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 border border-emerald-200">
//         <Check className="h-4 w-4 text-emerald-600" />
//         <span className="text-sm font-bold text-emerald-700">
//           {approvedLabel ?? "Already Approved"}
//         </span>
//       </div>
//     );
//   }
//   return (
//     <div className="flex gap-3">
//       <button
//         onClick={onReject}
//         disabled={busy}
//         className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition disabled:opacity-50"
//       >
//         <X className="h-4 w-4" /> Reject
//       </button>
//       <button
//         onClick={onApprove}
//         disabled={busy}
//         className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
//       >
//         {busy ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <Check className="h-4 w-4" />
//         )}
//         Approve
//       </button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    INFO GRID HELPER
// ───────────────────────────────────────────── */

// function InfoGrid({
//   rows,
// }: {
//   rows: { label: string; value?: string | null }[];
// }) {
//   return (
//     <div className="grid grid-cols-2 gap-3">
//       {rows
//         .filter((r) => r.value)
//         .map((r) => (
//           <div
//             key={r.label}
//             className="bg-slate-50 rounded-xl p-3.5 border border-slate-100"
//           >
//             <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
//               {r.label}
//             </p>
//             <p className="text-sm font-bold text-slate-700">{r.value}</p>
//           </div>
//         ))}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    REJECTION NOTE BLOCK
// ───────────────────────────────────────────── */

// function RejectionNote({ note }: { note?: string }) {
//   if (!note) return null;
//   return (
//     <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
//       <p className="text-xs font-semibold text-red-600 mb-1">
//         Rejection Reason
//       </p>
//       <p className="text-xs text-red-700 leading-relaxed">{note}</p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    USER IDENTITY DRAWER
// ───────────────────────────────────────────── */

// function UserIdentityDrawer({
//   item,
//   onClose,
//   onRefresh,
// }: {
//   item: UserKycItem;
//   onClose: () => void;
//   onRefresh: () => void;
// }) {
//   const [busy, setBusy] = useState(false);
//   const [modal, setModal] = useState<ModalTarget>(null);

//   const run = async (fn: () => Promise<void>) => {
//     try {
//       setBusy(true);
//       await fn();
//       setModal(null);
//       onRefresh();
//     } catch (e: unknown) {
//       toast.error(e instanceof Error ? e.message : "Action failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <>
//       <ConfirmModal
//         open={modal?.kind === "approve"}
//         title="Approve Identity KYC?"
//         description="Are you sure you want to approve this identity document?"
//         onClose={() => setModal(null)}
//         onConfirm={() =>
//           modal?.kind === "approve" && run(modal.execute)
//         }
//         busy={busy}
//       />
//       <RejectModal
//         open={modal?.kind === "reject"}
//         title="Reject Identity KYC"
//         onClose={() => setModal(null)}
//         onConfirm={(r) =>
//           modal?.kind === "reject" && run(() => modal.execute(r))
//         }
//         busy={busy}
//       />
//       <Drawer
//         title={item.user?.name ?? `User #${item.userId}`}
//         subtitle={`Identity KYC Review — #${item.id}`}
//         statusEl={<StatusBadge status={item.status} />}
//         onClose={onClose}
//         footer={
//           <ActionFooter
//             status={item.status}
//             busy={busy}
//             onApprove={() =>
//               setModal({
//                 kind: "approve",
//                 label: "Identity KYC",
//                 execute: async () => {
//                   await adminUpdateUserKyc(item.id, "APPROVED");
//                   toast.success("Identity KYC approved");
//                 },
//               })
//             }
//             onReject={() =>
//               setModal({
//                 kind: "reject",
//                 label: "Identity KYC",
//                 execute: async (reason) => {
//                   await adminUpdateUserKyc(item.id, "REJECTED", reason);
//                   toast.success("Identity KYC rejected");
//                 },
//               })
//             }
//           />
//         }
//       >
//         {item.user && (
//           <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700 shrink-0">
//               {(item.user.name || "U")[0].toUpperCase()}
//             </div>
//             <div>
//               <p className="font-semibold text-slate-900 text-sm">
//                 {item.user.name}
//               </p>
//               <p className="text-xs text-slate-400">{item.user.email}</p>
//               {item.user.mobile && (
//                 <p className="text-xs text-slate-400">{item.user.mobile}</p>
//               )}
//             </div>
//           </div>
//         )}
//         <InfoGrid
//           rows={[
//             { label: "Document Type", value: item.documentType },
//             { label: "Submitted As", value: item.type },
//             { label: "Submitted On", value: fmtDate(item.createdAt) },
//             { label: "Status", value: item.status },
//           ]}
//         />
//         <DocPreview
//           url={item.documentUrl}
//           label={item.documentType ?? "Identity Document"}
//         />
//         <RejectionNote note={item.rejectionNote} />
//       </Drawer>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    USER BANK DRAWER
// ───────────────────────────────────────────── */

// function UserBankDrawer({
//   item,
//   onClose,
//   onRefresh,
// }: {
//   item: UserBankItem;
//   onClose: () => void;
//   onRefresh: () => void;
// }) {
//   const [busy, setBusy] = useState(false);
//   const [modal, setModal] = useState<ModalTarget>(null);

//   const run = async (fn: () => Promise<void>) => {
//     try {
//       setBusy(true);
//       await fn();
//       setModal(null);
//       onRefresh();
//     } catch (e: unknown) {
//       toast.error(e instanceof Error ? e.message : "Action failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <>
//       <ConfirmModal
//         open={modal?.kind === "approve"}
//         title="Approve Bank Details?"
//         description="Are you sure you want to approve these bank account details?"
//         onClose={() => setModal(null)}
//         onConfirm={() =>
//           modal?.kind === "approve" && run(modal.execute)
//         }
//         busy={busy}
//       />
//       <RejectModal
//         open={modal?.kind === "reject"}
//         title="Reject Bank Details"
//         onClose={() => setModal(null)}
//         onConfirm={(r) =>
//           modal?.kind === "reject" && run(() => modal.execute(r))
//         }
//         busy={busy}
//       />
//       <Drawer
//         title={item.user?.name ?? `User #${item.userId}`}
//         subtitle={`User Bank Review — #${item.id}`}
//         statusEl={<StatusBadge status={item.status} />}
//         onClose={onClose}
//         footer={
//           <ActionFooter
//             status={item.status}
//             busy={busy}
//             onApprove={() =>
//               setModal({
//                 kind: "approve",
//                 label: "Bank Details",
//                 execute: async () => {
//                   await adminUpdateUserBank(item.id, "APPROVED");
//                   toast.success("Bank details approved");
//                 },
//               })
//             }
//             onReject={() =>
//               setModal({
//                 kind: "reject",
//                 label: "Bank Details",
//                 execute: async (reason) => {
//                   await adminUpdateUserBank(item.id, "REJECTED", reason);
//                   toast.success("Bank details rejected");
//                 },
//               })
//             }
//           />
//         }
//       >
//         {item.user && (
//           <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700 shrink-0">
//               {(item.user.name || "U")[0].toUpperCase()}
//             </div>
//             <div>
//               <p className="font-semibold text-slate-900 text-sm">
//                 {item.user.name}
//               </p>
//               <p className="text-xs text-slate-400">{item.user.email}</p>
//             </div>
//           </div>
//         )}
//         <InfoGrid
//           rows={[
//             { label: "Account Holder", value: item.accountHolderName },
//             {
//               label: "Account Number",
//               value: maskAccount(item.accountNumber),
//             },
//             { label: "IFSC Code", value: item.ifscCode },
//             { label: "Bank Name", value: item.bankName },
//             { label: "Branch", value: item.branchName },
//             { label: "Submitted On", value: fmtDate(item.createdAt) },
//           ]}
//         />
//         {item.cancelledChequeUrl && (
//           <DocPreview
//             url={item.cancelledChequeUrl}
//             label="Cancelled Cheque"
//           />
//         )}
//         <RejectionNote note={item.rejectionReason} />
//       </Drawer>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    BENEFICIARY IDENTITY DRAWER
// ───────────────────────────────────────────── */

// function BeneficiaryIdentityDrawer({
//   item,
//   onClose,
//   onRefresh,
// }: {
//   item: BeneficiaryIdentityItem;
//   onClose: () => void;
//   onRefresh: () => void;
// }) {
//   const [busy, setBusy] = useState(false);
//   const [modal, setModal] = useState<ModalTarget>(null);

//   const run = async (fn: () => Promise<void>) => {
//     try {
//       setBusy(true);
//       await fn();
//       setModal(null);
//       onRefresh();
//     } catch (e: unknown) {
//       toast.error(e instanceof Error ? e.message : "Action failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <>
//       <ConfirmModal
//         open={modal?.kind === "approve"}
//         title="Approve Beneficiary Identity?"
//         description="Are you sure you want to approve this beneficiary identity document?"
//         onClose={() => setModal(null)}
//         onConfirm={() =>
//           modal?.kind === "approve" && run(modal.execute)
//         }
//         busy={busy}
//       />
//       <RejectModal
//         open={modal?.kind === "reject"}
//         title="Reject Beneficiary Identity"
//         onClose={() => setModal(null)}
//         onConfirm={(r) =>
//           modal?.kind === "reject" && run(() => modal.execute(r))
//         }
//         busy={busy}
//       />
//       <Drawer
//         title={
//           item.campaignTitle ??
//           `Campaign #${item.campaignId}`
//         }
//         subtitle={`Beneficiary Identity Review — Campaign #${item.campaignId}`}
//         statusEl={<StatusBadge status={item.identityStatus} />}
//         onClose={onClose}
//         footer={
//           <ActionFooter
//             status={item.identityStatus}
//             busy={busy}
//             onApprove={() =>
//               setModal({
//                 kind: "approve",
//                 label: "Beneficiary Identity",
//                 execute: async () => {
//                   await adminUpdateBeneficiaryIdentity(
//                     item.campaignId,
//                     "APPROVED"
//                   );
//                   toast.success("Beneficiary identity approved");
//                 },
//               })
//             }
//             onReject={() =>
//               setModal({
//                 kind: "reject",
//                 label: "Beneficiary Identity",
//                 execute: async (reason) => {
//                   await adminUpdateBeneficiaryIdentity(
//                     item.campaignId,
//                     "REJECTED",
//                     reason
//                   );
//                   toast.success("Beneficiary identity rejected");
//                 },
//               })
//             }
//           />
//         }
//       >
//         <div className="rounded-xl border border-slate-200 p-4">
//           <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
//             Campaign
//           </p>
//           <p className="text-sm font-bold text-slate-800">
//             {item.campaignTitle ?? `#${item.campaignId}`}
//           </p>
//           {item.user && (
//             <p className="text-xs text-slate-400 mt-1">
//               by {item.user.name}
//             </p>
//           )}
//         </div>
//         <InfoGrid
//           rows={[
//             { label: "Beneficiary Name", value: item.beneficiaryName },
//             { label: "Beneficiary Email", value: item.beneficiaryEmail },
//             { label: "Beneficiary Mobile", value: item.beneficiaryMobile },
//             { label: "Document Type", value: item.documentType },
//             { label: "Submitted On", value: fmtDate(item.createdAt) },
//           ]}
//         />
//         <DocPreview
//           url={item.documentUrl}
//           label={item.documentType ?? "Identity Document"}
//         />
//         <RejectionNote note={item.rejectionReason} />
//       </Drawer>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    BENEFICIARY BANK DRAWER
// ───────────────────────────────────────────── */

// function BeneficiaryBankDrawer({
//   item,
//   onClose,
//   onRefresh,
// }: {
//   item: BeneficiaryBankItem;
//   onClose: () => void;
//   onRefresh: () => void;
// }) {
//   const [busy, setBusy] = useState(false);
//   const [modal, setModal] = useState<ModalTarget>(null);

//   const run = async (fn: () => Promise<void>) => {
//     try {
//       setBusy(true);
//       await fn();
//       setModal(null);
//       onRefresh();
//     } catch (e: unknown) {
//       toast.error(e instanceof Error ? e.message : "Action failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <>
//       <ConfirmModal
//         open={modal?.kind === "approve"}
//         title="Approve Beneficiary Bank?"
//         description="Are you sure you want to approve these beneficiary bank details?"
//         onClose={() => setModal(null)}
//         onConfirm={() =>
//           modal?.kind === "approve" && run(modal.execute)
//         }
//         busy={busy}
//       />
//       <RejectModal
//         open={modal?.kind === "reject"}
//         title="Reject Beneficiary Bank"
//         onClose={() => setModal(null)}
//         onConfirm={(r) =>
//           modal?.kind === "reject" && run(() => modal.execute(r))
//         }
//         busy={busy}
//       />
//       <Drawer
//         title={
//           item.campaignTitle ??
//           `Campaign #${item.campaignId}`
//         }
//         subtitle={`Beneficiary Bank Review — Campaign #${item.campaignId}`}
//         statusEl={<StatusBadge status={item.bankStatus} />}
//         onClose={onClose}
//         footer={
//           <ActionFooter
//             status={item.bankStatus}
//             busy={busy}
//             onApprove={() =>
//               setModal({
//                 kind: "approve",
//                 label: "Beneficiary Bank",
//                 execute: async () => {
//                   await adminUpdateBeneficiaryBank(
//                     item.campaignId,
//                     "APPROVED"
//                   );
//                   toast.success("Beneficiary bank approved");
//                 },
//               })
//             }
//             onReject={() =>
//               setModal({
//                 kind: "reject",
//                 label: "Beneficiary Bank",
//                 execute: async (reason) => {
//                   await adminUpdateBeneficiaryBank(
//                     item.campaignId,
//                     "REJECTED",
//                     reason
//                   );
//                   toast.success("Beneficiary bank rejected");
//                 },
//               })
//             }
//           />
//         }
//       >
//         <div className="rounded-xl border border-slate-200 p-4">
//           <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
//             Campaign
//           </p>
//           <p className="text-sm font-bold text-slate-800">
//             {item.campaignTitle ?? `#${item.campaignId}`}
//           </p>
//           {item.beneficiaryName && (
//             <p className="text-xs text-slate-400 mt-1">
//               Beneficiary: {item.beneficiaryName}
//             </p>
//           )}
//         </div>
//         <InfoGrid
//           rows={[
//             { label: "Account Holder", value: item.accountHolderName },
//             {
//               label: "Account Number",
//               value: maskAccount(item.accountNumber),
//             },
//             { label: "IFSC Code", value: item.ifscCode },
//             { label: "Bank Name", value: item.bankName },
//             { label: "Branch", value: item.branchName },
//             { label: "Submitted On", value: fmtDate(item.createdAt) },
//           ]}
//         />
//         {item.cancelledChequeUrl && (
//           <DocPreview
//             url={item.cancelledChequeUrl}
//             label="Cancelled Cheque"
//           />
//         )}
//         <RejectionNote note={item.rejectionReason} />
//       </Drawer>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    CAMPAIGN PROOF DRAWER
// ───────────────────────────────────────────── */

// function CampaignProofDrawer({
//   item,
//   onClose,
//   onRefresh,
// }: {
//   item: CampaignProofItem;
//   onClose: () => void;
//   onRefresh: () => void;
// }) {
//   const [busy, setBusy] = useState(false);
//   const [modal, setModal] = useState<ModalTarget>(null);

//   const run = async (fn: () => Promise<void>) => {
//     try {
//       setBusy(true);
//       await fn();
//       setModal(null);
//       onRefresh();
//     } catch (e: unknown) {
//       toast.error(e instanceof Error ? e.message : "Action failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const proofUrl = item.proofUrl ?? item.documentUrl;

//   return (
//     <>
//       <ConfirmModal
//         open={modal?.kind === "approve"}
//         title="Approve Campaign Proof?"
//         description="Are you sure you want to approve this campaign proof document?"
//         onClose={() => setModal(null)}
//         onConfirm={() =>
//           modal?.kind === "approve" && run(modal.execute)
//         }
//         busy={busy}
//       />
//       <RejectModal
//         open={modal?.kind === "reject"}
//         title="Reject Campaign Proof"
//         onClose={() => setModal(null)}
//         onConfirm={(r) =>
//           modal?.kind === "reject" && run(() => modal.execute(r))
//         }
//         busy={busy}
//       />
//       <Drawer
//         title={
//           item.campaignTitle ??
//           `Campaign #${item.campaignId ?? item.id}`
//         }
//         subtitle={`Campaign Proof Review — #${item.id}`}
//         statusEl={<StatusBadge status={item.status} />}
//         onClose={onClose}
//         footer={
//           <ActionFooter
//             status={item.status}
//             busy={busy}
//             onApprove={() =>
//               setModal({
//                 kind: "approve",
//                 label: "Campaign Proof",
//                 execute: async () => {
//                   await adminUpdateCampaignProof(item.id, "APPROVED");
//                   toast.success("Campaign proof approved");
//                 },
//               })
//             }
//             onReject={() =>
//               setModal({
//                 kind: "reject",
//                 label: "Campaign Proof",
//                 execute: async (reason) => {
//                   await adminUpdateCampaignProof(
//                     item.id,
//                     "REJECTED",
//                     reason
//                   );
//                   toast.success("Campaign proof rejected");
//                 },
//               })
//             }
//           />
//         }
//       >
//         <div className="rounded-xl border border-slate-200 p-4">
//           <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
//             Campaign
//           </p>
//           <p className="text-sm font-bold text-slate-800">
//             {item.campaignTitle ??
//               `Campaign #${item.campaignId ?? item.id}`}
//           </p>
//           {item.user && (
//             <p className="text-xs text-slate-400 mt-1">
//               by {item.user.name} · {item.user.email}
//             </p>
//           )}
//         </div>
//         <InfoGrid
//           rows={[
//             { label: "Submitted On", value: fmtDate(item.createdAt) },
//             { label: "Status", value: item.status },
//           ]}
//         />
//         <DocPreview url={proofUrl} label="Campaign Proof Document" />
//         <RejectionNote note={item.rejectionNote} />
//       </Drawer>
//     </>
//   );
// }

// /* ─────────────────────────────────────────────
//    MAIN PAGE
// ───────────────────────────────────────────── */

// export default function AdminKycPage() {
//   const [activeTab, setActiveTab] = useState<ActiveTab>("user-identity");
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [campaignProofs, setCampaignProofs] = useState<CampaignProofItem[]>([]);

//   // Data per tab
//   const [userIdentityList, setUserIdentityList] = useState<UserKycItem[]>([]);

//   // These tabs require GET endpoints that adminGetUserKyc does not cover.
//   // Each is populated from the same adminGetUserKyc response if the backend
//   // includes bank/proof data in that response, or remains empty until
//   // dedicated GET endpoints are available.
//   const [userBankList, setUserBankList] = useState<UserBankItem[]>([]);
//   const [beneficiaryIdentityList, setBeneficiaryIdentityList] = useState<
//     BeneficiaryIdentityItem[]
//   >([]);
//   const [beneficiaryBankList, setBeneficiaryBankList] = useState<
//     BeneficiaryBankItem[]
//   >([]);
//   const [campaignProofList, setCampaignProofList] = useState<
//     CampaignProofItem[]
//   >([]);

//   // Drawer selections
//   const [selectedUserIdentity, setSelectedUserIdentity] =
//     useState<UserKycItem | null>(null);
//   const [selectedUserBank, setSelectedUserBank] =
//     useState<UserBankItem | null>(null);
//   const [selectedBeneficiaryIdentity, setSelectedBeneficiaryIdentity] =
//     useState<BeneficiaryIdentityItem | null>(null);
//   const [selectedBeneficiaryBank, setSelectedBeneficiaryBank] =
//     useState<BeneficiaryBankItem | null>(null);
//   const [selectedCampaignProof, setSelectedCampaignProof] =
//     useState<CampaignProofItem | null>(null);

//   const fetchCampaignProofs = useCallback(async () => {
//     try {
//       const result = await adminGetCampaignProofs();

//       setCampaignProofs(
//         Array.isArray(result?.data)
//           ? result.data.map((item: any) => ({
//             ...item,

//             campaignId:
//               item.campaignId ??
//               item.campaign?.id,

//             campaignTitle:
//               item.campaign?.title ??
//               `Campaign #${item.campaignId}`,

//             documentUrl: item.documentUrl,

//             documentType: item.documentType,

//             description: item.description,

//             status: item.status,

//             createdAt: item.createdAt,
//           }))
//           : []
//       );
//     } catch (error) {
//       console.error(
//         "Failed to fetch campaign proofs:",
//         error
//       );

//       setCampaignProofs([]);

//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch campaign proofs"
//       );
//     }
//   }, []);

//   const fetchAll = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await adminGetUserKyc();
//       const raw = normaliseArray(res);

//       // The backend GET /api/kyc/admin returns user identity KYC records.
//       // Cast and store them.
//       setUserIdentityList(raw as UserKycItem[]);

//       // The following tabs require separate GET endpoints from the backend.
//       // Until those endpoints exist and are wired into admin.api.ts,
//       // these lists stay empty and the tab will show an empty state.
//       // Do NOT invent fake data here.
//       //
//       // setUserBankList(...)           → needs GET /api/kyc/admin/bank
//       // setBeneficiaryIdentityList(...)→ needs GET /api/kyc/campaigns/beneficiary-identity
//       // setBeneficiaryBankList(...)    → needs GET /api/kyc/campaigns/beneficiary-bank
//       // setCampaignProofList(...)      → needs GET /api/kyc/admin/campaign-proof
//     } catch (err: unknown) {
//       console.error("KYC fetch error:", err);
//       toast.error("Failed to load KYC records");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAll();

//   }, [fetchAll,]);

//   useEffect(() => {
//     console.log("🔥 KYC PAGE MOUNTED");

//     adminGetCampaignProofs()
//       .then((result) => {
//         console.log("✅ CAMPAIGN PROOF RESULT:", result);

//         setCampaignProofs(
//           Array.isArray(result?.data)
//             ? result.data
//             : []
//         );
//       })
//       .catch((error) => {
//         console.error("❌ CAMPAIGN PROOF ERROR:", error);
//       });
//   }, []);

//   /* ── Filtering ── */
//   function filterList<T extends { status?: ApprovalStatus }>(
//     list: T[],
//     getStatus: (item: T) => string
//   ): T[] {
//     return list.filter((item) => {
//       const st = getStatus(item);
//       const matchStatus =
//         statusFilter === "ALL" || st === statusFilter;
//       const s = search.toLowerCase();
//       const matchSearch =
//         !s ||
//         JSON.stringify(item).toLowerCase().includes(s);
//       return matchStatus && matchSearch;
//     });
//   }

//   const filteredUserIdentity = filterList(
//     userIdentityList,
//     (i) => i.status
//   );
//   const filteredUserBank = filterList(userBankList, (i) => i.status);
//   const filteredBeneficiaryIdentity = filterList(
//     beneficiaryIdentityList,
//     (i) => i.identityStatus 
//   );
//   const filteredBeneficiaryBank = filterList(
//     beneficiaryBankList,
//     (i) => i.bankStatus
//   );
//   const filteredCampaignProof = filterList(
//     campaignProofList,
//     (i) => i.status
//   );

//   /* ── Stats (derived from user identity list only — the only loaded data) ── */
//   const allLoaded = userIdentityList;
//   const total = allLoaded.length;
//   const pending = allLoaded.filter((k) =>
//     ["PENDING", "UNDER_REVIEW"].includes(k.status)
//   ).length;
//   const approved = allLoaded.filter((k) => k.status === "APPROVED").length;
//   const rejected = allLoaded.filter((k) => k.status === "REJECTED").length;

//   const STATUS_FILTERS = [
//     "ALL",
//     "UNDER_REVIEW",
//     "PENDING",
//     "APPROVED",
//     "REJECTED",
//   ] as const;

//   const tabs: {
//     key: ActiveTab;
//     label: string;
//     icon: React.ReactNode;
//     count: number;
//   }[] = [
//       {
//         key: "user-identity",
//         label: "User Identity",
//         icon: <User className="h-3.5 w-3.5" />,
//         count: userIdentityList.length,
//       },
//       {
//         key: "user-bank",
//         label: "User Bank",
//         icon: <Landmark className="h-3.5 w-3.5" />,
//         count: userBankList.length,
//       },
//       {
//         key: "beneficiary-identity",
//         label: "Beneficiary Identity",
//         icon: <Shield className="h-3.5 w-3.5" />,
//         count: beneficiaryIdentityList.length,
//       },
//       {
//         key: "beneficiary-bank",
//         label: "Beneficiary Bank",
//         icon: <CreditCard className="h-3.5 w-3.5" />,
//         count: beneficiaryBankList.length,
//       },
//       {
//         key: "campaign-proof",
//         label: "Campaign Proof",
//         icon: <Camera className="h-3.5 w-3.5" />,
//         count: campaignProofList.length,
//       },
//     ];

//   useEffect(() => {
//     console.log("🔥 KYC PAGE MOUNTED");

//     adminGetCampaignProofs()
//       .then((result) => {
//         console.log("✅ CAMPAIGN PROOF RESULT:", result);

//         setCampaignProofList(
//           Array.isArray(result?.data)
//             ? result.data.map((item: any) => ({
//               ...item,
//               campaignId:
//                 item.campaignId ?? item.campaign?.id,
//               campaignTitle:
//                 item.campaign?.title ??
//                 `Campaign #${item.campaignId}`,
//             }))
//             : []
//         );
//       })
//       .catch((error) => {
//         console.error(
//           "❌ CAMPAIGN PROOF ERROR:",
//           error
//         );

//         setCampaignProofList([]);
//       });
//   }, []);

//   return (
//     <>
//       {/* ── Drawers ── */}
//       {selectedUserIdentity && (
//         <UserIdentityDrawer
//           item={selectedUserIdentity}
//           onClose={() => setSelectedUserIdentity(null)}
//           onRefresh={() => {
//             fetchAll();
//             setSelectedUserIdentity(null);
//           }}
//         />
//       )}
//       {selectedUserBank && (
//         <UserBankDrawer
//           item={selectedUserBank}
//           onClose={() => setSelectedUserBank(null)}
//           onRefresh={() => {
//             fetchAll();
//             setSelectedUserBank(null);
//           }}
//         />
//       )}
//       {selectedBeneficiaryIdentity && (
//         <BeneficiaryIdentityDrawer
//           item={selectedBeneficiaryIdentity}
//           onClose={() => setSelectedBeneficiaryIdentity(null)}
//           onRefresh={() => {
//             fetchAll();
//             setSelectedBeneficiaryIdentity(null);
//           }}
//         />
//       )}
//       {selectedBeneficiaryBank && (
//         <BeneficiaryBankDrawer
//           item={selectedBeneficiaryBank}
//           onClose={() => setSelectedBeneficiaryBank(null)}
//           onRefresh={() => {
//             fetchAll();
//             setSelectedBeneficiaryBank(null);
//           }}
//         />
//       )}
//       {selectedCampaignProof && (
//         <CampaignProofDrawer
//           item={selectedCampaignProof}
//           onClose={() => setSelectedCampaignProof(null)}
//           onRefresh={() => {
//             fetchAll();
//             setSelectedCampaignProof(null);
//           }}
//         />
//       )}

//       {/* ── Page header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
//         <div>
//           <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-1">
//             Admin Panel
//           </p>
//           <h1 className="text-2xl font-extrabold text-slate-900">
//             KYC & Campaign Approvals
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Review identity documents and approve campaign verification steps.
//           </p>
//         </div>
//         <button
//           onClick={fetchAll}
//           className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto shadow-sm"
//         >
//           <RefreshCw
//             className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//           />{" "}
//           Refresh
//         </button>
//       </div>

//       {/* ── Stat strip ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           label="User Identity Records"
//           count={total}
//           icon={<Shield className="h-5 w-5 text-blue-600" />}
//           accent="bg-blue-50"
//         />
//         <StatCard
//           label="Pending Review"
//           count={pending}
//           icon={<Clock className="h-5 w-5 text-amber-600" />}
//           accent="bg-amber-50"
//         />
//         <StatCard
//           label="Approved"
//           count={approved}
//           icon={<Check className="h-5 w-5 text-emerald-600" />}
//           accent="bg-emerald-50"
//         />
//         <StatCard
//           label="Rejected"
//           count={rejected}
//           icon={<AlertCircle className="h-5 w-5 text-red-600" />}
//           accent="bg-red-50"
//         />
//       </div>

//       {/* ── Tabs ── */}
//       <div className="flex flex-wrap gap-2 mb-5">
//         {tabs.map((t) => (
//           <button
//             key={t.key}
//             onClick={() => {
//               setActiveTab(t.key);
//               setSearch("");
//               setStatusFilter("ALL");
//             }}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === t.key
//               ? "bg-red-600 text-white shadow-sm"
//               : "bg-white text-slate-500 border border-slate-200 hover:text-slate-700"
//               }`}
//           >
//             {t.icon}
//             {t.label}
//             <span
//               className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === t.key
//                 ? "bg-white/20 text-white"
//                 : "bg-slate-100 text-slate-500"
//                 }`}
//             >
//               {t.count}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* ── Filter bar ── */}
//       <div className="flex flex-wrap gap-3 mb-5">
//         <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
//           <Filter className="h-3 w-3 text-slate-300 ml-1" />
//           {STATUS_FILTERS.map((s) => (
//             <button
//               key={s}
//               onClick={() => setStatusFilter(s)}
//               className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${statusFilter === s
//                 ? s === "APPROVED"
//                   ? "bg-emerald-600 text-white"
//                   : s === "REJECTED"
//                     ? "bg-red-600 text-white"
//                     : s === "PENDING" || s === "UNDER_REVIEW"
//                       ? "bg-amber-500 text-white"
//                       : "bg-red-600 text-white"
//                 : "text-slate-500 hover:bg-slate-50"
//                 }`}
//             >
//               {s.replace("_", " ")}
//             </button>
//           ))}
//         </div>
//         <div className="relative flex-1 min-w-[200px]">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search records…"
//             className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-slate-400 shadow-sm transition"
//           />
//         </div>
//       </div>

//       {/* ── Table card ── */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         {loading && <LoadingState />}

//         {/* ── USER IDENTITY TAB ── */}
//         {!loading && activeTab === "user-identity" && (
//           <>
//             {filteredUserIdentity.length === 0 ? (
//               <EmptyState message="No user identity KYC records" />
//             ) : (
//               <>
//                 <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     Applicant / Document
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Status
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Submitted
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-right">
//                     Action
//                   </p>
//                 </div>
//                 {filteredUserIdentity.map((k) => (
//                   <div
//                     key={k.id}
//                     className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
//                   >
//                     <div className="flex items-center gap-3 min-w-0 flex-1">
//                       <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
//                         {isValidUrl(k.documentUrl) ? (
//                           <img
//                             src={k.documentUrl}
//                             alt="doc"
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               (
//                                 e.target as HTMLImageElement
//                               ).style.display = "none";
//                             }}
//                           />
//                         ) : (
//                           <FileText className="h-4 w-4 text-slate-400" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {k.user?.name ?? `User #${k.userId}`}
//                         </p>
//                         <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
//                           <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
//                             {k.documentType}
//                           </span>
//                           {k.user?.email && (
//                             <span className="text-[11px] text-slate-400 hidden sm:inline">
//                               {k.user.email}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="w-28 flex justify-center">
//                       <StatusBadge status={k.status} />
//                     </div>
//                     <div className="w-28 text-center">
//                       <span className="text-xs text-slate-400">
//                         {fmtDate(k.createdAt)}
//                       </span>
//                     </div>
//                     <div className="w-24 flex justify-end">
//                       <RowActions
//                         status={k.status}
//                         onReview={() => setSelectedUserIdentity(k)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </>
//         )}

//         {/* ── USER BANK TAB ── */}
//         {!loading && activeTab === "user-bank" && (
//           <>
//             {filteredUserBank.length === 0 ? (
//               <div className="py-16 flex flex-col items-center gap-3 px-6 text-center">
//                 <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
//                   <Landmark className="h-7 w-7 text-slate-300" />
//                 </div>
//                 <p className="text-sm font-bold text-slate-400">
//                   No user bank records
//                 </p>
//                 <p className="text-xs text-slate-300 max-w-xs">
//                   This tab will populate once the backend exposes a GET
//                   endpoint for user bank submissions (e.g.{" "}
//                   <code className="bg-slate-100 px-1 rounded">
//                     GET /api/kyc/admin/bank
//                   </code>
//                   ) and the corresponding API function is added to
//                   admin.api.ts.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     User / Bank
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Status
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Submitted
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-right">
//                     Action
//                   </p>
//                 </div>
//                 {filteredUserBank.map((k) => (
//                   <div
//                     key={k.id}
//                     className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
//                   >
//                     <div className="flex items-center gap-3 min-w-0 flex-1">
//                       <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
//                         <Landmark className="h-4 w-4 text-slate-400" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {k.user?.name ?? `User #${k.userId}`}
//                         </p>
//                         <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
//                           {k.bankName && (
//                             <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
//                               {k.bankName}
//                             </span>
//                           )}
//                           {k.accountNumber && (
//                             <span className="text-[11px] text-slate-400">
//                               {maskAccount(k.accountNumber)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="w-28 flex justify-center">
//                       <StatusBadge status={k.status} />
//                     </div>
//                     <div className="w-28 text-center">
//                       <span className="text-xs text-slate-400">
//                         {fmtDate(k.createdAt)}
//                       </span>
//                     </div>
//                     <div className="w-24 flex justify-end">
//                       <RowActions
//                         status={k.status}
//                         onReview={() => setSelectedUserBank(k)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </>
//         )}

//         {/* ── BENEFICIARY IDENTITY TAB ── */}
//         {!loading && activeTab === "beneficiary-identity" && (
//           <>
//             {filteredBeneficiaryIdentity.length === 0 ? (
//               <div className="py-16 flex flex-col items-center gap-3 px-6 text-center">
//                 <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
//                   <User className="h-7 w-7 text-slate-300" />
//                 </div>
//                 <p className="text-sm font-bold text-slate-400">
//                   No beneficiary identity records
//                 </p>
//                 <p className="text-xs text-slate-300 max-w-xs">
//                   This tab requires a GET endpoint for individual beneficiary
//                   identity submissions. Add the corresponding API function to
//                   admin.api.ts once the backend exposes it.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     Campaign / Beneficiary
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Identity Status
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Submitted
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-right">
//                     Action
//                   </p>
//                 </div>
//                 {filteredBeneficiaryIdentity.map((k) => (
//                   <div
//                     key={k.campaignId}
//                     className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
//                   >
//                     <div className="flex items-center gap-3 min-w-0 flex-1">
//                       <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
//                         <FileText className="h-4 w-4 text-slate-400" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {k.campaignTitle ??
//                             `Campaign #${k.campaignId}`}
//                         </p>
//                         {k.beneficiaryName && (
//                           <p className="text-[11px] text-slate-400 mt-0.5">
//                             Beneficiary: {k.beneficiaryName}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="w-28 flex justify-center">
//                       <StatusBadge status={k.identityStatus} />
//                     </div>
//                     <div className="w-28 text-center">
//                       <span className="text-xs text-slate-400">
//                         {fmtDate(k.createdAt)}
//                       </span>
//                     </div>
//                     <div className="w-24 flex justify-end">
//                       <RowActions
//                         status={k.identityStatus}
//                         onReview={() =>
//                           setSelectedBeneficiaryIdentity(k)
//                         }
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </>
//         )}

//         {/* ── BENEFICIARY BANK TAB ── */}
//         {!loading && activeTab === "beneficiary-bank" && (
//           <>
//             {filteredBeneficiaryBank.length === 0 ? (
//               <div className="py-16 flex flex-col items-center gap-3 px-6 text-center">
//                 <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
//                   <CreditCard className="h-7 w-7 text-slate-300" />
//                 </div>
//                 <p className="text-sm font-bold text-slate-400">
//                   No beneficiary bank records
//                 </p>
//                 <p className="text-xs text-slate-300 max-w-xs">
//                   This tab requires a GET endpoint for beneficiary bank
//                   submissions. Add the corresponding API function once the
//                   backend exposes it.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     Campaign / Bank
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Bank Status
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Submitted
//                   </p>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-right">
//                     Action
//                   </p>
//                 </div>
//                 {filteredBeneficiaryBank.map((k) => (
//                   <div
//                     key={k.campaignId}
//                     className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
//                   >
//                     <div className="flex items-center gap-3 min-w-0 flex-1">
//                       <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
//                         <Landmark className="h-4 w-4 text-slate-400" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {k.campaignTitle ??
//                             `Campaign #${k.campaignId}`}
//                         </p>
//                         {k.beneficiaryName && (
//                           <p className="text-[11px] text-slate-400 mt-0.5">
//                             {k.beneficiaryName} ·{" "}
//                             {maskAccount(k.accountNumber)}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="w-28 flex justify-center">
//                       <StatusBadge status={k.bankStatus} />
//                     </div>
//                     <div className="w-28 text-center">
//                       <span className="text-xs text-slate-400">
//                         {fmtDate(k.createdAt)}
//                       </span>
//                     </div>
//                     <div className="w-24 flex justify-end">
//                       <RowActions
//                         status={k.bankStatus}
//                         onReview={() => setSelectedBeneficiaryBank(k)}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </>
//         )}



//         {/* ── CAMPAIGN PROOF TAB ── */}
//         {!loading && activeTab === "campaign-proof" && (
//           <>
//             {campaignProofs.length === 0 ? (
//               <div className="py-16 flex flex-col items-center gap-3 px-6 text-center">
//                 <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
//                   <Camera className="h-7 w-7 text-slate-300" />
//                 </div>

//                 <p className="text-sm font-bold text-slate-400">
//                   No campaign proof records
//                 </p>

//                 <p className="text-xs text-slate-300 max-w-xs">
//                   No campaign proof submissions are available.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     Campaign / Proof
//                   </p>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Status
//                   </p>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">
//                     Submitted
//                   </p>

//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-right">
//                     Action
//                   </p>
//                 </div>

//                 {campaignProofs.map((k) => (
//                   <div
//                     key={k.id}
//                     className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
//                   >
//                     {/* Campaign / Proof */}
//                     <div className="flex items-center gap-3 min-w-0 flex-1">
//                       <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
//                         <Camera className="h-4 w-4 text-slate-400" />
//                       </div>

//                       <div className="min-w-0">
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {k.campaignTitle ??
//                             `Campaign #${k.campaignId ?? k.id}`}
//                         </p>

//                         <p className="text-[11px] text-slate-400 mt-0.5 truncate">
//                           {k.documentType ?? "Campaign Proof"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Status */}
//                     <div className="w-28 flex justify-center">
//                       <StatusBadge status={k.status} />
//                     </div>

//                     {/* Submitted */}
//                     <div className="w-28 text-center">
//                       <span className="text-xs text-slate-400">
//                         {fmtDate(k.createdAt)}
//                       </span>
//                     </div>

//                     {/* Action */}
//                     <div className="w-24 flex justify-end">
//                       <RowActions
//                         status={k.status}
//                         onReview={() =>
//                           setSelectedCampaignProof(k)
//                         }
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </>
//         )}

//         {/* Footer count */}
//         {!loading && (
//           <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
//             <p className="text-xs text-slate-400">
//               {activeTab === "user-identity" && (
//                 <>
//                   Showing{" "}
//                   <span className="font-bold text-slate-600">
//                     {filteredUserIdentity.length}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-bold text-slate-600">
//                     {userIdentityList.length}
//                   </span>{" "}
//                   records
//                 </>
//               )}
//               {activeTab === "user-bank" && (
//                 <>
//                   <span className="font-bold text-slate-600">
//                     {userBankList.length}
//                   </span>{" "}
//                   records
//                 </>
//               )}
//               {activeTab === "beneficiary-identity" && (
//                 <>
//                   <span className="font-bold text-slate-600">
//                     {beneficiaryIdentityList.length}
//                   </span>{" "}
//                   records
//                 </>
//               )}
//               {activeTab === "beneficiary-bank" && (
//                 <>
//                   <span className="font-bold text-slate-600">
//                     {beneficiaryBankList.length}
//                   </span>{" "}
//                   records
//                 </>
//               )}
//               {activeTab === "campaign-proof" && (
//                 <>
//                   <span className="font-bold text-slate-600">
//                     {campaignProofList.length}
//                   </span>{" "}
//                   records
//                 </>
//               )}
//             </p>
//             {statusFilter !== "ALL" && (
//               <button
//                 onClick={() => setStatusFilter("ALL")}
//                 className="text-xs text-red-500 font-semibold hover:text-red-700 transition"
//               >
//                 Clear filter ×
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }





"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Check,
  X,
  Eye,
  RefreshCw,
  Shield,
  Filter,
  User,
  FileText,
  Clock,
  AlertCircle,
  ChevronRight,
  Landmark,
  Camera,
  ExternalLink,
  Loader2,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

import {
  adminGetSelfIdentity,
  adminUpdateUserKyc,
  adminGetSelfBank,
  adminUpdateUserBank,
  adminGetBeneficiaryIdentity,
  adminUpdateBeneficiaryIdentity,
  adminGetBeneficiaryBank,
  adminUpdateBeneficiaryBank,
  adminGetCampaignProofs,
  adminUpdateCampaignProof,
} from "@/features/admin/api/admin.api";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type ApprovalStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | string;

interface KycUser {
  id: number;
  name: string;
  email: string;
  mobile?: string;
}

// GET /api/kyc/admin/identity
interface SelfIdentityItem {
  id: number;
  userId?: number;
  documentType: string;
  type?: string;
  status: ApprovalStatus;
  documentUrl: string;
  rejectionNote?: string;
  rejectionReason?: string;
  createdAt: string;
  user?: KycUser;
}

// GET /api/kyc/admin/bank
interface SelfBankItem {
  id: number;
  userId?: number;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  cancelledCheque?: string;
  cancelledChequeUrl?: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  user?: KycUser;
}

// GET /api/kyc/admin/beneficiary-identity
interface BeneficiaryIdentityItem {
  beneficiaryId: number;
  campaignId: number;
  campaignTitle?: string;
  beneficiaryName?: string;
  identityDocumentType?: string;
  identityDocumentUrl?: string;
  identityStatus: ApprovalStatus;
  identityRejectionReason?: string;
  createdAt: string;
  user?: KycUser;
}

// GET /api/kyc/admin/beneficiary-bank
interface BeneficiaryBankItem {
  beneficiaryId: number;
  campaignId: number;
  campaignTitle?: string;
  beneficiaryName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  cancelledCheque?: string;
  bankStatus: ApprovalStatus;
  bankRejectionReason?: string;
  bankApprovedAt?: string;
  createdAt: string;
  user?: KycUser;
}

// GET /api/campaign/admin — proof info extracted from campaign
interface CampaignProofItem {
  id: number;
  campaignId?: number;
  campaignTitle?: string;
  documentType?: string;
  documentUrl?: string;
  type?: string;
  status: ApprovalStatus;
  rejectionNote?: string;
  rejectionReason?: string;
  createdAt: string;
  campaign?: { id: number; title: string; createdBy?: number };
  user?: KycUser;
}

type ActiveTab =
  | "self-identity"
  | "self-bank"
  | "beneficiary-identity"
  | "beneficiary-bank"
  | "campaign-proof";

type ModalTarget =
  | { kind: "approve"; label: string; execute: () => Promise<void> }
  | { kind: "reject"; label: string; execute: (r: string) => Promise<void> }
  | null;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function maskAccount(num?: string) {
  if (!num) return "—";
  if (num.length <= 4) return num;
  return "XXXX XXXX " + num.slice(-4);
}

function isValidUrl(url?: string | null) {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function normaliseArray(res: unknown): unknown[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    const r = res as Record<string, unknown>;
    return (r.data as unknown[]) ?? (r.records as unknown[]) ?? [];
  }
  return [];
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */

const statusCfg: Record<string, { pill: string; dot: string; label: string }> = {
  APPROVED: { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", label: "Approved" },
  REJECTED: { pill: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500", label: "Rejected" },
  PENDING: { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400", label: "Pending" },
  UNDER_REVIEW: { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400", label: "Under Review" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusCfg[status] ?? {
    pill: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
    label: status,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   DOCUMENT PREVIEW
───────────────────────────────────────────── */

function DocPreview({ url, label }: { url?: string | null; label?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!isValidUrl(url)) {
    return (
      <div className="bg-slate-50 rounded-xl p-6 text-xs text-slate-400 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-2">
        <FileText className="h-6 w-6 text-slate-300" />
        <span>{label ?? "No document available"}</span>
      </div>
    );
  }

  const isPdf = url!.includes(".pdf") || url!.includes("raw/");

  if (isPdf || imgFailed) {
    return (
      <a
        href={url!}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-100 transition font-medium"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <Eye className="h-4 w-4 text-blue-500" />
        </div>
        {label ?? "View Document"}
        <ExternalLink className="h-3.5 w-3.5 ml-auto text-blue-400" />
      </a>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
      <img
        src={url!}
        alt={label ?? "Document"}
        className="w-full max-h-52 object-contain bg-white"
        onError={() => setImgFailed(true)}
      />
      <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50">
        <span className="text-[10px] text-slate-400 font-medium">{label ?? "Preview"}</span>
        <a
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-semibold"
        >
          <ExternalLink className="h-3 w-3" /> Full size
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REJECTION MODAL
───────────────────────────────────────────── */

function RejectModal({ open, title, onClose, onConfirm, busy }: {
  open: boolean; title: string;
  onClose: () => void; onConfirm: (r: string) => void; busy: boolean;
}) {
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { if (open) { setReason(""); setErr(""); } }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <X className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">This reason will be shown to the applicant.</p>
          </div>
        </div>
        <textarea
          autoFocus rows={4} placeholder="Enter rejection reason…"
          value={reason}
          onChange={(e) => { setReason(e.target.value); setErr(""); }}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 transition"
        />
        {err && <p className="mt-1.5 text-xs text-red-500 font-medium">{err}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => {
              const t = reason.trim();
              if (!t) { setErr("Rejection reason is required."); return; }
              onConfirm(t);
            }}
            disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONFIRM MODAL
───────────────────────────────────────────── */

function ConfirmModal({ open, title, description, onClose, onConfirm, busy }: {
  open: boolean; title: string; description: string;
  onClose: () => void; onConfirm: () => void; busy: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-5">{description}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DRAWER SHELL
───────────────────────────────────────────── */

function Drawer({ title, subtitle, statusEl, onClose, children, footer }: {
  title: string; subtitle?: string; statusEl?: React.ReactNode;
  onClose: () => void; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 shrink-0 bg-white">
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-slate-900 truncate">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {statusEl}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>
        {footer && (
          <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50">{footer}</div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   ACTION FOOTER
───────────────────────────────────────────── */

function ActionFooter({ status, busy, onApprove, onReject }: {
  status: ApprovalStatus; busy: boolean; onApprove: () => void; onReject: () => void;
}) {
  if (status === "APPROVED") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 border border-emerald-200">
        <Check className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-bold text-emerald-700">Already Approved</span>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <button onClick={onReject} disabled={busy}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition disabled:opacity-50">
        <X className="h-4 w-4" /> Reject
      </button>
      <button onClick={onApprove} disabled={busy}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Approve
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFO GRID
───────────────────────────────────────────── */

function InfoGrid({ rows }: { rows: { label: string; value?: string | null }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {rows.filter((r) => r.value).map((r) => (
        <div key={r.label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{r.label}</p>
          <p className="text-sm font-bold text-slate-700">{r.value}</p>
        </div>
      ))}
    </div>
  );
}

function RejectionNote({ note }: { note?: string | null }) {
  if (!note) return null;
  return (
    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
      <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
      <p className="text-xs text-red-700 leading-relaxed">{note}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DRAWER: SELF IDENTITY
───────────────────────────────────────────── */

function SelfIdentityDrawer({ item, onClose, onRefresh }: {
  item: SelfIdentityItem; onClose: () => void; onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<ModalTarget>(null);

  const run = async (fn: () => Promise<void>) => {
    try { setBusy(true); await fn(); setModal(null); onRefresh(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusy(false); }
  };

  return (
    <>
      <ConfirmModal
        open={modal?.kind === "approve"}
        title="Approve Identity KYC?"
        description="Are you sure you want to approve this identity document?"
        onClose={() => setModal(null)}
        onConfirm={() => modal?.kind === "approve" && run(modal.execute)}
        busy={busy}
      />
      <RejectModal
        open={modal?.kind === "reject"}
        title="Reject Identity KYC"
        onClose={() => setModal(null)}
        onConfirm={(r) => modal?.kind === "reject" && run(() => modal.execute(r))}
        busy={busy}
      />
      <Drawer
        title={item.user?.name ?? `User #${item.userId}`}
        subtitle={`Self Identity KYC — Record #${item.id}`}
        statusEl={<StatusBadge status={item.status} />}
        onClose={onClose}
        footer={
          <ActionFooter
            status={item.status} busy={busy}
            onApprove={() => setModal({
              kind: "approve", label: "Identity KYC",
              execute: async () => {
                await adminUpdateUserKyc(item.id, "APPROVED");
                toast.success("Identity KYC approved");
              },
            })}
            onReject={() => setModal({
              kind: "reject", label: "Identity KYC",
              execute: async (reason) => {
                await adminUpdateUserKyc(item.id, "REJECTED", reason);
                toast.success("Identity KYC rejected");
              },
            })}
          />
        }
      >
        {item.user && (
          <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700 shrink-0">
              {(item.user.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{item.user.name}</p>
              <p className="text-xs text-slate-400">{item.user.email}</p>
              {item.user.mobile && <p className="text-xs text-slate-400">{item.user.mobile}</p>}
            </div>
          </div>
        )}
        <InfoGrid rows={[
          { label: "Document Type", value: item.documentType },
          { label: "KYC Type", value: item.type },
          { label: "Submitted On", value: fmtDate(item.createdAt) },
          { label: "Status", value: item.status },
        ]} />
        <DocPreview url={item.documentUrl} label={item.documentType ?? "Identity Document"} />
        <RejectionNote note={item.rejectionNote ?? item.rejectionReason} />
      </Drawer>
    </>
  );
}

/* ─────────────────────────────────────────────
   DRAWER: SELF BANK
───────────────────────────────────────────── */

function SelfBankDrawer({ item, onClose, onRefresh }: {
  item: SelfBankItem; onClose: () => void; onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<ModalTarget>(null);

  const run = async (fn: () => Promise<void>) => {
    try { setBusy(true); await fn(); setModal(null); onRefresh(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusy(false); }
  };

  const chequeUrl = item.cancelledCheque ?? item.cancelledChequeUrl;

  return (
    <>
      <ConfirmModal
        open={modal?.kind === "approve"}
        title="Approve Bank Details?"
        description="Are you sure you want to approve these bank account details?"
        onClose={() => setModal(null)}
        onConfirm={() => modal?.kind === "approve" && run(modal.execute)}
        busy={busy}
      />
      <RejectModal
        open={modal?.kind === "reject"}
        title="Reject Bank Details"
        onClose={() => setModal(null)}
        onConfirm={(r) => modal?.kind === "reject" && run(() => modal.execute(r))}
        busy={busy}
      />
      <Drawer
        title={item.user?.name ?? `User #${item.userId}`}
        subtitle={`Self Bank Review — Record #${item.id}`}
        statusEl={<StatusBadge status={item.status} />}
        onClose={onClose}
        footer={
          <ActionFooter
            status={item.status} busy={busy}
            onApprove={() => setModal({
              kind: "approve", label: "Bank Details",
              execute: async () => {
                await adminUpdateUserBank(item.id, "APPROVED");
                toast.success("Bank details approved");
              },
            })}
            onReject={() => setModal({
              kind: "reject", label: "Bank Details",
              execute: async (reason) => {
                await adminUpdateUserBank(item.id, "REJECTED", reason);
                toast.success("Bank details rejected");
              },
            })}
          />
        }
      >
        {item.user && (
          <div className="rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700 shrink-0">
              {(item.user.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{item.user.name}</p>
              <p className="text-xs text-slate-400">{item.user.email}</p>
            </div>
          </div>
        )}
        <InfoGrid rows={[
          { label: "Account Holder", value: item.accountHolderName },
          { label: "Account Number", value: maskAccount(item.accountNumber) },
          { label: "IFSC Code", value: item.ifscCode },
          { label: "Bank Name", value: item.bankName },
          { label: "Branch", value: item.branchName },
          { label: "Submitted On", value: fmtDate(item.createdAt) },
        ]} />
        {chequeUrl && <DocPreview url={chequeUrl} label="Cancelled Cheque" />}
        <RejectionNote note={item.rejectionReason} />
      </Drawer>
    </>
  );
}

/* ─────────────────────────────────────────────
   DRAWER: BENEFICIARY IDENTITY
───────────────────────────────────────────── */

function BeneficiaryIdentityDrawer({ item, onClose, onRefresh }: {
  item: BeneficiaryIdentityItem; onClose: () => void; onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<ModalTarget>(null);

  const run = async (fn: () => Promise<void>) => {
    try { setBusy(true); await fn(); setModal(null); onRefresh(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusy(false); }
  };

  return (
    <>
      <ConfirmModal
        open={modal?.kind === "approve"}
        title="Approve Beneficiary Identity?"
        description="Are you sure you want to approve this beneficiary identity document?"
        onClose={() => setModal(null)}
        onConfirm={() => modal?.kind === "approve" && run(modal.execute)}
        busy={busy}
      />
      <RejectModal
        open={modal?.kind === "reject"}
        title="Reject Beneficiary Identity"
        onClose={() => setModal(null)}
        onConfirm={(r) => modal?.kind === "reject" && run(() => modal.execute(r))}
        busy={busy}
      />
      <Drawer
        title={item.campaignTitle ?? `Campaign #${item.campaignId}`}
        subtitle={`Individual Beneficiary Identity — Campaign #${item.campaignId}`}
        statusEl={<StatusBadge status={item.identityStatus} />}
        onClose={onClose}
        footer={
          <ActionFooter
            status={item.identityStatus} busy={busy}
            onApprove={() => setModal({
              kind: "approve", label: "Beneficiary Identity",
              execute: async () => {
                await adminUpdateBeneficiaryIdentity(item.campaignId, "APPROVED");
                toast.success("Beneficiary identity approved");
              },
            })}
            onReject={() => setModal({
              kind: "reject", label: "Beneficiary Identity",
              execute: async (reason) => {
                await adminUpdateBeneficiaryIdentity(item.campaignId, "REJECTED", reason);
                toast.success("Beneficiary identity rejected");
              },
            })}
          />
        }
      >
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Campaign</p>
          <p className="text-sm font-bold text-slate-800">{item.campaignTitle ?? `#${item.campaignId}`}</p>
          <p className="text-xs text-slate-400 mt-0.5">Campaign ID: #{item.campaignId}</p>
        </div>
        <InfoGrid rows={[
          { label: "Beneficiary Name", value: item.beneficiaryName },
          { label: "Document Type", value: item.identityDocumentType },
          { label: "Submitted On", value: fmtDate(item.createdAt) },
          { label: "Beneficiary ID", value: String(item.beneficiaryId) },
        ]} />
        <DocPreview url={item.identityDocumentUrl} label={item.identityDocumentType ?? "Identity Document"} />
        <RejectionNote note={item.identityRejectionReason} />
      </Drawer>
    </>
  );
}

/* ─────────────────────────────────────────────
   DRAWER: BENEFICIARY BANK
───────────────────────────────────────────── */

function BeneficiaryBankDrawer({ item, onClose, onRefresh }: {
  item: BeneficiaryBankItem; onClose: () => void; onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<ModalTarget>(null);

  const run = async (fn: () => Promise<void>) => {
    try { setBusy(true); await fn(); setModal(null); onRefresh(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusy(false); }
  };

  const chequeUrl = item.cancelledCheque;

  return (
    <>
      <ConfirmModal
        open={modal?.kind === "approve"}
        title="Approve Beneficiary Bank?"
        description="Are you sure you want to approve these beneficiary bank details?"
        onClose={() => setModal(null)}
        onConfirm={() => modal?.kind === "approve" && run(modal.execute)}
        busy={busy}
      />
      <RejectModal
        open={modal?.kind === "reject"}
        title="Reject Beneficiary Bank"
        onClose={() => setModal(null)}
        onConfirm={(r) => modal?.kind === "reject" && run(() => modal.execute(r))}
        busy={busy}
      />
      <Drawer
        title={item.campaignTitle ?? `Campaign #${item.campaignId}`}
        subtitle={`Individual Beneficiary Bank — Campaign #${item.campaignId}`}
        statusEl={<StatusBadge status={item.bankStatus} />}
        onClose={onClose}
        footer={
          <ActionFooter
            status={item.bankStatus} busy={busy}
            onApprove={() => setModal({
              kind: "approve", label: "Beneficiary Bank",
              execute: async () => {
                await adminUpdateBeneficiaryBank(item.campaignId, "APPROVED");
                toast.success("Beneficiary bank approved");
              },
            })}
            onReject={() => setModal({
              kind: "reject", label: "Beneficiary Bank",
              execute: async (reason) => {
                await adminUpdateBeneficiaryBank(item.campaignId, "REJECTED", reason);
                toast.success("Beneficiary bank rejected");
              },
            })}
          />
        }
      >
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Campaign</p>
          <p className="text-sm font-bold text-slate-800">{item.campaignTitle ?? `#${item.campaignId}`}</p>
          {item.beneficiaryName && (
            <p className="text-xs text-slate-400 mt-0.5">Beneficiary: {item.beneficiaryName}</p>
          )}
        </div>
        <InfoGrid rows={[
          { label: "Account Holder", value: item.accountHolderName },
          { label: "Account Number", value: maskAccount(item.accountNumber) },
          { label: "IFSC Code", value: item.ifscCode },
          { label: "Bank Name", value: item.bankName },
          { label: "Branch", value: item.branchName },
          { label: "Submitted On", value: fmtDate(item.createdAt) },
        ]} />
        {chequeUrl && <DocPreview url={chequeUrl} label="Cancelled Cheque" />}
        <RejectionNote note={item.bankRejectionReason} />
      </Drawer>
    </>
  );
}

/* ─────────────────────────────────────────────
   DRAWER: CAMPAIGN PROOF
───────────────────────────────────────────── */

function CampaignProofDrawer({ item, onClose, onRefresh }: {
  item: CampaignProofItem; onClose: () => void; onRefresh: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<ModalTarget>(null);

  const run = async (fn: () => Promise<void>) => {
    try { setBusy(true); await fn(); setModal(null); onRefresh(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusy(false); }
  };

  return (
    <>
      <ConfirmModal
        open={modal?.kind === "approve"}
        title="Approve Campaign Proof?"
        description="Are you sure you want to approve this campaign proof document?"
        onClose={() => setModal(null)}
        onConfirm={() => modal?.kind === "approve" && run(modal.execute)}
        busy={busy}
      />
      <RejectModal
        open={modal?.kind === "reject"}
        title="Reject Campaign Proof"
        onClose={() => setModal(null)}
        onConfirm={(r) => modal?.kind === "reject" && run(() => modal.execute(r))}
        busy={busy}
      />
      <Drawer
        title={item.campaignTitle ?? item.campaign?.title ?? `Campaign #${item.campaignId ?? item.id}`}
        subtitle={`Campaign Proof Review — Record #${item.id}`}
        statusEl={<StatusBadge status={item.status} />}
        onClose={onClose}
        footer={
          <ActionFooter
            status={item.status} busy={busy}
            onApprove={() => setModal({
              kind: "approve", label: "Campaign Proof",
              execute: async () => {
                await adminUpdateCampaignProof(item.id, "APPROVED");
                toast.success("Campaign proof approved");
              },
            })}
            onReject={() => setModal({
              kind: "reject", label: "Campaign Proof",
              execute: async (reason) => {
                await adminUpdateCampaignProof(item.id, "REJECTED", reason);
                toast.success("Campaign proof rejected");
              },
            })}
          />
        }
      >
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Campaign</p>
          <p className="text-sm font-bold text-slate-800">
            {item.campaignTitle ?? item.campaign?.title ?? `Campaign #${item.campaignId ?? item.id}`}
          </p>
          {item.user && (
            <p className="text-xs text-slate-400 mt-1">by {item.user.name} · {item.user.email}</p>
          )}
        </div>
        <InfoGrid rows={[
          { label: "Document Type", value: item.documentType ?? item.type },
          { label: "Submitted On", value: fmtDate(item.createdAt) },
          { label: "Status", value: item.status },
        ]} />
        <DocPreview url={item.documentUrl} label="Campaign Proof Document" />
        <RejectionNote note={item.rejectionNote ?? item.rejectionReason} />
      </Drawer>
    </>
  );
}

/* ─────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────── */

function StatCard({ label, count, icon, accent }: {
  label: string; count: number; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{count}</p>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-16 flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      <p className="text-sm text-slate-400 font-medium">Loading records…</p>
    </div>
  );
}

function EmptyState({ icon, message, hint }: { icon?: React.ReactNode; message: string; hint?: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        {icon ?? <Shield className="h-7 w-7 text-slate-300" />}
      </div>
      <p className="text-sm font-bold text-slate-400">{message}</p>
      {hint && <p className="text-xs text-slate-300 max-w-xs">{hint}</p>}
    </div>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div className={`hidden md:grid gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100`}
      style={{ gridTemplateColumns: `1fr ${cols.slice(1).map(() => "auto").join(" ")}` }}>
      {cols.map((c) => (
        <p key={c} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c}</p>
      ))}
    </div>
  );
}

function ReviewBtn({ onReview }: { onReview: () => void }) {
  return (
    <button
      onClick={onReview}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-red-600 hover:text-white transition"
    >
      Review <ChevronRight className="h-3 w-3" />
    </button>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function AdminKycPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("self-identity");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selfIdentityList, setSelfIdentityList] = useState<SelfIdentityItem[]>([]);
  const [selfBankList, setSelfBankList] = useState<SelfBankItem[]>([]);
  const [beneficiaryIdentityList, setBeneficiaryIdentityList] = useState<BeneficiaryIdentityItem[]>([]);
  const [beneficiaryBankList, setBeneficiaryBankList] = useState<BeneficiaryBankItem[]>([]);
  const [campaignProofList, setCampaignProofList] = useState<CampaignProofItem[]>([]);

  // Drawer state
  const [selSelfId, setSelSelfId] = useState<SelfIdentityItem | null>(null);
  const [selSelfBank, setSelSelfBank] = useState<SelfBankItem | null>(null);
  const [selBenId, setSelBenId] = useState<BeneficiaryIdentityItem | null>(null);
  const [selBenBank, setSelBenBank] = useState<BeneficiaryBankItem | null>(null);
  const [selProof, setSelProof] = useState<CampaignProofItem | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const settled = await Promise.allSettled([
      adminGetSelfIdentity(),
      adminGetSelfBank(),
      adminGetBeneficiaryIdentity(),
      adminGetBeneficiaryBank(),
      adminGetCampaignProofs(),
    ]);

    // Self identity
    if (settled[0].status === "fulfilled") {
      setSelfIdentityList(normaliseArray(settled[0].value) as SelfIdentityItem[]);
    } else {
      console.error("Self identity fetch failed:", settled[0].reason);
    }

    // Self bank
    if (settled[1].status === "fulfilled") {
      setSelfBankList(normaliseArray(settled[1].value) as SelfBankItem[]);
    } else {
      console.error("Self bank fetch failed:", settled[1].reason);
    }

    // Beneficiary identity
    if (settled[2].status === "fulfilled") {
      setBeneficiaryIdentityList(normaliseArray(settled[2].value) as BeneficiaryIdentityItem[]);
    } else {
      console.error("Beneficiary identity fetch failed:", settled[2].reason);
    }

    // Beneficiary bank
    if (settled[3].status === "fulfilled") {
      setBeneficiaryBankList(normaliseArray(settled[3].value) as BeneficiaryBankItem[]);
    } else {
      console.error("Beneficiary bank fetch failed:", settled[3].reason);
    }

    // Campaign proofs — from GET /api/campaign/admin
    if (settled[4].status === "fulfilled") {
      const raw = normaliseArray(
        settled[4].value
      ) as Record<string, unknown>[];

      const proofs: CampaignProofItem[] = raw.map((item) => {
        const campaign = item.campaign as
          | Record<string, unknown>
          | undefined;

        return {
          id: item.id as number,

          campaignId: item.campaignId as number,

          campaignTitle:
            (campaign?.title as string) ??
            `Campaign #${item.campaignId}`,

          documentType:
            (item.documentType as string) ??
            (item.type as string) ??
            "Campaign Proof",

          documentUrl:
            item.documentUrl as string | undefined,

          type:
            item.type as string | undefined,

          status:
            (item.status as ApprovalStatus) ??
            "PENDING",

          rejectionNote:
            item.rejectionNote as string | undefined,

          rejectionReason:
            item.rejectionReason as string | undefined,

          createdAt:
            item.createdAt as string,
        };
      });

      setCampaignProofList(proofs);
    } else {
      console.error(
        "Campaign proofs fetch failed:",
        settled[4].reason
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Filter ── */
  function applyFilter<T>(list: T[], getStatus: (i: T) => string): T[] {
    return list.filter((item) => {
      const st = getStatus(item);
      const matchStatus = statusFilter === "ALL" || st === statusFilter;
      const s = search.toLowerCase();
      const matchSearch = !s || JSON.stringify(item).toLowerCase().includes(s);
      return matchStatus && matchSearch;
    });
  }

  const filteredSelfId = applyFilter(selfIdentityList, (i) => i.status);
  const filteredSelfBank = applyFilter(selfBankList, (i) => i.status);
  const filteredBenId = applyFilter(beneficiaryIdentityList, (i) => i.identityStatus);
  const filteredBenBank = applyFilter(beneficiaryBankList, (i) => i.bankStatus);
  const filteredProofs = applyFilter(campaignProofList, (i) => i.status);

  /* ── Stats ── */
  const totalPending = [
    ...selfIdentityList.filter((i) => i.status === "PENDING"),
    ...selfBankList.filter((i) => i.status === "PENDING"),
    ...beneficiaryIdentityList.filter((i) => i.identityStatus === "PENDING"),
    ...beneficiaryBankList.filter((i) => i.bankStatus === "PENDING"),
    ...campaignProofList.filter((i) => i.status === "PENDING"),
  ].length;

  const totalApproved = [
    ...selfIdentityList.filter((i) => i.status === "APPROVED"),
    ...selfBankList.filter((i) => i.status === "APPROVED"),
    ...beneficiaryIdentityList.filter((i) => i.identityStatus === "APPROVED"),
    ...beneficiaryBankList.filter((i) => i.bankStatus === "APPROVED"),
    ...campaignProofList.filter((i) => i.status === "APPROVED"),
  ].length;

  const totalRejected = [
    ...selfIdentityList.filter((i) => i.status === "REJECTED"),
    ...selfBankList.filter((i) => i.status === "REJECTED"),
    ...beneficiaryIdentityList.filter((i) => i.identityStatus === "REJECTED"),
    ...beneficiaryBankList.filter((i) => i.bankStatus === "REJECTED"),
    ...campaignProofList.filter((i) => i.status === "REJECTED"),
  ].length;

  const totalAll =
    selfIdentityList.length +
    selfBankList.length +
    beneficiaryIdentityList.length +
    beneficiaryBankList.length +
    campaignProofList.length;

  const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

  const tabs = [
    { key: "self-identity" as ActiveTab, label: "Self Identity", icon: <User className="h-3.5 w-3.5" />, count: selfIdentityList.length },
    { key: "self-bank" as ActiveTab, label: "Self Bank", icon: <Landmark className="h-3.5 w-3.5" />, count: selfBankList.length },
    { key: "beneficiary-identity" as ActiveTab, label: "Beneficiary Identity", icon: <Shield className="h-3.5 w-3.5" />, count: beneficiaryIdentityList.length },
    { key: "beneficiary-bank" as ActiveTab, label: "Beneficiary Bank", icon: <CreditCard className="h-3.5 w-3.5" />, count: beneficiaryBankList.length },
    { key: "campaign-proof" as ActiveTab, label: "Campaign Proof", icon: <Camera className="h-3.5 w-3.5" />, count: campaignProofList.length },
  ];

  const refreshTab = () => { fetchAll(); };

  return (
    <>
      {/* ── Drawers ── */}
      {selSelfId && <SelfIdentityDrawer item={selSelfId} onClose={() => setSelSelfId(null)} onRefresh={() => { refreshTab(); setSelSelfId(null); }} />}
      {selSelfBank && <SelfBankDrawer item={selSelfBank} onClose={() => setSelSelfBank(null)} onRefresh={() => { refreshTab(); setSelSelfBank(null); }} />}
      {selBenId && <BeneficiaryIdentityDrawer item={selBenId} onClose={() => setSelBenId(null)} onRefresh={() => { refreshTab(); setSelBenId(null); }} />}
      {selBenBank && <BeneficiaryBankDrawer item={selBenBank} onClose={() => setSelBenBank(null)} onRefresh={() => { refreshTab(); setSelBenBank(null); }} />}
      {selProof && <CampaignProofDrawer item={selProof} onClose={() => setSelProof(null)} onRefresh={() => { refreshTab(); setSelProof(null); }} />}

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-extrabold text-slate-900">KYC & Campaign Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">Review identity documents and approve campaign verification steps.</p>
        </div>
        <button onClick={fetchAll}
          className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto shadow-sm">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Records" count={totalAll} icon={<Shield className="h-5 w-5 text-blue-600" />} accent="bg-blue-50" />
        <StatCard label="Pending Review" count={totalPending} icon={<Clock className="h-5 w-5 text-amber-600" />} accent="bg-amber-50" />
        <StatCard label="Approved" count={totalApproved} icon={<Check className="h-5 w-5 text-emerald-600" />} accent="bg-emerald-50" />
        <StatCard label="Rejected" count={totalRejected} icon={<AlertCircle className="h-5 w-5 text-red-600" />} accent="bg-red-50" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => (
          <button key={t.key}
            onClick={() => { setActiveTab(t.key); setSearch(""); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === t.key
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:text-slate-700"
              }`}>
            {t.icon}
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <Filter className="h-3 w-3 text-slate-300 ml-1" />
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${statusFilter === s
                  ? s === "APPROVED" ? "bg-emerald-600 text-white"
                    : s === "REJECTED" ? "bg-red-600 text-white"
                      : s === "PENDING" ? "bg-amber-500 text-white"
                        : "bg-red-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
                }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records…"
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-slate-400 shadow-sm transition" />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && <LoadingState />}

        {/* SELF IDENTITY */}
        {!loading && activeTab === "self-identity" && (
          filteredSelfId.length === 0
            ? <EmptyState icon={<User className="h-7 w-7 text-slate-300" />} message="No self identity KYC records" />
            : <>
              <TableHeader cols={["Applicant / Document", "Status", "Submitted", "Action"]} />
              {filteredSelfId.map((k) => (
                <div key={k.id} className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                      {isValidUrl(k.documentUrl)
                        ? <img src={k.documentUrl} alt="doc" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        : <FileText className="h-4 w-4 text-slate-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{k.user?.name ?? `User #${k.userId}`}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{k.documentType}</span>
                        {k.user?.email && <span className="text-[11px] text-slate-400 hidden sm:inline">{k.user.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="w-28 flex justify-center"><StatusBadge status={k.status} /></div>
                  <div className="w-28 text-center"><span className="text-xs text-slate-400">{fmtDate(k.createdAt)}</span></div>
                  <div className="w-24 flex justify-end"><ReviewBtn onReview={() => setSelSelfId(k)} /></div>
                </div>
              ))}
            </>
        )}

        {/* SELF BANK */}
        {!loading && activeTab === "self-bank" && (
          filteredSelfBank.length === 0
            ? <EmptyState icon={<Landmark className="h-7 w-7 text-slate-300" />} message="No self bank records" />
            : <>
              <TableHeader cols={["User / Bank", "Status", "Submitted", "Action"]} />
              {filteredSelfBank.map((k) => (
                <div key={k.id} className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Landmark className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{k.user?.name ?? `User #${k.userId}`}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {k.bankName && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{k.bankName}</span>}
                        {k.accountNumber && <span className="text-[11px] text-slate-400">{maskAccount(k.accountNumber)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="w-28 flex justify-center"><StatusBadge status={k.status} /></div>
                  <div className="w-28 text-center"><span className="text-xs text-slate-400">{fmtDate(k.createdAt)}</span></div>
                  <div className="w-24 flex justify-end"><ReviewBtn onReview={() => setSelSelfBank(k)} /></div>
                </div>
              ))}
            </>
        )}

        {/* BENEFICIARY IDENTITY */}
        {!loading && activeTab === "beneficiary-identity" && (
          filteredBenId.length === 0
            ? <EmptyState icon={<User className="h-7 w-7 text-slate-300" />} message="No individual beneficiary identity records" />
            : <>
              <TableHeader cols={["Campaign / Beneficiary", "Identity Status", "Submitted", "Action"]} />
              {filteredBenId.map((k) => (
                <div key={`${k.campaignId}-${k.beneficiaryId}`} className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{k.campaignTitle ?? `Campaign #${k.campaignId}`}</p>
                      {k.beneficiaryName && <p className="text-[11px] text-slate-400 mt-0.5">Beneficiary: {k.beneficiaryName}</p>}
                    </div>
                  </div>
                  <div className="w-28 flex justify-center"><StatusBadge status={k.identityStatus} /></div>
                  <div className="w-28 text-center"><span className="text-xs text-slate-400">{fmtDate(k.createdAt)}</span></div>
                  <div className="w-24 flex justify-end"><ReviewBtn onReview={() => setSelBenId(k)} /></div>
                </div>
              ))}
            </>
        )}

        {/* BENEFICIARY BANK */}
        {!loading && activeTab === "beneficiary-bank" && (
          filteredBenBank.length === 0
            ? <EmptyState icon={<CreditCard className="h-7 w-7 text-slate-300" />} message="No individual beneficiary bank records" />
            : <>
              <TableHeader cols={["Campaign / Bank", "Bank Status", "Submitted", "Action"]} />
              {filteredBenBank.map((k) => (
                <div key={`${k.campaignId}-${k.beneficiaryId}`} className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Landmark className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{k.campaignTitle ?? `Campaign #${k.campaignId}`}</p>
                      {k.beneficiaryName && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{k.beneficiaryName} · {maskAccount(k.accountNumber)}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-28 flex justify-center"><StatusBadge status={k.bankStatus} /></div>
                  <div className="w-28 text-center"><span className="text-xs text-slate-400">{fmtDate(k.createdAt)}</span></div>
                  <div className="w-24 flex justify-end"><ReviewBtn onReview={() => setSelBenBank(k)} /></div>
                </div>
              ))}
            </>
        )}

        {/* CAMPAIGN PROOF */}
        {!loading && activeTab === "campaign-proof" && (
          filteredProofs.length === 0
            ? <EmptyState icon={<Camera className="h-7 w-7 text-slate-300" />} message="No campaign proof records" />
            : <>
              <TableHeader cols={["Campaign / Proof", "Status", "Submitted", "Action"]} />
              {filteredProofs.map((k) => (
                <div key={k.id} className="flex flex-wrap md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Camera className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {k.campaignTitle ?? k.campaign?.title ?? `Campaign #${k.campaignId ?? k.id}`}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{k.documentType ?? k.type ?? "Campaign Proof"}</p>
                    </div>
                  </div>
                  <div className="w-28 flex justify-center"><StatusBadge status={k.status} /></div>
                  <div className="w-28 text-center"><span className="text-xs text-slate-400">{fmtDate(k.createdAt)}</span></div>
                  <div className="w-24 flex justify-end"><ReviewBtn onReview={() => setSelProof(k)} /></div>
                </div>
              ))}
            </>
        )}

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {activeTab === "self-identity" && <><span className="font-bold text-slate-600">{filteredSelfId.length}</span> of <span className="font-bold text-slate-600">{selfIdentityList.length}</span> records</>}
              {activeTab === "self-bank" && <><span className="font-bold text-slate-600">{filteredSelfBank.length}</span> of <span className="font-bold text-slate-600">{selfBankList.length}</span> records</>}
              {activeTab === "beneficiary-identity" && <><span className="font-bold text-slate-600">{filteredBenId.length}</span> of <span className="font-bold text-slate-600">{beneficiaryIdentityList.length}</span> records</>}
              {activeTab === "beneficiary-bank" && <><span className="font-bold text-slate-600">{filteredBenBank.length}</span> of <span className="font-bold text-slate-600">{beneficiaryBankList.length}</span> records</>}
              {activeTab === "campaign-proof" && <><span className="font-bold text-slate-600">{filteredProofs.length}</span> of <span className="font-bold text-slate-600">{campaignProofList.length}</span> records</>}
            </p>
            {statusFilter !== "ALL" && (
              <button onClick={() => setStatusFilter("ALL")} className="text-xs text-red-500 font-semibold hover:text-red-700 transition">
                Clear filter ×
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

