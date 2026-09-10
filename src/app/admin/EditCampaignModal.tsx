// "use client";
// import { useState, useRef, useEffect } from "react";
// import { FiX, FiUpload, FiTrash2, FiPlus, FiMinus, FiPackage } from "react-icons/fi";
// import { adminUpdateCampaign, adminGetCauses, adminGetProducts, adminAddCampaignProducts } from "@/features/admin/api/admin.api";
// import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
// import { isValidUrl } from "@/utils/url";

// interface Props {
//   isOpen: boolean;
//   campaign: Campaign | null;
//   onClose: () => void;
//   onSuccess: () => void; 
// }

// interface CauseOption { id: number; name: string; }
// interface ProductOption { id: number; name: string; price: number; image: string | null; }

// interface CartItem {
//   id?: number;
//   productId: number;
//   name: string;
//   price: number;
//   image: string | null;
//   quantity: number;
// }

// export default function EditCampaignModal({ isOpen, campaign, onClose, onSuccess }: Props) {
//   const [causes, setCauses] = useState<CauseOption[]>([]);
//   const [products, setProducts] = useState<ProductOption[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [toast, setToast] = useState({ msg: "", type: "" });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const fileRef = useRef<HTMLInputElement>(null);

//   // Products state
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [selectedProductId, setSelectedProductId] = useState("");

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     // goalAmount: "",
//     causeId: "",
//     startDate: "",
//     endDate: "",
//   });

//   // Pre-fill form when campaign changes
//   useEffect(() => {
//     if (!campaign) return;
//     setForm({
//       title: campaign.title || "",
//       description: campaign.description || "",
//       location: campaign.location || "",
//       // goalAmount: campaign.goalAmount?.toString() || "",
//       causeId: campaign.causeId?.toString() || "",
//       startDate: campaign.startDate?.split("T")[0] || "",
//       endDate: campaign.endDate?.split("T")[0] || "",
//     });
//     setImagePreview(campaign.image && campaign.image.startsWith("http") ? campaign.image : null);
//     setImageFile(null);

//     // Load existing products into cart
//     if (campaign.campaignProducts && campaign.campaignProducts.length > 0) {
//       const existingProducts = campaign.campaignProducts.map((p: CampaignProduct) => ({
//         id: p.id,
//         productId: p.productId,
//         name: p.name,
//         price: p.price,
//         image: p.image,
//         quantity: p.quantity,
//       }));
//       setCart(existingProducts);
//     } else {
//       setCart([]);
//     }
//   }, [campaign]);

//   // Load causes
//   useEffect(() => {
//     if (!isOpen) return;
//     const load = async () => {
//       try {
//         const data = await adminGetCauses();
//         setCauses(Array.isArray(data) ? data : data?.data || []);
//       } catch (err) { console.error("Failed to load causes:", err); }
//     };
//     load();
//   }, [isOpen]);

//   // Load products when modal opens
//   useEffect(() => {
//     if (!isOpen) return;
//     const loadProducts = async () => {
//       try {
//         setLoadingProducts(true);
//         const data = await adminGetProducts();
//         setProducts(data?.Products || data?.products || []);
//       } catch (err) { console.error("Failed to load products:", err); }
//       finally { setLoadingProducts(false); }
//     };
//     loadProducts();
//   }, [isOpen]);

//   const showToast = (msg: string, type: "success" | "error") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: "", type: "" }), 3000);
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   // ── Cart Helpers ──────────────────────────────────────────────────────────
//   const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const addToCart = () => {
//     if (!selectedProductId) return;
//     const product = products.find((p) => p.id === Number(selectedProductId));
//     if (!product) return;
//     const existing = cart.find((i) => i.productId === product.id);
//     if (existing) {
//       setCart(cart.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
//     } else {
//       setCart([...cart, {
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         quantity: 1,
//       }]);
//     }
//     setSelectedProductId("");
//   };

//   const updateQty = (productId: number, delta: number) => {
//     setCart(cart
//       .map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
//       .filter((i) => i.quantity > 0)
//     );
//   };

//   const removeFromCart = (productId: number) => {
//     setCart(cart.filter((i) => i.productId !== productId));
//   };

//   const handleSubmit = async () => {
//     if (!campaign) return;
//     if (!form.title) { showToast("Title is required", "error"); return; }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("title", form.title);
//       formData.append("description", form.description);
//       formData.append("location", form.location);
//       // formData.append("goalAmount", form.goalAmount);
//       formData.append("causeId", form.causeId);
//       formData.append("startDate", form.startDate);
//       if (form.endDate) formData.append("endDate", form.endDate);
//       if (imageFile) formData.append("image", imageFile);

//       // Add products to formData
//       formData.append("products", JSON.stringify(cart.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//         ...(p.id && { id: p.id }) // Include existing product ID for updates
//       }))));

//       await adminUpdateCampaign(campaign.id, formData);

//       // ADD THIS
//       // if (cart.length > 0) {
//       //   await adminAddCampaignProducts({
//       //     campaignId: campaign.id,
//       //     products: cart.map((p) => ({
//       //       productId: p.productId,
//       //       quantity: p.quantity,
//       //     })),
//       //   });
//       // }
//       showToast("✅ Campaign updated!", "success");
//       setTimeout(() => { onSuccess(); onClose(); }, 1000);
//     } catch (err: any) {
//       showToast(err.message || "Failed to update", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen || !campaign) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <div>
//             <h2 className="text-lg font-bold text-gray-800">Edit Campaign</h2>
//             <p className="text-xs text-gray-400 mt-0.5">Update campaign details and products</p>
//           </div>
//           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
//             <FiX size={18} />
//           </button>
//         </div>

//         {toast.msg && (
//           <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
//             }`}>{toast.msg}</div>
//         )}

//         <div className="p-6 space-y-8">

//           {/* Campaign Basics */}
//           <div className="flex gap-8">
//             <div className="w-48 shrink-0">
//               <h3 className="text-sm font-bold text-gray-800">Campaign Basics</h3>
//               <p className="text-xs text-gray-400 mt-1 leading-relaxed">Update your campaign information.</p>
//             </div>
//             <div className="flex-1 space-y-4">

//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 mb-2">Cover Image</label>
//                 <div className="flex items-center gap-4">
//                   <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
//                     {imagePreview
//                       ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
//                       : <FiUpload size={20} className="text-gray-400" />
//                     }
//                   </div>
//                   <div>
//                     <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-[#334E79] text-white text-xs font-semibold rounded-lg hover:bg-[#2a3e60] transition">
//                       {imagePreview ? "Change Image" : "Upload Image"}
//                     </button>
//                     {imageFile && (
//                       <div className="flex items-center gap-2 mt-2">
//                         <span className="text-xs text-gray-500 truncate max-w-[160px]">{imageFile.name}</span>
//                         <button onClick={() => { setImageFile(null); setImagePreview(campaign.image?.startsWith("http") ? campaign.image : null); }}>
//                           <FiTrash2 size={12} className="text-red-400" />
//                         </button>
//                       </div>
//                     )}
//                     <p className="text-[10px] text-gray-400 mt-1">Recommended: 1200 × 600px · JPG/PNG</p>
//                     <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title <span className="text-red-500">*</span></label>
//                   <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cause <span className="text-red-500">*</span></label>
//                   <select value={form.causeId} onChange={(e) => setForm({ ...form, causeId: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition">
//                     <option value="">Select a cause</option>
//                     {causes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
//                 <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-100" />

//           {/* Goals & Timeline */}
//           <div className="flex gap-8">
//             <div className="w-48 shrink-0">
//               <h3 className="text-sm font-bold text-gray-800">Goals & Timeline</h3>
//               <p className="text-xs text-gray-400 mt-1 leading-relaxed">Update fundraising goals and schedule.</p>
//             </div>
//             <div className="flex-1 space-y-4">
//               {/* <div>
//                 <label className="block text-xs font-semibold text-gray-600 mb-1.5">Target Amount (₹) <span className="text-red-500">*</span></label>
//                 <input type="number" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
//               </div> */}

//               <div className="bg-gray-50 rounded-xl p-4 border">
//                 <p className="text-xs text-gray-500 mb-1">
//                   Campaign Goal Amount
//                 </p>

//                 <p className="text-2xl font-bold text-[#334E79]">
//                   ₹{cartTotal.toLocaleString("en-US")}
//                 </p>

//                 <p className="text-xs text-gray-400 mt-1">
//                   Auto calculated from products
//                 </p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date</label>
//                   <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date</label>
//                   <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-100" />

//           {/* Products Section */}
//           <div className="flex gap-8">
//             <div className="w-48 shrink-0">
//               <div className="flex items-center gap-2">
//                 <FiPackage size={16} className="text-gray-500" />
//                 <h3 className="text-sm font-bold text-gray-800">Products</h3>
//               </div>
//               <p className="text-xs text-gray-400 mt-1 leading-relaxed">Manage products needed for this campaign.</p>
//             </div>
//             <div className="flex-1 space-y-4">

//               {/* Add Product */}
//               <div className="flex gap-2">
//                 <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}
//                   className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition">
//                   <option value="">
//                     {loadingProducts ? "Loading products..." : "Select a product to add"}
//                   </option>
//                   {products
//                     .filter((p) => !cart.find((c) => c.productId === p.id))
//                     .map((p) => (
//                       <option key={p.id} value={p.id}>
//                         {p.name} — ₹{p.price.toLocaleString("en-US")}
//                       </option>
//                     ))
//                   }
//                 </select>
//                 <button onClick={addToCart} disabled={!selectedProductId}
//                   className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shrink-0 ${selectedProductId ? "bg-[#334E79] text-white hover:bg-[#2a3e60]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     }`}>
//                   <FiPlus size={14} /> Add
//                 </button>
//               </div>

//               {/* Cart Items */}
//               {cart.length === 0 ? (
//                 <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-400 border-2 border-dashed border-gray-200">
//                   No products added. Select from the dropdown above.
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {cart.map((item) => (
//                     <div key={item.productId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
//                       <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
//                         {isValidUrl(item.image)
//                           ? <img src={item.image || "/assets/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
//                           : <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[8px] text-gray-400">No img</div>
//                         }
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
//                         <p className="text-xs text-gray-400">₹{item.price.toLocaleString("en-US")} each</p>
//                       </div>
//                       <div className="flex items-center gap-2 shrink-0">
//                         <button onClick={() => updateQty(item.productId, -1)}
//                           className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
//                           <FiMinus size={12} />
//                         </button>
//                         <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
//                         <button onClick={() => updateQty(item.productId, 1)}
//                           className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
//                           <FiPlus size={12} />
//                         </button>
//                       </div>
//                       <div className="text-right shrink-0 w-20">
//                         <p className="text-sm font-bold text-gray-800">
//                           ₹{(item.price * item.quantity).toLocaleString("en-US")}
//                         </p>
//                         <button onClick={() => removeFromCart(item.productId)}
//                           className="text-[10px] text-red-400 hover:text-red-600 transition">Remove</button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="flex items-center justify-between bg-[#334E79]/5 border border-[#334E79]/20 rounded-xl px-4 py-3 mt-2">
//                     <span className="text-sm font-semibold text-gray-700">
//                       Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)
//                     </span>
//                     <span className="text-base font-bold text-[#334E79]">
//                       ₹{cartTotal.toLocaleString("en-US")}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="border-t border-gray-100" />

//           {/* Description */}
//           <div className="flex gap-8">
//             <div className="w-48 shrink-0">
//               <h3 className="text-sm font-bold text-gray-800">Story</h3>
//               <p className="text-xs text-gray-400 mt-1 leading-relaxed">Update the campaign description.</p>
//             </div>
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
//               <textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none transition" />
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
//           <button onClick={onClose} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition">Cancel</button>
//           <button onClick={handleSubmit} disabled={loading}
//             className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#334E79] hover:bg-[#2a3e60] text-white"
//               }`}>
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
//  }

"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Trash2,
  Plus,
  Minus,
  Package,
  Loader2,
  ImageIcon,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import {
  adminUpdateCampaign,
  adminGetCauses,
  adminGetProducts,
} from "@/features/admin/api/admin.api";
import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
import { isValidUrl } from "@/utils/url";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

interface Props {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface CauseOption {
  id: number;
  name: string;
}

interface ProductOption {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

interface CartItem {
  id?: number;
  productId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

type CampaignStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | string;
type AdminApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

interface FormState {
  title: string;
  description: string;
  location: string;
  causeId: string;
  goalAmount: string;
  startDate: string;
  endDate: string;
  // admin-only
  status: CampaignStatus;
  adminApprovalStatus: AdminApprovalStatus;
  isFeatured: boolean;
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-44 shrink-0">
      {icon && <div className="mb-1.5 text-slate-400">{icon}</div>}
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition placeholder:text-slate-400";

const selectCls =
  "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition bg-white";

const STATUS_OPTIONS: CampaignStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "ACTIVE",
  "COMPLETED",
];

const ADMIN_APPROVAL_OPTIONS: AdminApprovalStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

export default function EditCampaignModal({
  isOpen,
  campaign,
  onClose,
  onSuccess,
}: Props) {
  const [causes, setCauses] = useState<CauseOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCauses, setLoadingCauses] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    location: "",
    causeId: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
    status: "PENDING",
    adminApprovalStatus: "PENDING",
    isFeatured: false,
  });

  /* ── Prefill from campaign prop ── */
  useEffect(() => {
    if (!campaign) return;

    // setForm({
    //   title: campaign.title ?? "",
    //   description: campaign.description ?? "",
    //   location: campaign.location ?? "",
    //   causeId: campaign.causeId ? String(campaign.causeId) : "",
    //   goalAmount:
    //     campaign.goalAmount !== undefined && campaign.goalAmount !== null
    //       ? String(campaign.goalAmount)
    //       : "",
    //   startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
    //   endDate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
    //   status: campaign.status ?? "PENDING",
    //   adminApprovalStatus: campaign.adminApprovalStatus ?? "PENDING",
    //   isFeatured: campaign.isFeatured ?? false,
    // });

    setImagePreview(
      campaign.image && typeof campaign.image === "string" && campaign.image.startsWith("http")
        ? campaign.image
        : null
    );
    setImageFile(null);

    // if (Array.isArray(campaign.campaignProducts) && campaign.campaignProducts.length > 0) {
    //   setCart(
    //     campaign.campaignProducts
    //       .filter((p: CampaignProduct) => p.isActive !== false)
    //       .map((p: CampaignProduct) => ({
    //         id: p.id,
    //         productId: Number(p.productId),
    //         name: p.name,
    //         price: Number(p.price),
    //         image: p.image ?? null,
    //         quantity: Number(p.quantity) || 1,
    //       }))
    //   );
    // } else {
    //   setCart([]);
    // }
  }, [campaign]);

  /* ── Load causes ── */
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        setLoadingCauses(true);
        const data = await adminGetCauses();
        setCauses(
          Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        );
      } catch (e) {
        console.error("Failed to load causes:", e);
      } finally {
        setLoadingCauses(false);
      }
    };
    load();
  }, [isOpen]);

  /* ── Load products ── */
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        setLoadingProducts(true);
        const data = await adminGetProducts();
        const list = data?.Products ?? data?.products ?? data?.data ?? [];
        setProducts(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, [isOpen]);

  /* ── Derived ── */
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  /* ── Image ── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview(
      campaign?.image && typeof campaign.image === "string" && campaign.image.startsWith("http")
        ? campaign.image
        : null
    );
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Cart ── */
  const addToCart = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart((c) =>
        c.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((c) => [
        ...c,
        { productId: product.id, name: product.name, price: Number(product.price), image: product.image, quantity: 1 },
      ]);
    }
    setSelectedProductId("");
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((c) =>
      c
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((c) => c.filter((item) => item.productId !== productId));
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!campaign) return;

    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.causeId) { toast.error("Please select a cause"); return; }
    if (!form.startDate) { toast.error("Start date is required"); return; }

    try {
      setLoading(true);

      const formData = new FormData();

      // Basic fields — only append if non-empty (backend ignores undefined fields)
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("location", form.location.trim());
      formData.append("causeId", form.causeId);
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);

      // Admin-only fields
      if (form.status) formData.append("status", form.status);
      if (form.adminApprovalStatus) formData.append("adminApprovalStatus", form.adminApprovalStatus);
      formData.append("isFeatured", String(form.isFeatured));

      // New image file — only when changed
      if (imageFile) formData.append("image", imageFile);

      // Products — backend recalculates goalAmount from these
      // const productPayload = cart.map((item) => ({
      //   productId: Number(item.productId),
      //   quantity: Number(item.quantity),
      // }));
      // formData.append("products", JSON.stringify(productPayload));

      // await adminUpdateCampaign(campaign.id, formData);
      // Products / Money-only campaign
      if (cart.length > 0) {
        // Product-based campaign
        const productPayload = cart.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        }));

        formData.append("products", JSON.stringify(productPayload));
      } else {
        // Money-only campaign
        if (!form.goalAmount || Number(form.goalAmount) <= 0) {
          toast.error("Please enter a valid campaign goal amount");
          setLoading(false);
          return;
        }

        formData.append("goalAmount", form.goalAmount);
      }

      await adminUpdateCampaign(campaign.id, formData);

      toast.success("Campaign updated successfully");

      setTimeout(() => { onSuccess(); onClose(); }, 800);

    } 
    catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update campaign";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Guard ── */
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Campaign</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Campaign #{campaign.id} · Changes are saved immediately
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">

            {/* ── SECTION: Campaign Basics ── */}
            <div className="flex gap-8">
              <SectionHeader
                title="Campaign Basics"
                description="Update your campaign's core information."
              />
              <div className="flex-1 space-y-4">

                {/* Cover image */}
                <Field label="Cover Image" hint="Recommended: 1200×600px · JPG or PNG">
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </button>
                      {imageFile && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 truncate max-w-[160px]">{imageFile.name}</span>
                          <button type="button" onClick={resetImage} className="text-red-400 hover:text-red-600 transition">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </Field>

                {/* Title + Cause */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Title" required>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Campaign title"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Cause" required>
                    <select
                      value={form.causeId}
                      onChange={(e) => setForm({ ...form, causeId: e.target.value })}
                      className={selectCls}
                    >
                      <option value="">
                        {loadingCauses ? "Loading…" : "Select a cause"}
                      </option>
                      {causes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Location */}
                <Field label="Location">
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City, State or Region"
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* ── SECTION: Admin Controls ── */}
            <div className="flex gap-8">
              <SectionHeader
                title="Admin Controls"
                description="Status, approval, and visibility settings. Only admins can change these."
              />
              <div className="flex-1 space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Campaign Status">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className={selectCls}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Admin Approval Status">
                    <select
                      value={form.adminApprovalStatus}
                      onChange={(e) => setForm({ ...form, adminApprovalStatus: e.target.value })}
                      className={selectCls}
                    >
                      {ADMIN_APPROVAL_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Star className={`h-4 w-4 ${form.isFeatured ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Featured Campaign</p>
                      <p className="text-xs text-slate-400">Shown prominently on the platform homepage</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isFeatured ? "bg-amber-500" : "bg-slate-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isFeatured ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* ── SECTION: Timeline ── */}
            <div className="flex gap-8">
              <SectionHeader
                title="Timeline"
                description="Set the campaign start and end dates."
              />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Start Date" required>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="End Date" hint="Optional — leave blank for open-ended">
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* ── SECTION: Products ── */}
            <div className="flex gap-8">
              <SectionHeader
                title="Products"
                description="The goal amount is auto-calculated from selected products."
                icon={<Package className="h-4 w-4" />}
              />
              <div className="flex-1 space-y-4">

                {/* Goal preview */}
                {/* <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Campaign Goal Amount</p>
                    <p className="text-xs text-slate-400 mt-0.5">Auto-calculated from products below</p>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </p>
                </div> */}

                <div className="bg-gray-50 rounded-xl p-4 border">
                  <p className="text-xs text-gray-500 mb-2">
                    Campaign Goal Amount
                  </p>

                  {cart.length > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-[#334E79]">
                        ₹{cartTotal.toLocaleString("en-US")}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Auto calculated from campaign products
                      </p>
                    </>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="0"
                        value={form.goalAmount}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            goalAmount: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="Enter campaign goal amount"
                      />

                      <p className="text-xs text-gray-400 mt-1">
                        Money-only campaign goal
                      </p>
                    </>
                  )}
                </div>

                {/* Product selector */}
                <div className="flex gap-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className={`${selectCls} flex-1`}
                  >
                    <option value="">
                      {loadingProducts ? "Loading products…" : "Select a product to add"}
                    </option>
                    {products
                      .filter((p) => !cart.some((item) => item.productId === p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{Number(p.price).toLocaleString("en-IN")}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={!selectedProductId}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 ${selectedProductId
                      ? "bg-slate-800 hover:bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {/* Cart */}
                {cart.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <Package className="h-6 w-6 text-slate-300 mx-auto mb-1.5" />
                    <p className="text-sm text-slate-400 font-medium">No products added</p>
                    <p className="text-xs text-slate-300 mt-0.5">Select a product above to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-3 shadow-sm"
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          {isValidUrl(item.image ?? undefined) ? (
                            <img
                              src={item.image!}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Name + price */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            ₹{Number(item.price).toLocaleString("en-IN")} each
                          </p>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                          >
                            <Minus className="h-3 w-3 text-slate-600" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                          >
                            <Plus className="h-3 w-3 text-slate-600" />
                          </button>
                        </div>

                        {/* Line total + remove */}
                        <div className="text-right shrink-0 w-24">
                          <p className="text-sm font-bold text-slate-800">
                            ₹{(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-[10px] text-red-400 hover:text-red-600 transition mt-0.5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Cart total row */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3 mt-1">
                      <span className="text-sm font-semibold text-slate-300">
                        Total ({cartItemCount} item{cartItemCount !== 1 ? "s" : ""})
                      </span>
                      <span className="text-base font-extrabold text-white">
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* ── SECTION: Story / Description ── */}
            <div className="flex gap-8">
              <SectionHeader
                title="Story"
                description="The full campaign description shown to donors."
              />
              <div className="flex-1">
                <Field label="Description">
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Tell the story behind this campaign…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl shrink-0">
          <p className="text-xs text-slate-400">
            Goal auto-calculated from {cart.length} product{cart.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
