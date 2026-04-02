"use client";
import { useState, useRef } from "react";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";
import { adminCreateCampaign, adminGetCauses } from "@/features/admin/api/admin.api";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CauseOption {
  id: number;
  name: string;
}

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: Props) {
  const [causes, setCauses] = useState<CauseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    goalAmount: "",
    causeId: "",
    startDate: "",
    endDate: "",
  });

  // Load causes for dropdown
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        const data = await adminGetCauses();
        const list = Array.isArray(data) ? data : data?.data || [];
        setCauses(list);
      } catch (err) {
        console.error("Failed to load causes:", err);
      }
    };
    load();
  }, [isOpen]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.title) { showToast("Title is required", "error"); return; }
    if (!form.causeId) { showToast("Please select a cause", "error"); return; }
    if (!form.goalAmount) { showToast("Goal amount is required", "error"); return; }
    if (!form.startDate) { showToast("Start date is required", "error"); return; }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("goalAmount", form.goalAmount);
      formData.append("causeId", form.causeId);
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      if (imageFile) formData.append("image", imageFile);

      await adminCreateCampaign(formData);

      showToast("✅ Campaign created successfully!", "success");
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1000);
    } catch (err: any) {
      showToast(err.message || "Failed to create campaign", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", location: "", goalAmount: "", causeId: "", startDate: "", endDate: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Create New Campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">Dashboard / Campaigns / Create New Campaign</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {toast.msg}
          </div>
        )}

        <div className="p-6 space-y-8">

          {/* ── Section 1: Campaign Basics ── */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-bold text-gray-800">Campaign Basics</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Tell us about your cause and what you're raising funds for.
              </p>
            </div>

            <div className="flex-1 space-y-4">

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiUpload size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </button>
                    {imageFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 truncate max-w-[160px]">{imageFile.name}</span>
                        <button onClick={() => { setImageFile(null); setImagePreview(null); }}>
                          <FiTrash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">Recommended: 1200 × 600px · JPG/PNG</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>
              </div>

              {/* Title + Cause */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solar Light for Smiles"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Cause <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.causeId}
                    onChange={(e) => setForm({ ...form, causeId: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition"
                  >
                    <option value="">Select a cause</option>
                    {causes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 transition"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Section 2: Goals & Timeline ── */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-bold text-gray-800">Goals & Timeline</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Set your fundraising goals and schedule.
              </p>
            </div>

            <div className="flex-1 space-y-4">

              {/* Goal Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Target Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 75,000"
                  value={form.goalAmount}
                  onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 transition"
                />
              </div>

              {/* Start + End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Leave empty for open-ended campaigns</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Section 3: Story ── */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-bold text-gray-800">Story</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Tell your story. Inspire people to care and contribute.
              </p>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea
                rows={6}
                placeholder="Describe your campaign — what you're raising funds for, why it matters, and how donations will be used..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 resize-none transition"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${
              loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Creating..." : "Publish Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}