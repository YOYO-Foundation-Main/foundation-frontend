"use client";

export default function ProductCategoriesPage() {
  return (
    <div>
      Product Categories
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";

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
// } from "react-icons/fi";

// import {
//   adminGetProductCategories,
//   adminDeleteProductCategory,
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

//     const [form, setForm] = useState({
//   name: "",
//   description: "",
// });

// const [imageFile, setImageFile] =
//   useState<File | null>(null);

// const [imagePreview, setImagePreview] =
//   useState<string | null>(null);

// const fileRef =
//   useRef<HTMLInputElement>(null);

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
//           ${
//             toast.type === "success"
//               ? "bg-emerald-500 text-white"
//               : "bg-red-500 text-white"
//           }`}
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
//               ${
//                 viewMode === "grid"
//                   ? "bg-violet-600 text-white"
//                   : "text-gray-500"
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
//               ${
//                 viewMode === "list"
//                   ? "bg-violet-600 text-white"
//                   : "text-gray-500"
//               }
//             `}
//           >
//             <FiList />
//           </button>

//         </div>

//       </div>

//       {/* NEXT PART HERE */}
//             {/* ========================= */}
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
//                       ${
//                         category.isActive
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }
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

        


   
// {/* DELETE MODAL */}
// {/* ========================= */}

// <DeleteConfirmModal
//   isOpen={showDelete}
//   title={selectedCategory?.name || ""}
//   onClose={() => {
//     setShowDelete(false);
//     setSelectedCategory(null);
//   }}
//   onConfirm={handleDelete}
// />

// {/* ========================= */}
// {/* CREATE / EDIT MODAL */}
// {/* ========================= */}

// {(showCreate || showEdit) && (
//   <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

//     <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

//       {/* Header */}

//       <div className="px-6 py-5 border-b flex items-center justify-between">

//         <div>

//           <h2 className="text-xl font-black">

//             {showEdit
//               ? "Edit Category"
//               : "Create Category"}

//           </h2>

//           <p className="text-sm text-slate-400">

//             {showEdit
//               ? "Update category details"
//               : "Create new product category"}

//           </p>

//         </div>

//         <button
//           onClick={() => {
//             setShowCreate(false);
//             setShowEdit(false);
//             setSelectedCategory(null);

//             setForm({
//               name: "",
//               description: "",
//             });

//             setImageFile(null);
//             setImagePreview(null);
//           }}
//           className="text-slate-400 hover:text-black"
//         >
//           ✕
//         </button>

//       </div>

//       {/* Body */}

//       <div className="p-6 space-y-5">

//         {/* IMAGE */}

//         <div>

//           <label className="text-sm font-bold block mb-2">
//             Category Image
//           </label>

//           <div className="flex items-center gap-4">

//             <div
//               onClick={() =>
//                 fileRef.current?.click()
//               }
//               className="
//               w-24 h-24
//               rounded-2xl
//               border-2 border-dashed
//               border-slate-300
//               overflow-hidden
//               cursor-pointer
//               flex items-center justify-center"
//             >

//               {imagePreview ? (

//                 <img
//                   src={imagePreview}
//                   alt=""
//                   className="w-full h-full object-cover"
//                 />

//               ) : (

//                 <FiUpload
//                   size={24}
//                   className="text-slate-400"
//                 />

//               )}

//             </div>

//             <div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   fileRef.current?.click()
//                 }
//                 className="
//                 px-4 py-2
//                 bg-violet-600
//                 text-white
//                 rounded-xl
//                 text-sm"
//               >
//                 Upload Image
//               </button>

//               <p className="text-xs text-slate-400 mt-2">
//                 JPG, PNG
//               </p>

//             </div>

//           </div>

//           <input
//             ref={fileRef}
//             type="file"
//             accept="image/*"
//             hidden
//             onChange={(e) => {

//               const file =
//                 e.target.files?.[0];

//               if (!file) return;

//               setImageFile(file);

//               setImagePreview(
//                 URL.createObjectURL(file)
//               );
//             }}
//           />

//         </div>

//         {/* NAME */}

//         <div>

//           <label className="text-sm font-bold block mb-2">
//             Category Name
//           </label>

//           <input
//             value={form.name}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 name: e.target.value,
//               })
//             }
//             className="
//             w-full
//             border
//             rounded-xl
//             px-4 py-3"
//             placeholder="Food & Grocery"
//           />

//         </div>

//         {/* DESCRIPTION */}

//         <div>

//           <label className="text-sm font-bold block mb-2">
//             Description
//           </label>

//           <textarea
//             rows={4}
//             value={form.description}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 description:
//                   e.target.value,
//               })
//             }
//             className="
//             w-full
//             border
//             rounded-xl
//             px-4 py-3"
//             placeholder="Category description..."
//           />

//         </div>

//       </div>

//       {/* Footer */}

//       <div className="border-t p-5 flex justify-end gap-3">

//         <button
//           onClick={() => {
//             setShowCreate(false);
//             setShowEdit(false);
//             setSelectedCategory(null);
//           }}
//           className="
//           px-5 py-2
//           border
//           rounded-xl"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={async () => {

//             try {

//               const formData =
//                 new FormData();

//               formData.append(
//                 "name",
//                 form.name
//               );

//               formData.append(
//                 "description",
//                 form.description
//               );

//               if (imageFile) {

//                 formData.append(
//                   "image",
//                   imageFile
//                 );

//               }

//               if (showEdit &&
//                   selectedCategory) {

//                 await adminUpdateProductCategory(
//                   selectedCategory.id,
//                   formData
//                 );

//               } else {

//                 await adminCreateProductCategory(
//                   formData
//                 );

//               }

//               await loadCategories();

//               setShowCreate(false);
//               setShowEdit(false);

//               setSelectedCategory(null);

//               setForm({
//                 name: "",
//                 description: "",
//               });

//               setImageFile(null);
//               setImagePreview(null);

//             } catch (err) {

//               console.error(err);

//             }

//           }}
//           className="
//           px-5 py-2
//           bg-violet-600
//           text-white
//           rounded-xl"
//         >
//           {showEdit
//             ? "Update Category"
//             : "Create Category"}
//         </button>

//       </div>

//     </div>

//   </div>
// )}
//     </>

//   );
// }