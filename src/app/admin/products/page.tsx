"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { adminGetProducts, adminDeleteProduct } from "@/features/admin/api/admin.api";
// import { Product } from "@/features/admin/types/product.types";
import { Product } from "@/features/admin/types/product.types";
import CreateProductModal from "@/components/admin/CreateProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import DeleteConfirmModal from "../DeleteConfirmModal";

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminGetProducts();
      // Response: { success: true, Products: [...] }
      const list: Product[] = data?.Products || data?.products || (Array.isArray(data) ? data : []);
      setProducts(list);
    } catch (err) {
      console.error("❌ Products fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    if (!selected) return;
    await adminDeleteProduct(selected.id);
    setProducts((prev) => prev.filter((p) => p.id !== selected.id));
    setSelected(null);
    setShowDelete(false);
    showToast("✅ Product deleted", "success");
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <CreateProductModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchProducts} />
      <EditProductModal isOpen={showEdit} product={selected} onClose={() => setShowEdit(false)} onSuccess={fetchProducts} />
      <DeleteConfirmModal
        isOpen={showDelete}
        title={selected?.name || ""}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {toast.msg && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Products</h1>
          <p className="text-xs text-gray-400 mt-0.5">Dashboard / Products</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-200">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Search + count */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400" />
        </div>
        {!loading && (
          <span className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-xl">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No products found</p>
          <button onClick={() => setShowCreate(true)}
            className="mt-4 flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition mx-auto">
            <FiPlus size={14} /> Add First Product
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const validImage = isValidUrl(product.image);
            return (
              <div key={product.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition group">

                {/* Image */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  {validImage
                    ? <img src={product.image!} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="text-xs text-gray-400">No Image</span></div>
                  }
                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setSelected(product); setShowEdit(true); }}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-600 hover:bg-blue-50 transition shadow"
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => { setSelected(product); setShowDelete(true); }}
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-red-50 transition shadow"
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  {/* Active badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      product.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-US")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelected(product); setShowEdit(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => { setSelected(product); setShowDelete(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}