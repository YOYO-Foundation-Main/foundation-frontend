

// "use client";

// import { useEffect, useState, useRef } from "react";

// import {
//   FiSearch,
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiGrid,
//   FiList,
//   FiTrendingUp,
//   FiCheckCircle,
//   FiXCircle,
//   FiFolder,
//   FiUpload
// } from "react-icons/fi";

// import {
//   adminGetProductCategories,
//   adminDeleteProductCategory,
//   adminCreateProductCategory,

//   adminUpdateProductCategory,

// } from "@/features/admin/api/admin.api";

// import {
//   ProductCategory,
// } from "@/features/admin/types/product-category.types";

// import { isValidUrl } from "@/utils/url";

// export default function ProductCategoriesPage() {

//   const [categories, setCategories] =
//     useState<ProductCategory[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [search, setSearch] =
//     useState("");

//   const [viewMode, setViewMode] =
//     useState<"grid" | "list">("grid");

//   const [selectedCategory,
//     setSelectedCategory] =
//     useState<ProductCategory | null>(null);

//   const [showCreate,
//     setShowCreate] =
//     useState(false);

//   const [showEdit,
//     setShowEdit] =
//     useState(false);

//   const [showDelete,
//     setShowDelete] =
//     useState(false);

//   const [toast,
//     setToast] =
//     useState({
//       msg: "",
//       type: "",
//     });

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//   });

//   const [imageFile, setImageFile] =
//     useState<File | null>(null);

//   const [imagePreview, setImagePreview] =
//     useState<string | null>(null);

//   const fileRef =
//     useRef<HTMLInputElement>(null);

//   // ====================================
//   // TOAST
//   // ====================================

//   const showToast = (
//     msg: string,
//     type: "success" | "error"
//   ) => {

//     setToast({
//       msg,
//       type,
//     });

//     setTimeout(() => {

//       setToast({
//         msg: "",
//         type: "",
//       });

//     }, 3000);
//   };

//   // ====================================
//   // FETCH
//   // ====================================

//   const fetchCategories =
//     async () => {

//       try {

//         setLoading(true);

//         const data =
//           await adminGetProductCategories();

//         setCategories(
//           data?.data || []
//         );

//       } catch (error) {

//         console.error(error);

//       } finally {

//         setLoading(false);
//       }
//     };

//   useEffect(() => {

//     fetchCategories();

//   }, []);

//   // ====================================
//   // DELETE
//   // ====================================

//   const handleDelete =
//     async () => {

//       if (!selectedCategory)
//         return;

//       try {

//         await adminDeleteProductCategory(
//           selectedCategory.id
//         );

//         setCategories((prev) =>
//           prev.filter(
//             (c) =>
//               c.id !== selectedCategory.id
//           )
//         );

//         setShowDelete(false);

//         setSelectedCategory(null);

//         showToast(
//           "✅ Category deleted",
//           "success"
//         );

//       } catch (error) {

//         showToast(
//           "Failed to delete category",
//           "error"
//         );
//       }
//     };

//   // ====================================
//   // FILTER
//   // ====================================

//   const filtered =
//     categories.filter((category) =>
//       category.name
//         .toLowerCase()
//         .includes(
//           search.toLowerCase()
//         )
//     );

//   // ====================================
//   // STATS
//   // ====================================

//   const activeCount =
//     categories.filter(
//       (c) => c.isActive
//     ).length;

//   const inactiveCount =
//     categories.filter(
//       (c) => !c.isActive
//     ).length;

//   const totalProducts =
//     categories.reduce(
//       (sum, item) =>
//         sum +
//         (item._count?.products || 0),
//       0
//     );

//   return (
//     <>

//       {/* ========================= */}
//       {/* TOAST */}
//       {/* ========================= */}

//       {toast.msg && (
//         <div
//           className={`fixed top-5 right-5 z-[100]
//           px-5 py-3 rounded-2xl text-sm
//           font-bold shadow-xl
//           ${toast.type === "success"
//               ? "bg-emerald-500 text-white"
//               : "bg-red-500 text-white"
//             }`}
//         >
//           {toast.msg}
//         </div>
//       )}

//       {/* ========================= */}
//       {/* HEADER */}
//       {/* ========================= */}

//       <div className="flex items-start justify-between mb-7">

//         <div>

//           <div className="flex items-center gap-2 mb-1">

//             <span
//               className="
//               text-xs
//               font-semibold
//               text-slate-400
//               uppercase
//               tracking-widest"
//             >
//               Admin Panel
//             </span>

//             <span className="text-slate-300">
//               /
//             </span>

//             <span
//               className="
//               text-xs
//               font-semibold
//               text-violet-500
//               uppercase
//               tracking-widest"
//             >
//               Product Categories
//             </span>

//           </div>

//           <h1
//             className="
//             text-2xl
//             font-black
//             text-slate-800"
//           >
//             Product Categories
//           </h1>

//           <p
//             className="
//             text-sm
//             text-slate-400
//             mt-1"
//           >
//             Manage categories used
//             by products.
//           </p>

//         </div>

//         <button
//           onClick={() =>
//             setShowCreate(true)
//           }
//           className="
//           flex items-center gap-2
//           bg-violet-600
//           hover:bg-violet-700
//           text-white
//           text-sm
//           font-bold
//           px-5 py-3
//           rounded-2xl"
//         >
//           <FiPlus size={16} />
//           Add Category
//         </button>

//       </div>

//       {/* ========================= */}
//       {/* STATS */}
//       {/* ========================= */}

//       <div
//         className="
//         grid
//         grid-cols-2
//         lg:grid-cols-4
//         gap-4
//         mb-7"
//       >

//         {/* TOTAL */}

//         <div className="bg-white rounded-2xl border p-5 flex gap-4">

//           <div
//             className="
//             w-12 h-12 rounded-2xl
//             bg-violet-600
//             flex items-center justify-center
//             text-white"
//           >
//             <FiFolder size={20} />
//           </div>

//           <div>

//             <p className="text-2xl font-black">
//               {categories.length}
//             </p>

//             <p className="text-xs text-gray-500">
//               Categories
//             </p>

//           </div>

//         </div>

//         {/* ACTIVE */}

//         <div className="bg-white rounded-2xl border p-5 flex gap-4">

//           <div
//             className="
//             w-12 h-12 rounded-2xl
//             bg-emerald-500
//             flex items-center justify-center
//             text-white"
//           >
//             <FiCheckCircle size={20} />
//           </div>

//           <div>

//             <p className="text-2xl font-black">
//               {activeCount}
//             </p>

//             <p className="text-xs text-gray-500">
//               Active
//             </p>

//           </div>

//         </div>

//         {/* PRODUCTS */}

//         <div className="bg-white rounded-2xl border p-5 flex gap-4">

//           <div
//             className="
//             w-12 h-12 rounded-2xl
//             bg-orange-500
//             flex items-center justify-center
//             text-white"
//           >
//             <FiTrendingUp size={20} />
//           </div>

//           <div>

//             <p className="text-2xl font-black">
//               {totalProducts}
//             </p>

//             <p className="text-xs text-gray-500">
//               Total Products
//             </p>

//           </div>

//         </div>

//         {/* SHOWING */}

//         <div className="bg-white rounded-2xl border p-5 flex gap-4">

//           <div
//             className="
//             w-12 h-12 rounded-2xl
//             bg-blue-500
//             flex items-center justify-center
//             text-white"
//           >
//             <FiList size={20} />
//           </div>

//           <div>

//             <p className="text-2xl font-black">
//               {filtered.length}
//             </p>

//             <p className="text-xs text-gray-500">
//               Showing
//             </p>

//           </div>

//         </div>

//       </div>

//       {/* ========================= */}
//       {/* SEARCH + VIEW */}
//       {/* ========================= */}

//       <div className="flex gap-3 mb-6">

//         <div className="relative flex-1">

//           <FiSearch
//             size={14}
//             className="
//             absolute left-4 top-1/2
//             -translate-y-1/2
//             text-slate-400"
//           />

//           <input
//             value={search}
//             onChange={(e) =>
//               setSearch(
//                 e.target.value
//               )
//             }
//             placeholder="Search categories..."
//             className="
//             w-full
//             bg-white
//             border
//             rounded-2xl
//             pl-10
//             pr-4
//             py-3"
//           />

//         </div>

//         <div
//           className="
//           flex items-center gap-1
//           bg-white border
//           rounded-2xl p-1"
//         >

//           <button
//             onClick={() =>
//               setViewMode("grid")
//             }
//             className={`
//               w-9 h-9 rounded-xl
//               flex items-center justify-center
//               ${viewMode === "grid"
//                 ? "bg-violet-600 text-white"
//                 : "text-gray-500"
//               }
//             `}
//           >
//             <FiGrid />
//           </button>

//           <button
//             onClick={() =>
//               setViewMode("list")
//             }
//             className={`
//               w-9 h-9 rounded-xl
//               flex items-center justify-center
//               ${viewMode === "list"
//                 ? "bg-violet-600 text-white"
//                 : "text-gray-500"
//               }
//             `}
//           >
//             <FiList />
//           </button>

//         </div>

//       </div>

//       {/* NEXT PART HERE */}
//       {/* ========================= */}
//       {/* LOADING */}
//       {/* ========================= */}

//       {loading && (
//         <div
//           className={
//             viewMode === "grid"
//               ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//               : "space-y-3"
//           }
//         >
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="h-64 rounded-2xl bg-white border animate-pulse"
//             />
//           ))}
//         </div>
//       )}

//       {/* ========================= */}
//       {/* EMPTY */}
//       {/* ========================= */}

//       {!loading && filtered.length === 0 && (
//         <div className="bg-white rounded-3xl border p-16 text-center">

//           <FiFolder
//             size={50}
//             className="mx-auto text-slate-300 mb-4"
//           />

//           <h3 className="font-black text-lg">
//             No Categories Found
//           </h3>

//           <p className="text-slate-400 mt-2">
//             Create your first category.
//           </p>

//         </div>
//       )}

//       {/* ========================= */}
//       {/* GRID VIEW */}
//       {/* ========================= */}

//       {!loading &&
//         filtered.length > 0 &&
//         viewMode === "grid" && (

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

//             {filtered.map((category) => {

//               const validImage =
//                 isValidUrl(category.image);

//               return (

//                 <div
//                   key={category.id}
//                   className="
//                   bg-white
//                   rounded-2xl
//                   border
//                   overflow-hidden
//                   hover:shadow-xl
//                   transition"
//                 >

//                   {/* IMAGE */}

//                   <div className="relative h-48 bg-slate-100">

//                     {validImage ? (

//                       <img
//                         src={category.image}
//                         alt={category.name}
//                         className="w-full h-full object-cover"
//                       />

//                     ) : (

//                       <div className="w-full h-full flex items-center justify-center">

//                         <FiFolder
//                           size={40}
//                           className="text-slate-300"
//                         />

//                       </div>

//                     )}

//                     <span
//                       className={`
//                       absolute top-3 left-3
//                       text-[10px]
//                       px-2 py-1 rounded-full
//                       font-bold
//                       ${category.isActive
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                         }
//                     `}
//                     >
//                       {category.isActive
//                         ? "ACTIVE"
//                         : "INACTIVE"}
//                     </span>

//                   </div>

//                   {/* BODY */}

//                   <div className="p-4">

//                     <h3 className="font-black text-slate-800 truncate">
//                       {category.name}
//                     </h3>

//                     <p className="text-xs text-slate-400 mt-1 line-clamp-2">
//                       {category.description ||
//                         "No description"}
//                     </p>

//                     <div className="mt-4 flex items-center justify-between">

//                       <div>

//                         <p className="text-[10px] uppercase text-slate-400">
//                           Products
//                         </p>

//                         <p className="font-black text-lg">
//                           {category._count?.products || 0}
//                         </p>

//                       </div>

//                       <div className="flex gap-2">

//                         <button
//                           onClick={() => {
//                             setSelectedCategory(
//                               category
//                             );
//                             setForm({
//                               name: category.name || "",
//                               description:
//                                 category.description || "",
//                             });

//                             setImagePreview(
//                               category.image || null
//                             );

//                             setShowEdit(true);
//                           }}
//                           className="
//                           w-8 h-8 rounded-xl
//                           bg-violet-50
//                           text-violet-600
//                           flex items-center justify-center"
//                         >
//                           <FiEdit2 size={13} />
//                         </button>

//                         <button
//                           onClick={() => {
//                             setSelectedCategory(
//                               category
//                             );
//                             setShowDelete(true);
//                           }}
//                           className="
//                           w-8 h-8 rounded-xl
//                           bg-red-50
//                           text-red-600
//                           flex items-center justify-center"
//                         >
//                           <FiTrash2 size={13} />
//                         </button>

//                       </div>

//                     </div>

//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}

//       {/* ========================= */}
//       {/* LIST VIEW */}
//       {/* ========================= */}

//       {!loading &&
//         filtered.length > 0 &&
//         viewMode === "list" && (

//           <div className="bg-white rounded-3xl border overflow-hidden">

//             <div
//               className="
//               grid
//               grid-cols-[70px_1fr_150px_120px]
//               px-6 py-4
//               bg-slate-50
//               border-b"
//             >
//               <div />
//               <p className="text-xs font-bold">
//                 Category
//               </p>
//               <p className="text-xs font-bold">
//                 Products
//               </p>
//               <p className="text-xs font-bold">
//                 Actions
//               </p>
//             </div>

//             {filtered.map((category) => {

//               const validImage =
//                 isValidUrl(category.image);

//               return (

//                 <div
//                   key={category.id}
//                   className="
//                   grid
//                   grid-cols-[70px_1fr_150px_120px]
//                   px-6 py-4
//                   border-b
//                   items-center"
//                 >

//                   <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">

//                     {validImage ? (
//                       <img
//                         src={category.image}
//                         alt=""
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <FiFolder />
//                       </div>
//                     )}

//                   </div>

//                   <div>

//                     <p className="font-bold">
//                       {category.name}
//                     </p>

//                     <p className="text-xs text-slate-400">
//                       {category.description}
//                     </p>

//                   </div>

//                   <div>

//                     <span className="font-black">
//                       {category._count?.products || 0}
//                     </span>

//                   </div>

//                   <div className="flex gap-2">

//                     <button
//                       onClick={() => {
//                         setSelectedCategory(
//                           category
//                         );
//                         setForm({
//                           name: category.name || "",
//                           description:
//                             category.description || "",
//                         });

//                         setImagePreview(
//                           category.image || null
//                         );

//                         setShowEdit(true);
//                       }}
//                       className="
//                       w-8 h-8
//                       rounded-xl
//                       bg-violet-50
//                       text-violet-600
//                       flex items-center justify-center"
//                     >
//                       <FiEdit2 size={13} />
//                     </button>

//                     <button
//                       onClick={() => {
//                         setSelectedCategory(
//                           category
//                         );
//                         setShowDelete(true);
//                       }}
//                       className="
//                       w-8 h-8
//                       rounded-xl
//                       bg-red-50
//                       text-red-600
//                       flex items-center justify-center"
//                     >
//                       <FiTrash2 size={13} />
//                     </button>

//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}





//       {/* DELETE MODAL */}
//       {/* ========================= */}

//       {/* <DeleteConfirmModal
//         isOpen={showDelete}
//         title={selectedCategory?.name || ""}
//         onClose={() => {
//           setShowDelete(false);
//           setSelectedCategory(null);
//         }}
//         onConfirm={handleDelete}
//       /> */}

//       {/* ========================= */}
//       {/* CREATE / EDIT MODAL */}
//       {/* ========================= */}

//       {(showCreate || showEdit) && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

//           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

//             {/* Header */}

//             <div className="px-6 py-5 border-b flex items-center justify-between">

//               <div>

//                 <h2 className="text-xl font-black">

//                   {showEdit
//                     ? "Edit Category"
//                     : "Create Category"}

//                 </h2>

//                 <p className="text-sm text-slate-400">

//                   {showEdit
//                     ? "Update category details"
//                     : "Create new product category"}

//                 </p>

//               </div>

//               <button
//                 onClick={() => {
//                   setShowCreate(false);
//                   setShowEdit(false);
//                   setSelectedCategory(null);

//                   setForm({
//                     name: "",
//                     description: "",
//                   });

//                   setImageFile(null);
//                   setImagePreview(null);
//                 }}
//                 className="text-slate-400 hover:text-black"
//               >
//                 ✕
//               </button>

//             </div>

//             {/* Body */}

//             <div className="p-6 space-y-5">

//               {/* IMAGE */}

//               <div>

//                 <label className="text-sm font-bold block mb-2">
//                   Category Image
//                 </label>

//                 <div className="flex items-center gap-4">

//                   <div
//                     onClick={() =>
//                       fileRef.current?.click()
//                     }
//                     className="
//               w-24 h-24
//               rounded-2xl
//               border-2 border-dashed
//               border-slate-300
//               overflow-hidden
//               cursor-pointer
//               flex items-center justify-center"
//                   >

//                     {imagePreview ? (

//                       <img
//                         src={imagePreview}
//                         alt=""
//                         className="w-full h-full object-cover"
//                       />

//                     ) : (

//                       <FiUpload
//                         size={24}
//                         className="text-slate-400"
//                       />

//                     )}

//                   </div>

//                   <div>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         fileRef.current?.click()
//                       }
//                       className="
//                 px-4 py-2
//                 bg-violet-600
//                 text-white
//                 rounded-xl
//                 text-sm"
//                     >
//                       Upload Image
//                     </button>

//                     <p className="text-xs text-slate-400 mt-2">
//                       JPG, PNG
//                     </p>

//                   </div>

//                 </div>

//                 <input
//                   ref={fileRef}
//                   type="file"
//                   accept="image/*"
//                   hidden
//                   onChange={(e) => {

//                     const file =
//                       e.target.files?.[0];

//                     if (!file) return;

//                     setImageFile(file);

//                     setImagePreview(
//                       URL.createObjectURL(file)
//                     );
//                   }}
//                 />

//               </div>

//               {/* NAME */}

//               <div>

//                 <label className="text-sm font-bold block mb-2">
//                   Category Name
//                 </label>

//                 <input
//                   value={form.name}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       name: e.target.value,
//                     })
//                   }
//                   className="
//             w-full
//             border
//             rounded-xl
//             px-4 py-3"
//                   placeholder="Food & Grocery"
//                 />

//               </div>

//               {/* DESCRIPTION */}

//               <div>

//                 <label className="text-sm font-bold block mb-2">
//                   Description
//                 </label>

//                 <textarea
//                   rows={4}
//                   value={form.description}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       description:
//                         e.target.value,
//                     })
//                   }
//                   className="
//             w-full
//             border
//             rounded-xl
//             px-4 py-3"
//                   placeholder="Category description..."
//                 />

//               </div>

//             </div>

//             {/* Footer */}

//             <div className="border-t p-5 flex justify-end gap-3">

//               <button
//                 onClick={() => {
//                   setShowCreate(false);
//                   setShowEdit(false);
//                   setSelectedCategory(null);
//                 }}
//                 className="
//           px-5 py-2
//           border
//           rounded-xl"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={async () => {

//                   try {

//                     const formData =
//                       new FormData();

//                     formData.append(
//                       "name",
//                       form.name
//                     );

//                     formData.append(
//                       "description",
//                       form.description
//                     );

//                     if (imageFile) {

//                       formData.append(
//                         "image",
//                         imageFile
//                       );

//                     }

//                     if (showEdit &&
//                       selectedCategory) {

//                       await adminUpdateProductCategory(
//                         selectedCategory.id,
//                         formData
//                       );

//                     } else {

//                       await adminCreateProductCategory(
//                         formData
//                       );

//                     }

//                     await fetchCategories();
//                     setShowCreate(false);
//                     setShowEdit(false);

//                     setSelectedCategory(null);

//                     setForm({
//                       name: "",
//                       description: "",
//                     });

//                     setImageFile(null);
//                     setImagePreview(null);

//                   } catch (err) {

//                     console.error(err);

//                   }

//                 }}
//                 className="
//           px-5 py-2
//           bg-violet-600
//           text-white
//           rounded-xl"
//               >
//                 {showEdit
//                   ? "Update Category"
//                   : "Create Category"}
//               </button>

//             </div>

//           </div>

//         </div>
//       )}
//     </>

//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search, Plus, Pencil, Trash2, LayoutGrid, List,
  TrendingUp, CheckCircle2, Folder, Upload, X,
  Loader2, AlertTriangle, Package,
} from "lucide-react";

import {
  adminGetProductCategories,
  adminDeleteProductCategory,
  adminCreateProductCategory,
  adminUpdateProductCategory,
} from "@/features/admin/api/admin.api";

import { ProductCategory } from "@/features/admin/types/product-category.types";
import { isValidUrl } from "@/utils/url";

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
type ToastState = { msg: string; type: "success" | "error" | "" };

function ToastBar({ toast }: { toast: ToastState }) {
  if (!toast.msg) return null;
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl
      ${toast.type === "success" ? "bg-green-600 text-white" : "bg-[#D2252B] text-white"}`}>
      {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      {toast.msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-white ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DeleteModal({ category, onClose, onConfirm, processing }: {
  category: ProductCategory | null; onClose: () => void; onConfirm: () => void; processing: boolean;
}) {
  if (!category) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5 text-[#D2252B]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete Category</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Permanently delete <span className="font-semibold text-gray-800">"{category.name}"</span>? This cannot be undone and may affect linked products.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} disabled={processing} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={processing} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold transition disabled:opacity-60">
            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE / EDIT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CategoryModal({ mode, category, onClose, onSaved }: {
  mode: "create" | "edit"; category: ProductCategory | null;
  onClose: () => void; onSaved: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: category?.name || "", description: category?.description || "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image && isValidUrl(category.image) ? category.image : null
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Category name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);

      if (mode === "edit" && category) {
        await adminUpdateProductCategory(category.id, fd);
      } else {
        await adminCreateProductCategory(fd);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#D2252B]/10 flex items-center justify-center">
              {mode === "edit" ? <Pencil className="h-4 w-4 text-[#D2252B]" /> : <Plus className="h-4 w-4 text-[#D2252B]" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{mode === "edit" ? "Edit Category" : "Create Category"}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{mode === "edit" ? "Update category details" : "Add a new product category"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Image upload */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Category Image <span className="text-gray-400 text-xs font-normal">(optional)</span></label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className={`w-24 h-24 rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer flex items-center justify-center transition
                  ${imagePreview ? "border-[#D2252B]/30" : "border-gray-200 hover:border-[#D2252B]/40 hover:bg-[#D2252B]/5"}`}
              >
                {imagePreview
                  ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  : <Upload className="h-6 w-6 text-gray-400" />}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D2252B]/10 text-[#D2252B] text-sm font-semibold hover:bg-[#D2252B]/20 transition"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Image
                </button>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP supported</p>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setImageFile(f);
                setImagePreview(URL.createObjectURL(f));
              }} />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
              Category Name <span className="text-[#D2252B]">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => { const n = { ...p }; delete n.name; return n; }); }}
              placeholder="e.g. Food & Grocery"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10 ${errors.name ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-gray-300"}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
              Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of this category..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition resize-none hover:border-gray-300 focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold transition disabled:opacity-60 shadow-sm shadow-[#D2252B]/20">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "edit" ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY GRID CARD
// ─────────────────────────────────────────────────────────────────────────────
function CategoryGridCard({ category, onEdit, onDelete }: {
  category: ProductCategory; onEdit: () => void; onDelete: () => void;
}) {
  const hasImage = isValidUrl(category.image);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative h-44 bg-gray-50">
        {hasImage
          ? <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><Folder className="h-10 w-10 text-gray-300" /></div>}
        <span className={`absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full font-bold
          ${category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {category.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate">{category.name}</h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-[2rem]">{category.description || "No description"}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-semibold">Products</p>
            <p className="font-bold text-lg text-gray-900">{category._count?.products || 0}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={onDelete} className="w-8 h-8 rounded-xl bg-red-50 text-[#D2252B] flex items-center justify-center hover:bg-red-100 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ msg: "", type: "" });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminGetProductCategories();
      setCategories(data?.data || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      setDeleting(true);
      await adminDeleteProductCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setShowDelete(false);
      setSelectedCategory(null);
      showToast("Category deleted successfully", "success");
    } catch {
      showToast("Failed to delete category", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (category: ProductCategory) => { setSelectedCategory(category); setModalMode("edit"); };
  const openDelete = (category: ProductCategory) => { setSelectedCategory(category); setShowDelete(true); };
  const closeModal = () => { setModalMode(null); setSelectedCategory(null); };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = categories.filter((c) => c.isActive).length;
  const totalProducts = categories.reduce((s, c) => s + (c._count?.products || 0), 0);

  return (
    <>
      <ToastBar toast={toast} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Admin Panel / <span className="text-[#D2252B]">Product Categories</span>
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage categories used by products</p>
          </div>
          <button
            onClick={() => setModalMode("create")}
            className="flex items-center gap-2 bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shadow-[#D2252B]/20"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Categories" value={categories.length} icon={Folder}       color="bg-[#D2252B]" />
          <StatCard label="Active"           value={activeCount}       icon={CheckCircle2} color="bg-green-600" />
          <StatCard label="Total Products"   value={totalProducts}     icon={TrendingUp}   color="bg-orange-500" />
          <StatCard label="Showing"          value={filtered.length}   icon={Package}      color="bg-blue-500" />
        </div>

        {/* ── Search + View Toggle ── */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition
                  ${viewMode === mode ? "bg-[#D2252B] text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                {mode === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`rounded-2xl bg-white border border-gray-100 animate-pulse ${viewMode === "grid" ? "h-64" : "h-16"}`} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Folder className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900">No categories found</h3>
            <p className="text-sm text-gray-500 mt-1.5">
              {search ? "Try a different search term." : "Create your first product category."}
            </p>
            {!search && (
              <button
                onClick={() => setModalMode("create")}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold transition"
              >
                <Plus className="h-4 w-4" /> Add Category
              </button>
            )}
          </div>
        )}

        {/* ── Grid view ── */}
        {!loading && filtered.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((category) => (
              <CategoryGridCard
                key={category.id}
                category={category}
                onEdit={() => openEdit(category)}
                onDelete={() => openDelete(category)}
              />
            ))}
          </div>
        )}

        {/* ── List view ── */}
        {!loading && filtered.length > 0 && viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[64px_1fr_100px_100px_120px] px-5 py-3 bg-gray-50 border-b border-gray-100">
              <div />
              {["Category", "Status", "Products", "Actions"].map((h) => (
                <p key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</p>
              ))}
            </div>
            {filtered.map((category) => {
              const hasImage = isValidUrl(category.image);
              return (
                <div key={category.id} className="grid grid-cols-[64px_1fr_100px_100px_120px] px-5 py-4 border-b border-gray-50 items-center hover:bg-gray-50/60 transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {hasImage
                      ? <img src={category.image} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Folder className="h-4 w-4 text-gray-400" /></div>}
                  </div>
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-gray-900 truncate">{category.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{category.description || "—"}</p>
                  </div>
                  <div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold
                      ${category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {category.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900">{category._count?.products || 0}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(category)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => openDelete(category)} className="w-8 h-8 rounded-xl bg-red-50 text-[#D2252B] flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalMode && (
        <CategoryModal
          mode={modalMode}
          category={selectedCategory}
          onClose={closeModal}
          onSaved={async () => {
            closeModal();
            await fetchCategories();
            showToast(modalMode === "edit" ? "Category updated successfully" : "Category created successfully", "success");
          }}
        />
      )}

      {/* ── Delete Modal ── */}
      <DeleteModal
        category={showDelete ? selectedCategory : null}
        onClose={() => { setShowDelete(false); setSelectedCategory(null); }}
        onConfirm={handleDelete}
        processing={deleting}
      />
    </>
  );
}
