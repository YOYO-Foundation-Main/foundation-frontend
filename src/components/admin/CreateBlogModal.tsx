"use client";
import { useState, useRef } from "react";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";
import { adminCreateBlog } from "@/features/admin/api/admin.api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBlogModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: "", content: "", category: "" });

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

  const reset = () => {
    setForm({ title: "", content: "", category: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!form.title) { showToast("Title is required", "error"); return; }
    if (!form.content) { showToast("Content is required", "error"); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);
      if (imageFile) formData.append("image", imageFile);

      await adminCreateBlog(formData);
      showToast("✅ Blog created!", "success");
      setTimeout(() => { onSuccess(); onClose(); reset(); }, 800);
    } catch (err: any) {
      showToast(err.message || "Failed to create blog", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Create New Blog</h2>
            <p className="text-xs text-gray-400 mt-0.5">Write and publish a new blog post</p>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <FiX size={18} />
          </button>
        </div>

        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>{toast.msg}</div>
        )}

        <div className="p-6 space-y-5">

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Cover Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border-2 border-dashed border-gray-200">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  : <FiUpload size={20} className="text-gray-400" />
                }
              </div>
              <div>
                <button onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
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
                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG · Max 5MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          {/* Title + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="Blog post title"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <input type="text" placeholder="e.g. Education, Health, Events"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 transition" />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea rows={8} placeholder="Write your blog content here..."
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400 resize-none transition" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
          <button onClick={() => { reset(); onClose(); }} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${
              loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}