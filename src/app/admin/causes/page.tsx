// "use client";

// import { useEffect, useState } from "react";
// import {
//   adminGetCauses,
//   adminCreateCause,
//   adminUpdateCause,
//   adminDeleteCause,
//   adminToggleCauseStatus,
// } from "@/features/admin/api/admin.api";
// import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

// type Cause = {
//   id: number;
//   name: string;
//   description: string;
//   image: string | null;
//   isActive: boolean;
//   createdAt: string;
// };

// export default function CausesPage() {
//   const [causes, setCauses] = useState<Cause[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [showForm, setShowForm] = useState(false);
//   const [editingCause, setEditingCause] = useState<Cause | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     image: null as File | null,
//   });

//   // ================= FETCH =================
//   const fetchCauses = async () => {
//     try {
//       setLoading(true);
//       const data = await adminGetCauses();
//       setCauses(data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load causes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCauses();
//   }, []);

//   // ================= CREATE / UPDATE =================
//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("description", form.description);

//       if (form.image) formData.append("image", form.image);

//       if (editingCause) {
//         await adminUpdateCause(editingCause.id, formData);
//       } else {
//         await adminCreateCause(formData);
//       }

//       resetForm();
//       fetchCauses();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const resetForm = () => {
//     setForm({ name: "", description: "", image: null });
//     setEditingCause(null);
//     setShowForm(false);
//   };

//   const handleEdit = (cause: Cause) => {
//     setEditingCause(cause);
//     setForm({
//       name: cause.name,
//       description: cause.description,
//       image: null,
//     });
//     setShowForm(true);
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id: number) => {
//     const confirmDelete = confirm("Are you sure you want to delete?");
//     if (!confirmDelete) return;

//     try {
//       await adminDeleteCause(id);
//       fetchCauses();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // ================= TOGGLE =================
//   const handleToggle = async (id: number) => {
//     try {
//       await adminToggleCauseStatus(id);
//       fetchCauses();
//     } catch (err) {
//       alert("Toggle failed");
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Causes</h1>

//         <button
//           onClick={() => setShowForm(true)}
//           className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
//         >
//           <FiPlus /> Add Cause
//         </button>
//       </div>

//       {/* TABLE */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : causes.length === 0 ? (
//         <p>No causes found</p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 text-sm">
//               <tr>
//                 <th className="p-3">Image</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Created</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {causes.map((cause) => (
//                 <tr key={cause.id} className="border-t">
//                   <td className="p-3">
//                     {cause.image ? (
//                       <img
//                         src={cause.image}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 bg-gray-200 rounded" />
//                     )}
//                   </td>

//                   <td className="p-3">
//                     <p className="font-medium">{cause.name}</p>
//                     <p className="text-xs text-gray-500 truncate max-w-[200px]">
//                       {cause.description}
//                     </p>
//                   </td>

//                   <td className="p-3">
//                     <button
//                       onClick={() => handleToggle(cause.id)}
//                       className={`px-3 py-1 rounded-full text-xs ${
//                         cause.isActive
//                           ? "bg-green-100 text-green-700"
//                           : "bg-gray-200 text-gray-600"
//                       }`}
//                     >
//                       {cause.isActive ? "Active" : "Inactive"}
//                     </button>
//                   </td>

//                   <td className="p-3 text-sm text-gray-500">
//                     {new Date(cause.createdAt).toLocaleDateString()}
//                   </td>

//                   <td className="p-3 flex gap-3">
//                     <button onClick={() => handleEdit(cause)}>
//                       <FiEdit />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(cause.id)}
//                       className="text-red-600"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* FORM MODAL */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingCause ? "Edit Cause" : "Create Cause"}
//             </h2>

//             <input
//               type="text"
//               placeholder="Name"
//               value={form.name}
//               onChange={(e) =>
//                 setForm({ ...form, name: e.target.value })
//               }
//               className="w-full mb-3 p-2 border rounded"
//             />

//             <textarea
//               placeholder="Description"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               className="w-full mb-3 p-2 border rounded"
//             />

//             <input
//               type="file"
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   image: e.target.files?.[0] || null,
//                 })
//               }
//               className="mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 bg-gray-200 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 {editingCause ? "Update" : "Create"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//new ui 

"use client";

import { useEffect, useState } from "react";
import {
  adminGetCauses,
  adminCreateCause,
  adminUpdateCause,
  adminDeleteCause,
  adminToggleCauseStatus,
} from "@/features/admin/api/admin.api";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUpload, FiAlertTriangle, FiToggleLeft, FiToggleRight } from "react-icons/fi";

type Cause = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
};

// ── Confirmation Modal ─────────────────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmClass,
  icon,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  icon: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-[slideUp_0.2s_ease]">
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 text-2xl">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CausesPage() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCause, setEditingCause] = useState<Cause | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirmation states
  const [deleteTarget, setDeleteTarget] = useState<Cause | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Cause | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ── FETCH ──
  const fetchCauses = async () => {
    try {
      setLoading(true);
      const data = await adminGetCauses();
      setCauses(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load causes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  // ── CREATE / UPDATE ──
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) return;
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      if (editingCause) {
        await adminUpdateCause(editingCause.id, formData);
      } else {
        await adminCreateCause(formData);
      }

      resetForm();
      fetchCauses();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", image: null });
    setImagePreview(null);
    setEditingCause(null);
    setShowForm(false);
  };

  const handleEdit = (cause: Cause) => {
    setEditingCause(cause);
    setForm({ name: cause.name, description: cause.description, image: null });
    setImagePreview(cause.image || null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ── DELETE ──
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteCause(deleteTarget.id);
      fetchCauses();
    } catch {
      alert("Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── TOGGLE ──
  const confirmToggle = async () => {
    if (!toggleTarget) return;
    try {
      await adminToggleCauseStatus(toggleTarget.id);
      fetchCauses();
    } catch {
      alert("Toggle failed");
    } finally {
      setToggleTarget(null);
    }
  };

  // ── Stats ──
  const activeCount = causes.filter((c) => c.isActive).length;
  const inactiveCount = causes.length - activeCount;

  // ── RENDER ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .causes-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px) } to { opacity: 1; transform: translateX(0) } }
        .row-appear { animation: slideUp 0.25s ease both; }
        .form-panel { animation: slideInRight 0.25s ease both; }
      `}</style>

      <div className="causes-root min-h-screen bg-gray-50/70 p-6 lg:p-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-rose-500 uppercase mb-1">Admin Panel</p>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Causes</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-rose-200 transition-all duration-150"
          >
            <FiPlus className="text-base" />
            Add New Cause
          </button>
        </div>

        {/* ── STAT CHIPS ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: "Total Causes", value: causes.length, color: "bg-gray-900 text-white" },
            { label: "Active", value: activeCount, color: "bg-emerald-500 text-white" },
            { label: "Inactive", value: inactiveCount, color: "bg-gray-200 text-gray-700" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold ${stat.color}`}
            >
              <span className="opacity-70 font-normal">{stat.label}</span>
              <span className="text-base font-extrabold">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </div>
        ) : causes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <FiPlus className="text-5xl opacity-30" />
            <p className="font-medium">No causes yet. Add your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {["Image", "Cause", "Status", "Created", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-xs font-bold tracking-wider text-gray-400 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {causes.map((cause, idx) => (
                    <tr
                      key={cause.id}
                      className="row-appear group hover:bg-rose-50/40 transition-colors duration-150"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      {/* Image */}
                      <td className="px-5 py-3.5">
                        {cause.image && cause.image.startsWith("http") ? (
                          <img
                            src={cause.image}
                            alt={cause.name}
                            className="w-11 h-11 object-cover rounded-xl ring-2 ring-white shadow"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-300 text-lg shadow-inner">
                            📷
                          </div>
                        )}
                      </td>

                      {/* Name + Description */}
                      <td className="px-5 py-3.5 max-w-[240px]">
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{cause.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{cause.description}</p>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setToggleTarget(cause)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 hover:scale-105 active:scale-95 ${
                            cause.isActive
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {cause.isActive ? (
                            <FiToggleRight className="text-base text-emerald-500" />
                          ) : (
                            <FiToggleLeft className="text-base" />
                          )}
                          {cause.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(cause.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => handleEdit(cause)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cause)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
          <div className="form-panel bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                  {editingCause ? "Editing" : "New Cause"}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                  {editingCause ? editingCause.name : "Create a Cause"}
                </h2>
              </div>
              <button
                onClick={resetForm}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Cause Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Feed Hungry Families"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Briefly describe this cause..."
                  value={form.description}
                  rows={4}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Cover Image
                </label>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-rose-50 hover:border-rose-300 transition-colors py-5 gap-2">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-36 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <FiUpload className="text-2xl text-gray-300" />
                      <span className="text-xs text-gray-400 font-medium">Click to upload an image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <button
                    onClick={() => { setImagePreview(null); setForm({ ...form, image: null }); }}
                    className="mt-2 text-xs text-rose-500 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.name.trim() || !form.description.trim()}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md shadow-rose-200 transition-all active:scale-95"
              >
                {submitting ? "Saving..." : editingCause ? "Update Cause" : "Create Cause"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ── */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Cause?"
          message={`"${deleteTarget.name}" will be permanently removed. This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          confirmClass="text-rose-600 hover:bg-rose-50"
          icon={<FiTrash2 />}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── TOGGLE CONFIRMATION ── */}
      {toggleTarget && (
        <ConfirmModal
          title={toggleTarget.isActive ? "Deactivate Cause?" : "Activate Cause?"}
          message={`"${toggleTarget.name}" will be marked as ${toggleTarget.isActive ? "inactive and hidden from users" : "active and visible to users"}.`}
          confirmLabel={toggleTarget.isActive ? "Deactivate" : "Activate"}
          confirmClass={
            toggleTarget.isActive
              ? "text-amber-600 hover:bg-amber-50"
              : "text-emerald-600 hover:bg-emerald-50"
          }
          icon={<FiAlertTriangle />}
          onConfirm={confirmToggle}
          onCancel={() => setToggleTarget(null)}
        />
      )}
    </>
  );
}
