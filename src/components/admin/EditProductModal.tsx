"use client";
import { useState, useRef, useEffect } from "react";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";
import { adminUpdateProduct } from "@/features/admin/api/admin.api";
import { Product } from "@/features/admin/types/product.types";
import { isValidUrl } from "@/utils/url";

interface Props {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

// function isValidUrl(url: string | null | undefined): boolean {
//   if (!url) return false;
//   try { new URL(url); return true; } catch { return false; }
// }

export default function EditProductModal({ isOpen, product, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      description: product.description || "",
    });
    setImagePreview(isValidUrl(product.image) ? product.image : null);
    setImageFile(null);
  }, [product]);

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
    if (!product) return;
    if (!form.name) { showToast("Name is required", "error"); return; }
    if (!form.price) { showToast("Price is required", "error"); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      if (imageFile) formData.append("image", imageFile);

      await adminUpdateProduct(product.id, formData);
      showToast("✅ Product updated!", "success");
      setTimeout(() => { onSuccess(); onClose(); }, 800);
    } catch (err: any) {
      showToast(err.message || "Failed to update product", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Product</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update product details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <FiX size={18} />
          </button>
        </div>

        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>{toast.msg}</div>
        )}

        <div className="p-6 space-y-4">

          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Product Image</label>
            <div className="flex items-center gap-4">
              <div onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-200 shrink-0">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  : <><FiUpload size={20} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-400">Upload</span></>
                }
              </div>
              <div>
                <button onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                  {imagePreview ? "Change" : "Upload Image"}
                </button>
                {imageFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{imageFile.name}</span>
                    <button onClick={() => { setImageFile(null); setImagePreview(isValidUrl(product?.image) ? product!.image : null); }}>
                      <FiTrash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG · Max 5MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₹</span>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none transition" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${
              loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}