"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";
import { adminGetProducts, adminDeleteProduct } from "@/features/admin/api/admin.api";
import { Product } from "@/features/admin/types/product.types";
import CreateProductModal from "@/components/admin/CreateProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { isValidUrl } from "@/utils/url";

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

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl ${
          toast.type === "success" ? "bg-gray-900 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide uppercase">
            Dashboard &rsaquo; <span className="text-gray-600">Products</span>
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 active:scale-95 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all duration-200 shadow-lg shadow-gray-900/20"
        >
          <FiPlus size={15} />
          Add Product
        </button>
      </div>

      {/* Search + Count */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition"
          />
        </div>
        {!loading && (
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-2.5 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-xs text-gray-500 font-medium">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-44 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3.5 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                <div className="h-2.5 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div className="h-4 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
                  <div className="flex gap-1.5">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="w-8 h-8 bg-gray-100 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage size={26} className="text-gray-300" />
          </div>
          <p className="text-gray-800 font-bold text-base">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-5 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
          >
            <FiPlus size={14} />
            Add First Product
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const validImage = isValidUrl(product.image);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-50 overflow-hidden">
                  {validImage ? (
                    <img
                      src={product.image || "/assets/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                      <FiPackage size={28} />
                      <span className="text-[10px] font-semibold tracking-widest uppercase">No Image</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5">
                    <button
                      onClick={() => { setSelected(product); setShowEdit(true); }}
                      className="w-10 h-10 rounded-full bg-white text-blue-600 hover:bg-blue-50 hover:scale-110 flex items-center justify-center shadow-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => { setSelected(product); setShowDelete(true); }}
                      className="w-10 h-10 rounded-full bg-white text-red-500 hover:bg-red-50 hover:scale-110 flex items-center justify-center shadow-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  {/* Active Badge */}
                  <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${
                    product.isActive
                      ? "bg-emerald-50/90 text-emerald-600 border-emerald-100"
                      : "bg-gray-50/90 text-gray-400 border-gray-200"
                  }`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 truncate tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-base font-extrabold text-gray-900 tracking-tight">
                        ₹{product.price.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setSelected(product); setShowEdit(true); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                        title="Edit"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => { setSelected(product); setShowDelete(true); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={13} />
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
