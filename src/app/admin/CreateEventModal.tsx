// "use client";

// import { useEffect, useState } from "react";
// import {
//   adminCreateEvent,
//   adminGetCauses,
// } from "@/features/admin/api/admin.api";
// import { useAdminStore } from "@/features/admin/store/admin.store";

// export default function CreateEventModal({ onClose, onSuccess }: any) {
//   const { admin } = useAdminStore();

//   const [form, setForm] = useState<any>({
//     title: "",
//     description: "",
//     location: "",
//     eventDate: "",
//     causeId: "",
//   });

//   const [causes, setCauses] = useState<any[]>([]);
//   const [image, setImage] = useState<File | null>(null);

//   // ✅ Fetch causes
//   useEffect(() => {
//     const fetchCauses = async () => {
//       try {
//         const res = await adminGetCauses();
//         setCauses(res.data || res);
//       } catch (err) {
//         console.error("❌ causes error:", err);
//       }
//     };

//     fetchCauses();
//   }, []);

//   const handleSubmit = async () => {
//     if (!form.causeId) return alert("Please select a cause");

//     const fd = new FormData();

//     fd.append("title", form.title);
//     fd.append("description", form.description);
//     fd.append("location", form.location);
//     fd.append("eventDate", form.eventDate);
//     fd.append("causeId", String(form.causeId));

//     // ✅ dynamic admin id
//     fd.append("createdBy", String(admin?.id));

//     if (image) fd.append("image", image);

//     try {
//       await adminCreateEvent(fd);
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl w-[420px] space-y-4">

//         <h2 className="text-lg text-black font-semibold">Create Event</h2>

//         <input
//           placeholder="Title"
//           className="w-full border p-2 rounded"
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />

//         <input
//           placeholder="Description"
//           className="w-full border p-2 rounded"
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />

//         <input
//           placeholder="Location"
//           className="w-full border p-2 rounded"
//           onChange={(e) => setForm({ ...form, location: e.target.value })}
//         />

//         <input
//           type="date"
//           className="w-full border p-2 rounded"
//           onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
//         />

//         {/* ✅ Cause Dropdown */}
//         <select
//           className="w-full border text-black p-2 rounded"
//           value={form.causeId}
//           onChange={(e) => setForm({ ...form, causeId: e.target.value })}
//         >
//           <option value="">Select Cause</option>

//           {causes.map((cause) => (
//             <option key={cause.id} value={cause.id}>
//               {cause.name}
//             </option>
//           ))}
//         </select>

//         {/* Image */}
//         <input
//           type="file"
//           onChange={(e) => setImage(e.target.files?.[0] || null)}
//         />

//         {/* Buttons */}
//         <div className="flex text-black justify-end gap-2">
//           <button onClick={onClose}>Cancel</button>

//           <button
//             onClick={handleSubmit}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  adminCreateEvent,
  adminGetCauses,
} from "@/features/admin/api/admin.api";
import { useAdminStore } from "@/features/admin/store/admin.store";
import {
  FiX,
  FiType,
  FiAlignLeft,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiImage,
  FiUploadCloud,
  FiCheckCircle,
} from "react-icons/fi";

export default function CreateEventModal({ onClose, onSuccess }: any) {
  const { admin } = useAdminStore();

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    causeId: "",
  });

  const [causes, setCauses] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const res = await adminGetCauses();
        setCauses(res.data || res);
      } catch (err) {
        console.error("❌ causes error:", err);
      }
    };
    fetchCauses();
  }, []);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.causeId) return alert("Please select a cause");
    setSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("location", form.location);
    fd.append("eventDate", form.eventDate);
    fd.append("causeId", String(form.causeId));
    fd.append("createdBy", String(admin?.id));
    if (image) fd.append("image", image);

    try {
      await adminCreateEvent(fd);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 w-full max-w-lg overflow-hidden border border-slate-100">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create New Event</h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the details to publish a new event</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiType className="w-3.5 h-3.5 text-indigo-400" /> Title
            </label>
            <input
              placeholder="e.g. Youth Cultural Dance Event"
              value={form.title}
              className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 transition-all"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiAlignLeft className="w-3.5 h-3.5 text-indigo-400" /> Description
            </label>
            <textarea
              placeholder="Briefly describe the event…"
              value={form.description}
              rows={3}
              className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 transition-all resize-none"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Location + Date (side by side) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                <FiMapPin className="w-3.5 h-3.5 text-indigo-400" /> Location
              </label>
              <input
                placeholder="City, State"
                value={form.location}
                className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400 transition-all"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                <FiCalendar className="w-3.5 h-3.5 text-indigo-400" /> Date
              </label>
              <input
                type="date"
                value={form.eventDate}
                className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              />
            </div>
          </div>

          {/* Cause */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiTag className="w-3.5 h-3.5 text-indigo-400" /> Cause
            </label>
            <select
              value={form.causeId}
              className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              onChange={(e) => setForm({ ...form, causeId: e.target.value })}
            >
              <option value="">Select a cause…</option>
              {causes.map((cause) => (
                <option key={cause.id} value={cause.id}>
                  {cause.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiImage className="w-3.5 h-3.5 text-indigo-400" /> Event Image
            </label>

            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                <img src={preview} alt="Preview" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleImageChange(null)}
                    className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/30 rounded-xl px-4 py-6 cursor-pointer transition-all group">
                <FiUploadCloud className="w-7 h-7 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                <p className="text-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
                  Click to upload image
                </p>
                <p className="text-xs text-slate-300">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-200"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiCheckCircle className="w-4 h-4" />
            )}
            {submitting ? "Creating…" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
