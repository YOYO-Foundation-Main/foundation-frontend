// "use client";

// import { useEffect, useState } from "react";
// import { adminUpdateEvent, adminGetCauses } from "@/features/admin/api/admin.api";
// import { FiX, FiUpload } from "react-icons/fi";

// interface EditEventModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   event: any;
// }

// export default function EditEventModal({ isOpen, onClose, onSuccess, event }: EditEventModalProps) {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     eventDate: "",
//     causeId: "",
//   });
//   const [causes, setCauses] = useState<any[]>([]);
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Load causes
//   useEffect(() => {
//     if (!isOpen) return;
//     const fetchCauses = async () => {
//       try {
//         const res = await adminGetCauses();
//         setCauses(res.data || res);
//       } catch (err) {
//         console.error("❌ causes error:", err);
//       }
//     };
//     fetchCauses();
//   }, [isOpen]);

//   // Populate form when event changes
//   useEffect(() => {
//     if (event) {
//       setForm({
//         title: event.title || "",
//         description: event.description || "",
//         location: event.location || "",
//         eventDate: event.eventDate?.split("T")[0] || "",
//         causeId: event.causeId?.toString() || "",
//       });
//       setImagePreview(event.image || null);
//     }
//   }, [event]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!form.causeId) return alert("Please select a cause");
//     if (!form.title) return alert("Title is required");
//     if (!form.eventDate) return alert("Event date is required");

//     const fd = new FormData();
//     fd.append("title", form.title);
//     fd.append("description", form.description);
//     fd.append("location", form.location);
//     fd.append("eventDate", form.eventDate);
//     fd.append("causeId", String(form.causeId));
//     if (image) fd.append("image", image);

//     try {
//       setLoading(true);
//       await adminUpdateEvent(event.id, fd);
//       onSuccess();
//       onClose();
//       alert("Event updated successfully!");
//     } catch (err: any) {
//       alert(err.message || "Failed to update event");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl w-[450px] max-h-[90vh] overflow-y-auto space-y-4">
        
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg text-black font-semibold">Edit Event</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <FiX size={20} />
//           </button>
//         </div>

//         {/* Form Fields */}
//         <input
//           placeholder="Title"
//           className="w-full border p-2 rounded"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />

//         <textarea
//           placeholder="Description"
//           rows={3}
//           className="w-full border p-2 rounded"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />

//         <input
//           placeholder="Location"
//           className="w-full border p-2 rounded"
//           value={form.location}
//           onChange={(e) => setForm({ ...form, location: e.target.value })}
//         />

//         <input
//           type="date"
//           className="w-full border p-2 rounded"
//           value={form.eventDate}
//           onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
//         />

//         {/* Cause Dropdown */}
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

//         {/* Image Upload with Preview */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Event Image
//           </label>
//           <div className="flex items-center gap-4">
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-16 h-16 object-cover rounded"
//               />
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="flex-1 text-sm"
//             />
//           </div>
//           <p className="text-xs text-gray-400 mt-1">
//             Leave empty to keep current image
//           </p>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-2 pt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`px-4 py-2 rounded text-white ${
//               loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
//             }`}
//           >
//             {loading ? "Updating..." : "Update Event"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// edit modal new ui 

"use client";

import { useEffect, useState } from "react";
import { adminUpdateEvent, adminGetCauses } from "@/features/admin/api/admin.api";
import {
  FiX,
  FiType,
  FiAlignLeft,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiImage,
  FiUploadCloud,
  FiSave,
} from "react-icons/fi";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: any;
}

export default function EditEventModal({
  isOpen,
  onClose,
  onSuccess,
  event,
}: EditEventModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    causeId: "",
  });
  const [causes, setCauses] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load causes
  useEffect(() => {
    if (!isOpen) return;
    const fetchCauses = async () => {
      try {
        const res = await adminGetCauses();
        setCauses(res.data || res);
      } catch (err) {
        console.error("❌ causes error:", err);
      }
    };
    fetchCauses();
  }, [isOpen]);

  // Populate form when event changes
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        eventDate: event.eventDate?.split("T")[0] || "",
        causeId: event.causeId?.toString() || "",
      });
      setImagePreview(event.image || null);
      setImage(null);
    }
  }, [event]);

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null);
      setImagePreview(event?.image || null);
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.causeId) return alert("Please select a cause");
    if (!form.title) return alert("Title is required");
    if (!form.eventDate) return alert("Event date is required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("location", form.location);
    fd.append("eventDate", form.eventDate);
    fd.append("causeId", String(form.causeId));
    if (image) fd.append("image", image);

    try {
      setLoading(true);
      await adminUpdateEvent(event.id, fd);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 w-full max-w-lg overflow-hidden border border-slate-100">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Edit Event</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update the details for this event</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* ── Form Body ── */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiType className="w-3.5 h-3.5 text-amber-500" /> Title
            </label>
            <input
              placeholder="e.g. Youth Cultural Dance Event"
              value={form.title}
              className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder-slate-400 transition-all"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiAlignLeft className="w-3.5 h-3.5 text-amber-500" /> Description
            </label>
            <textarea
              placeholder="Briefly describe the event…"
              value={form.description}
              rows={3}
              className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder-slate-400 transition-all resize-none"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Location + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                <FiMapPin className="w-3.5 h-3.5 text-amber-500" /> Location
              </label>
              <input
                placeholder="City, State"
                value={form.location}
                className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder-slate-400 transition-all"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                <FiCalendar className="w-3.5 h-3.5 text-amber-500" /> Date
              </label>
              <input
                type="date"
                value={form.eventDate}
                className="w-full border border-slate-200 bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              />
            </div>
          </div>

          {/* Cause */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              <FiTag className="w-3.5 h-3.5 text-amber-500" /> Cause
            </label>
            <select
              value={form.causeId}
              className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
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
              <FiImage className="w-3.5 h-3.5 text-amber-500" /> Event Image
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-36 object-cover"
                />
                {/* Overlay with change/remove */}
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow cursor-pointer hover:bg-amber-50 hover:text-amber-600 transition-all">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    />
                  </label>
                  <button
                    onClick={() => handleImageChange(null)}
                    className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    Reset
                  </button>
                </div>
                {/* Badge if new image selected */}
                {image && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    New
                  </span>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-amber-300 bg-slate-50 hover:bg-amber-50/30 rounded-xl px-4 py-6 cursor-pointer transition-all group">
                <FiUploadCloud className="w-7 h-7 text-slate-300 group-hover:text-amber-400 transition-colors" />
                <p className="text-sm text-slate-400 group-hover:text-amber-500 transition-colors">
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

            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
              Hover the image to change or reset to original
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-md shadow-amber-200"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div> 
    </div>
  );
}
