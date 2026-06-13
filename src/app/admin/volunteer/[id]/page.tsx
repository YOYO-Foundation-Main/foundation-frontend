// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// import {
//   getVolunteerById,
//   updateVolunteerStatus,
// } from "@/features/admin/api/admin.api";

// export default function VolunteerDetailsPage() {

//   const params = useParams();

//   const id = Number(params.id);

//   const [loading, setLoading] =
//     useState(true);

//   const [volunteer, setVolunteer] =
//     useState<any>(null);

//   const loadVolunteer =
//     async () => {

//       try {

//         const res =
//           await getVolunteerById(id);

//         setVolunteer(res.data);

//       } catch (error) {

//         console.error(error);

//       } finally {

//         setLoading(false);
//       }
//     };

//   useEffect(() => {

//     if (id) {
//       loadVolunteer();
//     }

//   }, [id]);

//   const changeStatus =
//     async (
//       status:
//         | "APPROVED"
//         | "REJECTED"
//     ) => {

//       try {

//         await updateVolunteerStatus(
//           id,
//           status
//         );

//         await loadVolunteer();

//       } catch (error) {

//         console.error(error);
//       }
//     };

//   if (loading) {
//     return (
//       <div className="p-6">
//         Loading...
//       </div>
//     );
//   }

//   if (!volunteer) {
//     return (
//       <div className="p-6">
//         Volunteer not found
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">

//       {/* HEADER */}

//       <div className="bg-white rounded-xl border p-6">

//         <div className="flex justify-between items-center">

//           <div>

//             <h1 className="text-2xl font-bold">
//               {volunteer.fullName}
//             </h1>

//             <p className="text-gray-500">
//               Volunteer Application
//             </p>

//           </div>

//           <div className="flex gap-3">

//             <button
//               onClick={() =>
//                 changeStatus(
//                   "APPROVED"
//                 )
//               }
//               className="px-4 py-2 bg-green-600 text-white rounded-lg"
//             >
//               Approve
//             </button>

//             <button
//               onClick={() =>
//                 changeStatus(
//                   "REJECTED"
//                 )
//               }
//               className="px-4 py-2 bg-red-600 text-white rounded-lg"
//             >
//               Reject
//             </button>

//           </div>

//         </div>

//       </div>

//       {/* PERSONAL DETAILS */}

//       <div className="bg-white rounded-xl border p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Personal Information
//         </h2>

//         <div className="grid grid-cols-2 gap-4">

//           <Info
//             label="Full Name"
//             value={
//               volunteer.fullName
//             }
//           />

//           <Info
//             label="Email"
//             value={
//               volunteer.email
//             }
//           />

//           <Info
//             label="Mobile"
//             value={
//               volunteer.mobile
//             }
//           />

//           <Info
//             label="Age"
//             value={
//               volunteer.age
//             }
//           />

//           <Info
//             label="Gender"
//             value={
//               volunteer.gender
//             }
//           />

//           <Info
//             label="City"
//             value={
//               volunteer.city
//             }
//           />

//           <Info
//             label="State"
//             value={
//               volunteer.state
//             }
//           />

//           <Info
//             label="Availability"
//             value={
//               volunteer.availability
//             }
//           />

//           <Info
//             label="Weekly Hours"
//             value={
//               volunteer.weeklyHours
//             }
//           />

//         </div>

//       </div>

//       {/* SKILLS */}

//       <div className="bg-white rounded-xl border p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Skills
//         </h2>

//         <div className="flex flex-wrap gap-2">

//           {volunteer.skills?.map(
//             (
//               item: any
//             ) => (
//               <span
//                 key={item.id}
//                 className="px-3 py-1 rounded-full bg-blue-100 text-blue-700"
//               >
//                 {item.skill}
//               </span>
//             )
//           )}

//         </div>

//       </div>

//       {/* INTERESTS */}

//       <div className="bg-white rounded-xl border p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Interests
//         </h2>

//         <div className="flex flex-wrap gap-2">

//           {volunteer.interests?.map(
//             (
//               item: any
//             ) => (
//               <span
//                 key={item.id}
//                 className="px-3 py-1 rounded-full bg-green-100 text-green-700"
//               >
//                 {item.interest}
//               </span>
//             )
//           )}

//         </div>

//       </div>

//       {/* MOTIVATION */}

//       <div className="bg-white rounded-xl border p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Motivation
//         </h2>

//         <p>
//           {
//             volunteer.motivation
//           }
//         </p>

//       </div>

//       {/* SOCIAL LINKS */}

//       <div className="bg-white rounded-xl border p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Social Links
//         </h2>

//         <div className="grid grid-cols-1 gap-3">

//           <Info
//             label="LinkedIn"
//             value={
//               volunteer.linkedIn ||
//               "-"
//             }
//           />

//           <Info
//             label="Instagram"
//             value={
//               volunteer.instagram ||
//               "-"
//             }
//           />

//           <Info
//             label="Facebook"
//             value={
//               volunteer.facebook ||
//               "-"
//             }
//           />

//         </div>

//       </div>

//       {/* STATUS */}

//       <div className="bg-white rounded-xl border p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Application Status
//         </h2>

//         <span
//           className={`px-4 py-2 rounded-full text-white ${
//             volunteer.status ===
//             "APPROVED"
//               ? "bg-green-600"
//               : volunteer.status ===
//                 "REJECTED"
//               ? "bg-red-600"
//               : "bg-yellow-500"
//           }`}
//         >
//           {volunteer.status}
//         </span>

//       </div>

//     </div>
//   );
// }

// function Info({
//   label,
//   value,
// }: {
//   label: string;
//   value: any;
// }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">
//         {label}
//       </p>

//       <p className="font-medium">
//         {value || "-"}
//       </p>
//     </div>
//   );
// }

//new frontend ui 

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getVolunteerById,
  updateVolunteerStatus,
} from "@/features/admin/api/admin.api";

import {
  ArrowLeft, User, Mail, Phone, Calendar, Users as UsersIcon,
  MapPin, Clock, Award, Heart, MessageSquare, Linkedin,
  Instagram, Facebook, CheckCircle2, XCircle, Loader2,
  AlertTriangle, Briefcase,
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
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-2 w-2 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INFO ROW
// ─────────────────────────────────────────────────────────────────────────────
function Info({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-gray-900 mt-0.5 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="h-9 w-9 rounded-xl bg-[#D2252B]/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-[#D2252B]" />
        </div>
        <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
interface ConfirmState {
  type: "approve" | "reject";
}

function ConfirmModal({
  confirm, volunteerName, onClose, onConfirm, processing,
}: {
  confirm: ConfirmState | null;
  volunteerName: string;
  onClose: () => void;
  onConfirm: () => void;
  processing: boolean;
}) {
  if (!confirm) return null;

  const config = {
    approve: {
      title: "Approve Volunteer",
      message: `Are you sure you want to approve "${volunteerName}"? They will be notified of their approval.`,
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      iconBg: "bg-green-100",
      confirmLabel: "Approve",
      confirmClass: "bg-green-600 hover:bg-green-700",
    },
    reject: {
      title: "Reject Volunteer",
      message: `Are you sure you want to reject "${volunteerName}"? This action can be reversed later.`,
      icon: <XCircle className="h-6 w-6 text-[#D2252B]" />,
      iconBg: "bg-red-100",
      confirmLabel: "Reject",
      confirmClass: "bg-[#D2252B] hover:bg-[#b81e23]",
    },
  }[confirm.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
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
export default function VolunteerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState<any>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [processing, setProcessing] = useState(false);

  const loadVolunteer = async () => {
    try {
      const res = await getVolunteerById(id);
      setVolunteer(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadVolunteer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleConfirm = async () => {
    if (!confirm) return;

    try {
      setProcessing(true);
      await updateVolunteerStatus(id, confirm.type === "approve" ? "APPROVED" : "REJECTED");
      await loadVolunteer();
      setConfirm(null);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const closeConfirm = () => {
    if (processing) return;
    setConfirm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#D2252B] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading volunteer details...</p>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-[#D2252B]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Volunteer not found</h2>
          <p className="text-sm text-gray-500 mt-1.5">The volunteer you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-[#b81e23] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const initial = volunteer.fullName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      {/* ── Back link ── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Volunteers
      </button>

      {/* ── Header / profile card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#D2252B]/10 flex items-center justify-center text-[#D2252B] font-bold text-2xl shrink-0">
              {initial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{volunteer.fullName}</h1>
              <p className="text-gray-500 text-sm mt-1">Volunteer Application</p>
              <div className="mt-2">
                <StatusBadge status={volunteer.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirm({ type: "approve" })}
              disabled={volunteer.status === "APPROVED"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
            <button
              onClick={() => setConfirm({ type: "reject" })}
              disabled={volunteer.status === "REJECTED"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-[#b81e23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </div>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <SectionCard title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Info label="Full Name"     value={volunteer.fullName}    icon={User} />
          <Info label="Email"         value={volunteer.email}       icon={Mail} />
          <Info label="Mobile"        value={volunteer.mobile}      icon={Phone} />
          <Info label="Age"           value={volunteer.age}         icon={Calendar} />
          <Info label="Gender"        value={volunteer.gender}      icon={UsersIcon} />
          <Info label="City"          value={volunteer.city}        icon={MapPin} />
          <Info label="State"         value={volunteer.state}       icon={MapPin} />
          <Info label="Availability"  value={volunteer.availability} icon={Clock} />
          <Info label="Weekly Hours"  value={volunteer.weeklyHours} icon={Clock} />
        </div>
      </SectionCard>

      {/* ── Skills ── */}
      <SectionCard title="Skills" icon={Award}>
        {volunteer.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {volunteer.skills.map((item: any) => (
              <span
                key={item.id}
                className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
              >
                {item.skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No skills provided.</p>
        )}
      </SectionCard>

      {/* ── Interests ── */}
      <SectionCard title="Interest Areas" icon={Heart}>
        {volunteer.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {volunteer.interests.map((item: any) => (
              <span
                key={item.id}
                className="px-3.5 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium"
              >
                {item.interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No interest areas provided.</p>
        )}
      </SectionCard>

      {/* ── Motivation ── */}
      <SectionCard title="Motivation" icon={MessageSquare}>
        {volunteer.motivation ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{volunteer.motivation}</p>
        ) : (
          <p className="text-sm text-gray-400">No motivation message provided.</p>
        )}
      </SectionCard>

      {/* ── Social Links ── */}
      <SectionCard title="Social Links" icon={Briefcase}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Info label="LinkedIn"   value={volunteer.linkedIn}   icon={Linkedin} />
          <Info label="Instagram"  value={volunteer.instagram}  icon={Instagram} />
          <Info label="Facebook"   value={volunteer.facebook}   icon={Facebook} />
        </div>
      </SectionCard>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        confirm={confirm}
        volunteerName={volunteer.fullName}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        processing={processing}
      />
    </div>
  );
}
