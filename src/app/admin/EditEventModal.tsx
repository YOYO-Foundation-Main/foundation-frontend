"use client";

import { useEffect, useState } from "react";
import { adminUpdateEvent, adminGetCauses } from "@/features/admin/api/admin.api";
import { FiX, FiUpload } from "react-icons/fi";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: any;
}

export default function EditEventModal({ isOpen, onClose, onSuccess, event }: EditEventModalProps) {
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
    }
  }, [event]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
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
      alert("Event updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] max-h-[90vh] overflow-y-auto space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-black font-semibold">Edit Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          rows={3}
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Location"
          className="w-full border p-2 rounded"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
        />

        {/* Cause Dropdown */}
        <select
          className="w-full border text-black p-2 rounded"
          value={form.causeId}
          onChange={(e) => setForm({ ...form, causeId: e.target.value })}
        >
          <option value="">Select Cause</option>
          {causes.map((cause) => (
            <option key={cause.id} value={cause.id}>
              {cause.name}
            </option>
          ))}
        </select>

        {/* Image Upload with Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Leave empty to keep current image
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </div>
    </div>
  );
}