// "use client";

// import { useEffect, useState } from "react";
// import {
//   adminGetEvents,
//   adminDeleteEvent,
// } from "@/features/admin/api/admin.api";
// import CreateEventModal from "@/app/admin/CreateEventModal";
// import EditEventModal from "@/app/admin/EditEventModal";
// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// export const dynamic = "force-dynamic";

// export default function AdminEventsPage() {
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openCreateModal, setOpenCreateModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<any>(null);

//   const fetchEvents = async () => {
//     try {
//       const res = await adminGetEvents();
//       setEvents(res.data || res);
//     } catch (err) {
//       console.error("❌ Fetch events error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this event?")) return;

//     try {
//       await adminDeleteEvent(id);
//       fetchEvents();
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   const handleEdit = (event: any) => {
//     setSelectedEvent(event);
//     setOpenEditModal(true);
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-bold">Events</h1>
//         <button
//           onClick={() => setOpenCreateModal(true)}
//           className="bg-black text-white px-4 py-2 rounded-md"
//         >
//           + Create Event
//         </button>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="bg-white rounded-xl shadow border overflow-x-auto">
//           <table className="w-full text-black text-sm">
//             <thead className="bg-gray-100 text-gray-600">
//               <tr>{/* No whitespace between tr and th elements */}
//                 <th className="p-3 text-left">Image</th>
//                 <th className="p-3 text-left">Title</th>
//                 <th className="p-3 text-left">Location</th>
//                 <th className="p-3 text-left">Cause</th>
//                 <th className="p-3 text-left">Date</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {events.map((e) => (
//                 <tr key={e.id} className="border-t">{/* No whitespace between tr and td elements */}
//                   <td className="p-3">
//                     <img
//                       src={e.image}
//                       alt={e.title}
//                       className="w-14 h-10 object-cover rounded"
//                     />
//                   </td>
//                   <td className="p-3 font-medium">{e.title}</td>
//                   <td className="p-3">{e.location}</td>
//                   <td className="p-3 text-gray-600">
//                     {e.cause?.name || "-"}
//                   </td>
//                   <td className="p-3">
//                     {new Date(e.eventDate).toLocaleDateString()}
//                   </td>
//                   <td className="p-3">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleEdit(e)}
//                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
//                         title="Edit Event"
//                       >
//                         <FiEdit2 size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(e.id)}
//                         className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
//                         title="Delete Event"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {!events.length && (
//                 <tr>{/* No whitespace between tr and td elements */}
//                   <td colSpan={6} className="text-center p-4 text-gray-400">
//                     No events found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Create Modal */}
//       {openCreateModal && (
//         <CreateEventModal
//           onClose={() => setOpenCreateModal(false)}
//           onSuccess={fetchEvents}
//         />
//       )}

//       {/* Edit Modal */}
//       {openEditModal && selectedEvent && (
//         <EditEventModal
//           isOpen={openEditModal}
//           onClose={() => {
//             setOpenEditModal(false);
//             setSelectedEvent(null);
//           }}
//           onSuccess={fetchEvents}
//           event={selectedEvent}
//         />
//       )}
//     </div>
//   );
// }

//new UI or frontend 

// "use client";

// import { useEffect, useState } from "react";
// import {
//   adminGetEvents,
//   adminDeleteEvent,
// } from "@/features/admin/api/admin.api";
// import CreateEventModal from "@/app/admin/CreateEventModal";
// import EditEventModal from "@/app/admin/EditEventModal";
// import {
//   FiEdit2,
//   FiTrash2,
//   FiMapPin,
//   FiTag,
//   FiSearch,
//   FiPlus,
//   FiZap,
// } from "react-icons/fi";

// export const dynamic = "force-dynamic";

// export default function AdminEventsPage() {
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openCreateModal, setOpenCreateModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<any>(null);
//   const [search, setSearch] = useState("");

//   const fetchEvents = async () => {
//     try {
//       const res = await adminGetEvents();
//       setEvents(res.data || res);
//     } catch (err) {
//       console.error("❌ Fetch events error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this event?")) return;
//     try {
//       await adminDeleteEvent(id);
//       fetchEvents();
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   const handleEdit = (event: any) => {
//     setSelectedEvent(event);
//     setOpenEditModal(true);
//   };

//   const filtered = events.filter(
//     (e) =>
//       e.title?.toLowerCase().includes(search.toLowerCase()) ||
//       e.location?.toLowerCase().includes(search.toLowerCase()) ||
//       e.cause?.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const formatDate = (dateStr: string) => {
//     const d = new Date(dateStr);
//     return {
//       day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
//       month: d
//         .toLocaleDateString("en-IN", { month: "short" })
//         .toUpperCase(),
//       year: d.getFullYear(),
//     };
//   };

//   const thisMonth = events.filter(
//     (e) =>
//       new Date(e.eventDate).getMonth() === new Date().getMonth()
//   ).length;

//   const causesCount = new Set(events.map((e) => e.causeId)).size;

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-8">

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <div className="w-1.5 h-5 bg-violet-500 rounded-full" />
//             <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
//               Admin / Management
//             </span>
//           </div>
//           <h1 className="text-3xl font-bold tracking-tight text-white">
//             Events
//           </h1>
//           <p className="text-sm text-slate-500 mt-0.5">
//             {events.length} events total
//           </p>
//         </div>

//         <div className="flex items-center gap-3 flex-wrap">
//           {/* Search */}
//           <div className="relative">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search events…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="bg-slate-800/70 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2.5 w-52 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-slate-600 transition-all"
//             />
//           </div>

//           {/* Create button */}
//           <button
//             onClick={() => setOpenCreateModal(true)}
//             className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40 hover:shadow-violet-700/40"
//           >
//             <FiPlus className="w-4 h-4" />
//             Create Event
//           </button>
//         </div>
//       </div>

//       {/* ── Stats strip ── */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
//         <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
//           <p className="text-2xl font-bold text-violet-400">{events.length}</p>
//           <p className="text-xs text-slate-500 mt-0.5">Total Events</p>
//         </div>
//         <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
//           <p className="text-2xl font-bold text-emerald-400">
//             {events.filter((e) => e.isActive).length}
//           </p>
//           <p className="text-xs text-slate-500 mt-0.5">Active</p>
//         </div>
//         <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-3">
//           <p className="text-2xl font-bold text-sky-400">{thisMonth}</p>
//           <p className="text-xs text-slate-500 mt-0.5">This Month</p>
//         </div>
//         <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
//           <p className="text-2xl font-bold text-amber-400">{causesCount}</p>
//           <p className="text-xs text-slate-500 mt-0.5">Causes Covered</p>
//         </div>
//       </div>

//       {/* ── Table / States ── */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-36 gap-3">
//           <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-500">Loading events…</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-36 gap-3">
//           <div className="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center">
//             <FiZap className="w-7 h-7 text-slate-600" />
//           </div>
//           <p className="text-slate-400 font-medium">No events found</p>
//           <p className="text-xs text-slate-600">
//             Try a different search term or create a new event.
//           </p>
//         </div>
//       ) : (
//         <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl">

//           {/* Table header */}
//           <div className="hidden md:grid grid-cols-[64px_2.5fr_1.5fr_1.6fr_1.1fr_96px] gap-4 px-5 py-3 bg-slate-800/50 border-b border-slate-800/70 text-xs font-semibold tracking-widest text-slate-500 uppercase">
//             <span>Image</span>
//             <span>Title</span>
//             <span>Location</span>
//             <span>Cause</span>
//             <span>Date</span>
//             <span className="text-center">Actions</span>
//           </div>

//           {/* Rows */}
//           <div className="divide-y divide-slate-800/50">
//             {filtered.map((e) => {
//               const date = formatDate(e.eventDate);
//               return (
//                 <div
//                   key={e.id}
//                   className="flex flex-col md:grid md:grid-cols-[64px_2.5fr_1.5fr_1.6fr_1.1fr_96px] gap-4 px-5 py-4 items-start md:items-center hover:bg-slate-800/30 transition-colors duration-150 group"
//                 >
//                   {/* Image */}
//                   <div className="relative shrink-0">
//                     <img
//                       src={e.image}
//                       alt={e.title}
//                       className="w-14 h-10 object-cover rounded-lg ring-1 ring-slate-700/60 group-hover:ring-violet-500/40 transition-all duration-200"
//                     />
//                     {e.isActive && (
//                       <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
//                     )}
//                   </div>

//                   {/* Title + description */}
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors truncate">
//                       {e.title}
//                     </p>
//                     <p className="text-xs text-slate-600 truncate mt-0.5 max-w-xs">
//                       {e.description}
//                     </p>
//                   </div>

//                   {/* Location */}
//                   <div className="flex items-center gap-1.5 min-w-0">
//                     <FiMapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
//                     <span className="text-sm text-slate-400 truncate">
//                       {e.location}
//                     </span>
//                   </div>

//                   {/* Cause badge */}
//                   <div>
//                     <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-medium px-2.5 py-1 rounded-full max-w-full">
//                       <FiTag className="w-3 h-3 shrink-0" />
//                       <span className="truncate">{e.cause?.name || "—"}</span>
//                     </span>
//                   </div>

//                   {/* Date chip */}
//                   <div className="flex items-center gap-2">
//                     <div className="bg-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1 text-center">
//                       <p className="text-[10px] font-bold text-violet-400 leading-none tracking-widest">
//                         {date.month}
//                       </p>
//                       <p className="text-lg font-extrabold text-white leading-tight">
//                         {date.day}
//                       </p>
//                     </div>
//                     <span className="text-xs text-slate-600">{date.year}</span>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center justify-center gap-1.5">
//                     <button
//                       onClick={() => handleEdit(e)}
//                       className="p-2 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-all duration-150"
//                       title="Edit Event"
//                     >
//                       <FiEdit2 className="w-3.5 h-3.5" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(e.id)}
//                       className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150"
//                       title="Delete Event"
//                     >
//                       <FiTrash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Footer */}
//           <div className="px-5 py-3 bg-slate-800/20 border-t border-slate-800/60 flex items-center justify-between">
//             <p className="text-xs text-slate-600">
//               Showing{" "}
//               <span className="text-slate-400 font-medium">{filtered.length}</span>{" "}
//               of{" "}
//               <span className="text-slate-400 font-medium">{events.length}</span>{" "}
//               events
//             </p>
//             <div className="flex items-center gap-1.5">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//               <span className="text-xs text-slate-600">Live</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Modals ── */}
//       {openCreateModal && (
//         <CreateEventModal
//           onClose={() => setOpenCreateModal(false)}
//           onSuccess={fetchEvents}
//         />
//       )}

//       {openEditModal && selectedEvent && (
//         <EditEventModal
//           isOpen={openEditModal}
//           onClose={() => {
//             setOpenEditModal(false);
//             setSelectedEvent(null);
//           }}
//           onSuccess={fetchEvents}
//           event={selectedEvent}
//         />
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import {
  adminGetEvents,
  adminDeleteEvent,
} from "@/features/admin/api/admin.api";
import CreateEventModal from "@/app/admin/CreateEventModal";
import EditEventModal from "@/app/admin/EditEventModal";
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiTag,
  FiSearch,
  FiPlus,
  FiInbox,
  FiCalendar,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await adminGetEvents();
      setEvents(res.data || res);
    } catch (err) {
      console.error("❌ Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await adminDeleteEvent(id);
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setOpenEditModal(true);
  };

  const filtered = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      e.cause?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
      year: d.getFullYear(),
    };
  };

  const thisMonth = events.filter(
    (e) => new Date(e.eventDate).getMonth() === new Date().getMonth()
  ).length;
  const causesCount = new Set(events.map((e) => e.causeId)).size;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
            <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
              Admin · Management
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Events
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{events.length} events total</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl pl-9 pr-4 py-2.5 w-52 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-indigo-200"
          >
            <FiPlus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Events", value: events.length, color: "text-indigo-600", border: "border-indigo-100", bg: "bg-indigo-50", dot: "bg-indigo-400" },
          { label: "Active", value: events.filter((e) => e.isActive).length, color: "text-emerald-600", border: "border-emerald-100", bg: "bg-emerald-50", dot: "bg-emerald-400" },
          { label: "This Month", value: thisMonth, color: "text-sky-600", border: "border-sky-100", bg: "bg-sky-50", dot: "bg-sky-400" },
          { label: "Causes Covered", value: causesCount, color: "text-amber-600", border: "border-amber-100", bg: "bg-amber-50", dot: "bg-amber-400" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm`}>
            <div className={`w-2.5 h-2.5 rounded-full ${s.dot} shrink-0`} />
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-36 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading events…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-36 gap-3">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
            <FiInbox className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No events found</p>
          <p className="text-xs text-slate-400">Try a different search or create a new event.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

          {/* Table head */}
          <div className="hidden md:grid grid-cols-[68px_2.5fr_1.5fr_1.6fr_1.1fr_96px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            <span>Image</span>
            <span>Title</span>
            <span>Location</span>
            <span>Cause</span>
            <span>Date</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map((e) => {
              const date = formatDate(e.eventDate);
              return (
                <div
                  key={e.id}
                  className="flex flex-col md:grid md:grid-cols-[68px_2.5fr_1.5fr_1.6fr_1.1fr_96px] gap-4 px-5 py-4 items-start md:items-center hover:bg-indigo-50/40 transition-colors duration-150 group"
                >
                  {/* Image */}
                  <div className="relative shrink-0">
                    <img
                      src={e.image}
                      alt={e.title}
                      className="w-14 h-10 object-cover rounded-xl ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-all duration-200"
                    />
                    {e.isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                      {e.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xs">
                      {e.description}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-500 truncate">{e.location}</span>
                  </div>

                  {/* Cause */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium px-2.5 py-1 rounded-full">
                      <FiTag className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[120px]">{e.cause?.name || "—"}</span>
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 rounded-xl px-2.5 py-1 text-center shadow-sm shadow-indigo-200">
                      <p className="text-[9px] font-bold text-indigo-200 leading-none tracking-widest">{date.month}</p>
                      <p className="text-base font-extrabold text-white leading-tight">{date.day}</p>
                    </div>
                    <span className="text-xs text-slate-400">{date.year}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(e)}
                      className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all duration-150"
                      title="Edit"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-150"
                      title="Delete"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="text-slate-600 font-medium">{filtered.length}</span> of{" "}
              <span className="text-slate-600 font-medium">{events.length}</span> events
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {openCreateModal && (
        <CreateEventModal onClose={() => setOpenCreateModal(false)} onSuccess={fetchEvents} />
      )}
      {openEditModal && selectedEvent && (
        <EditEventModal
          isOpen={openEditModal}
          onClose={() => { setOpenEditModal(false); setSelectedEvent(null); }}
          onSuccess={fetchEvents}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
