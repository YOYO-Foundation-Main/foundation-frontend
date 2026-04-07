"use client";

import { useEffect, useState } from "react";
import {
  adminCreateEvent,
  adminGetCauses,
} from "@/features/admin/api/admin.api";
import { useAdminStore } from "@/features/admin/store/admin.store";

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

  // ✅ Fetch causes
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

  const handleSubmit = async () => {
    if (!form.causeId) return alert("Please select a cause");

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("location", form.location);
    fd.append("eventDate", form.eventDate);
    fd.append("causeId", String(form.causeId));

    // ✅ dynamic admin id
    fd.append("createdBy", String(admin?.id));

    if (image) fd.append("image", image);

    try {
      await adminCreateEvent(fd);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[420px] space-y-4">

        <h2 className="text-lg text-black font-semibold">Create Event</h2>

        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Location"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
        />

        {/* ✅ Cause Dropdown */}
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

        {/* Image */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {/* Buttons */}
        <div className="flex text-black justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}