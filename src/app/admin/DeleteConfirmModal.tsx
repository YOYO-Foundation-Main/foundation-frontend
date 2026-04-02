"use client";
import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({ isOpen, title, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <FiAlertTriangle size={22} className="text-red-500" />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <FiX size={16} />
          </button>
        </div>

        <h2 className="text-base font-bold text-gray-800 mb-2">Delete Campaign</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-700">"{title}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium transition">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
            }`}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}