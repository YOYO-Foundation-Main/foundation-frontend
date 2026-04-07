"use client";

import { useState, useEffect } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import { userCreateCampaign, isUserAuthenticated, getUserToken } from "@/features/campaigns/api/userCampaign.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface CreateCampaignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CauseOption {
  id: number;
  name: string;
}

export default function CreateCampaignUserModal({ isOpen, onClose }: CreateCampaignUserModalProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [causes, setCauses] = useState<CauseOption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    goalAmount: "",
    causeId: "",
    startDate: "",
    endDate: "",
  });

  // Debug: Check token when modal opens
  useEffect(() => {
    if (isOpen) {
      const token = getUserToken();
      console.log("Modal opened - User from store:", user);
      console.log("Modal opened - Token from localStorage:", token ? "Exists" : "Missing");
      console.log("Is authenticated:", isUserAuthenticated());
    }
  }, [isOpen, user]);

  // Load causes
  useEffect(() => {
    if (!isOpen) return;
    const loadCauses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cause`);
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        setCauses(list);
      } catch (err) {
        console.error("Failed to load causes:", err);
      }
    };
    loadCauses();
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
    // Check authentication
    const token = getUserToken();
    console.log("Submit - Token exists:", !!token);
    console.log("Submit - User from store:", user);
    
    if (!token || !user) {
      showToast("Please login to create a campaign", "error");
      return; // ✅ Just show error, don't auto-close modal
    }

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

      await userCreateCampaign(formData);

      showToast("✅ Campaign submitted for admin approval!", "success");
      // ✅ Only close on SUCCESS, not on error
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Create campaign error:", err);
      showToast(err.message || "Failed to create campaign", "error");
      // ✅ Don't close modal on error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      goalAmount: "",
      causeId: "",
      startDate: "",
      endDate: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Create Campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your campaign will be reviewed by admin</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Toast - Show error but don't close modal */}
        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {toast.msg}
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Clean Water for Everyone"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] transition"
            />
          </div>

          {/* Cause */}
          <div>
            <label className="block   text-xs font-semibold text-gray-600 mb-1.5">
              Cause <span className="text-red-500">*</span>
            </label>
            <select
              value={form.causeId}
              onChange={(e) => setForm({ ...form, causeId: e.target.value })}
              className="w-full text-black border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] transition"
            >
              <option value="">Select a cause</option>
              {causes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
            <input
              type="text"
              placeholder="e.g., Mumbai, India"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] transition"
            />
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Goal Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 50000"
              value={form.goalAmount}
              onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] transition"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] transition"
              />
              <p className="text-[10px] text-gray-400 mt-1">Optional</p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cover Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUpload size={20} className="text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#D2252B] file:text-white hover:file:bg-[#b91c22] cursor-pointer"
                />
                <p className="text-[10px] text-gray-400 mt-1">Recommended: 1200 × 600px</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={5}
              placeholder="Tell your story... Why this campaign? How will funds be used?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D2252B] resize-none transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
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
                : "bg-[#D2252B] hover:bg-[#b91c22] text-white"
            }`}
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}