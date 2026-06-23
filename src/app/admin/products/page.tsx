// "use client";
// import { useState, useEffect } from "react";
// import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";
// import { adminGetProducts, adminDeleteProduct } from "@/features/admin/api/admin.api";
// import { Product } from "@/features/admin/types/product.types";
// import CreateProductModal from "@/components/admin/CreateProductModal";
// import EditProductModal from "@/components/admin/EditProductModal";
// import DeleteConfirmModal from "../DeleteConfirmModal";
// import { isValidUrl } from "@/utils/url";

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<Product | null>(null);

//   const [showCreate, setShowCreate] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);
//   const [toast, setToast] = useState({ msg: "", type: "" });

//   const showToast = (msg: string, type: "success" | "error") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: "", type: "" }), 3000);
//   };

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const data = await adminGetProducts();
//       const list: Product[] = data?.Products || data?.products || (Array.isArray(data) ? data : []);
//       setProducts(list);
//     } catch (err) {
//       console.error("❌ Products fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchProducts(); }, []);

//   const handleDelete = async () => {
//     if (!selected) return;
//     await adminDeleteProduct(selected.id);
//     setProducts((prev) => prev.filter((p) => p.id !== selected.id));
//     setSelected(null);
//     setShowDelete(false);
//     showToast("✅ Product deleted", "success");
//   };

//   const filtered = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase()) ||
//     p.description?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       <CreateProductModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchProducts} />
//       <EditProductModal isOpen={showEdit} product={selected} onClose={() => setShowEdit(false)} onSuccess={fetchProducts} />
//       <DeleteConfirmModal
//         isOpen={showDelete}
//         title={selected?.name || ""}
//         onClose={() => setShowDelete(false)}
//         onConfirm={handleDelete}
//       />

//       {/* Toast */}
//       {toast.msg && (
//         <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl ${
//           toast.type === "success" ? "bg-gray-900 text-white" : "bg-red-500 text-white"
//         }`}>
//           {toast.msg}
//         </div>
//       )}

//       {/* Page Header */}
//       <div className="flex items-center justify-between mb-7">
//         <div>
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products</h1>
//           <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide uppercase">
//             Dashboard &rsaquo; <span className="text-gray-600">Products</span>
//           </p>
//         </div>
//         <button
//           onClick={() => setShowCreate(true)}
//           className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 active:scale-95 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all duration-200 shadow-lg shadow-gray-900/20"
//         >
//           <FiPlus size={15} />
//           Add Product
//         </button>
//       </div>

//       {/* Search + Count */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="relative flex-1 max-w-sm">
//           <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search products…"
//             className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition"
//           />
//         </div>
//         {!loading && (
//           <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-2.5 rounded-xl">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
//             <span className="text-xs text-gray-500 font-medium">
//               {filtered.length} product{filtered.length !== 1 ? "s" : ""}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Loading Skeletons */}
//       {loading && (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//               <div className="h-44 bg-gray-100 animate-pulse" />
//               <div className="p-4 space-y-3">
//                 <div className="h-3.5 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
//                 <div className="h-2.5 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
//                 <div className="flex justify-between items-center pt-3 border-t border-gray-50">
//                   <div className="h-4 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
//                   <div className="flex gap-1.5">
//                     <div className="w-8 h-8 bg-gray-100 rounded-xl animate-pulse" />
//                     <div className="w-8 h-8 bg-gray-100 rounded-xl animate-pulse" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && filtered.length === 0 && (
//         <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
//           <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <FiPackage size={26} className="text-gray-300" />
//           </div>
//           <p className="text-gray-800 font-bold text-base">No products found</p>
//           <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
//           <button
//             onClick={() => setShowCreate(true)}
//             className="mt-5 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
//           >
//             <FiPlus size={14} />
//             Add First Product
//           </button>
//         </div>
//       )}

//       {/* Products Grid */}
//       {!loading && filtered.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {filtered.map((product) => {
//             const validImage = isValidUrl(product.image);
//             return (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-300 group"
//               >
//                 {/* Image */}
//                 <div className="relative h-44 bg-gray-50 overflow-hidden">
//                   {validImage ? (
//                     <img
//                       src={product.image || "/assets/placeholder.png"}
//                       alt={product.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
//                       <FiPackage size={28} />
//                       <span className="text-[10px] font-semibold tracking-widest uppercase">No Image</span>
//                     </div>
//                   )}

//                   {/* Hover Overlay */}
//                   <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5">
//                     <button
//                       onClick={() => { setSelected(product); setShowEdit(true); }}
//                       className="w-10 h-10 rounded-full bg-white text-blue-600 hover:bg-blue-50 hover:scale-110 flex items-center justify-center shadow-lg transition-all"
//                       title="Edit"
//                     >
//                       <FiEdit2 size={15} />
//                     </button>
//                     <button
//                       onClick={() => { setSelected(product); setShowDelete(true); }}
//                       className="w-10 h-10 rounded-full bg-white text-red-500 hover:bg-red-50 hover:scale-110 flex items-center justify-center shadow-lg transition-all"
//                       title="Delete"
//                     >
//                       <FiTrash2 size={15} />
//                     </button>
//                   </div>

//                   {/* Active Badge */}
//                   <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${
//                     product.isActive
//                       ? "bg-emerald-50/90 text-emerald-600 border-emerald-100"
//                       : "bg-gray-50/90 text-gray-400 border-gray-200"
//                   }`}>
//                     {product.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </div>

//                 {/* Card Body */}
//                 <div className="p-4">
//                   <h3 className="text-sm font-bold text-gray-900 truncate tracking-tight">
//                     {product.name}
//                   </h3>
//                   <p className="text-xs text-gray-400 mt-0.5 truncate">
//                     {product.description}
//                   </p>

//                   <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-gray-100">
//                     <div>
//                       <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Price</p>
//                       <p className="text-base font-extrabold text-gray-900 tracking-tight">
//                         ₹{product.price.toLocaleString("en-US")}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <button
//                         onClick={() => { setSelected(product); setShowEdit(true); }}
//                         className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
//                         title="Edit"
//                       >
//                         <FiEdit2 size={13} />
//                       </button>
//                       <button
//                         onClick={() => { setSelected(product); setShowDelete(true); }}
//                         className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition"
//                         title="Delete"
//                       >
//                         <FiTrash2 size={13} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </>
//   );
// }

// new ui frontend

"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage, FiGrid, FiList, FiTrendingUp, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { adminGetProducts, adminDeleteProduct, adminGetProductCategories } from "@/features/admin/api/admin.api";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

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
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-2.5 border ${
          toast.type === "success"
            ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200"
            : "bg-rose-500 text-white border-rose-400 shadow-rose-200"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Panel</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Products</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Product Catalog</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your products, pricing, and availability.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-200"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {/* Total */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200 flex items-center justify-center text-white shrink-0">
            <FiPackage size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{products.length}</p>
            <p className="text-xs text-slate-400 font-semibold">Total Products</p>
          </div>
        </div>
        {/* Active */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200 flex items-center justify-center text-white shrink-0">
            <FiCheckCircle size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{activeCount}</p>
            <p className="text-xs text-slate-400 font-semibold">Active</p>
          </div>
        </div>
        {/* Inactive */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg shadow-slate-200 flex items-center justify-center text-white shrink-0">
            <FiXCircle size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{inactiveCount}</p>
            <p className="text-xs text-slate-400 font-semibold">Inactive</p>
          </div>
        </div>
        {/* Search results */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200 flex items-center justify-center text-white shrink-0">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{filtered.length}</p>
            <p className="text-xs text-slate-400 font-semibold">Showing</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-violet-300 placeholder:text-slate-300 shadow-sm transition-all duration-200"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border-2 border-slate-100 rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 ${
              viewMode === "grid" ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <FiGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 ${
              viewMode === "list" ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <FiList size={14} />
          </button>
        </div>
      </div>

      {/* ── Loading Skeletons ── */}
      {loading && (
        <div className={viewMode === "grid"
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-3"
        }>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`bg-white rounded-2xl border-2 border-slate-100 overflow-hidden ${
              viewMode === "list" ? "flex items-center gap-4 p-4" : ""
            }`}>
              <div className={`bg-slate-100 animate-pulse ${
                viewMode === "grid" ? "h-44 w-full" : "w-16 h-16 rounded-xl shrink-0"
              }`} />
              <div className={`${viewMode === "grid" ? "p-4" : "flex-1"} space-y-2.5`}>
                <div className="h-3.5 bg-slate-100 rounded-lg w-3/4 animate-pulse" />
                <div className="h-2.5 bg-slate-100 rounded-lg w-1/2 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-5 border-2 border-slate-100">
            <FiPackage size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-700 font-black text-lg">No products found</p>
          <p className="text-slate-400 text-sm mt-1.5 max-w-xs mx-auto">
            {search ? `No products match "${search}". Try a different keyword.` : "Add your first product to get started."}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-200"
            >
              <FiPlus size={15} />
              Add First Product
            </button>
          )}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {!loading && filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const validImage = isValidUrl(product.image);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1 hover:border-violet-100 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-50 overflow-hidden">
                  {validImage ? (
                    <img
                      src={product.image || "/assets/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                      <FiPackage size={32} />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">No Image</span>
                    </div>
                  )}

                  {/* Gradient overlay always */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setSelected(product); setShowEdit(true); }}
                      className="w-11 h-11 rounded-2xl bg-white text-violet-600 hover:bg-violet-50 hover:scale-110 flex items-center justify-center shadow-xl transition-all duration-200"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => { setSelected(product); setShowDelete(true); }}
                      className="w-11 h-11 rounded-2xl bg-white text-rose-500 hover:bg-rose-50 hover:scale-110 flex items-center justify-center shadow-xl transition-all duration-200"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                    product.isActive
                      ? "bg-emerald-50/95 text-emerald-600 border-emerald-200 shadow-sm"
                      : "bg-slate-100/95 text-slate-400 border-slate-200"
                  }`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${product.isActive ? "bg-emerald-400" : "bg-slate-400"}`} />
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="text-sm font-black text-slate-800 truncate tracking-tight">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate font-medium">{product.description || "No description"}</p>

                  <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t-2 border-slate-50">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                      <p className="text-lg font-black text-slate-800 tracking-tight">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setSelected(product); setShowEdit(true); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-violet-50 text-violet-500 hover:bg-violet-100 border-2 border-violet-100 hover:border-violet-200 transition-all duration-150"
                        title="Edit"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => { setSelected(product); setShowDelete(true); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 border-2 border-rose-100 hover:border-rose-200 transition-all duration-150"
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

      {/* ── LIST VIEW ── */}
      {!loading && filtered.length > 0 && viewMode === "list" && (
        <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[56px_1fr_140px_100px_110px] items-center gap-4 px-6 py-3.5 bg-slate-50 border-b-2 border-slate-100">
            <div />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</p>
          </div>

          {filtered.map((product, index) => {
            const validImage = isValidUrl(product.image);
            return (
              <div
                key={product.id}
                className={`grid grid-cols-[56px_1fr_140px_100px_110px] items-center gap-4 px-6 py-4 border-b-2 border-slate-50 last:border-0 hover:bg-slate-50/70 transition-all duration-150 group ${
                  index % 2 === 0 ? "" : "bg-slate-50/30"
                }`}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 group-hover:border-violet-200 transition-colors duration-150 shrink-0">
                  {validImage ? (
                    <img
                      src={product.image || "/assets/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage size={18} className="text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{product.description || "No description"}</p>
                </div>

                {/* Price */}
                <div>
                  <p className="text-base font-black text-slate-800 tracking-tight">₹{product.price.toLocaleString("en-IN")}</p>
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                    product.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-emerald-400" : "bg-slate-400"}`} />
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => { setSelected(product); setShowEdit(true); }}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-violet-50 text-violet-500 hover:bg-violet-100 border-2 border-violet-100 hover:border-violet-200 transition-all duration-150"
                    title="Edit"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => { setSelected(product); setShowDelete(true); }}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 border-2 border-rose-100 hover:border-rose-200 transition-all duration-150"
                    title="Delete"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t-2 border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Showing <span className="font-black text-slate-600">{filtered.length}</span> of <span className="font-black text-slate-600">{products.length}</span> products
            </p>
          </div>
        </div>
      )}
    </>
  );
}

