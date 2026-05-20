"use client";
import { useState, useRef, useEffect } from "react";
import { FiX, FiUpload, FiTrash2, FiPlus, FiMinus, FiPackage } from "react-icons/fi";
import { adminUpdateCampaign, adminGetCauses, adminGetProducts, adminAddCampaignProducts } from "@/features/admin/api/admin.api";
import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
import { isValidUrl } from "@/utils/url";

interface Props {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSuccess: () => void; 
}

interface CauseOption { id: number; name: string; }
interface ProductOption { id: number; name: string; price: number; image: string | null; }

interface CartItem {
  id?: number;
  productId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

export default function EditCampaignModal({ isOpen, campaign, onClose, onSuccess }: Props) {
  const [causes, setCauses] = useState<CauseOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Products state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    // goalAmount: "",
    causeId: "",
    startDate: "",
    endDate: "",
  });

  // Pre-fill form when campaign changes
  useEffect(() => {
    if (!campaign) return;
    setForm({
      title: campaign.title || "",
      description: campaign.description || "",
      location: campaign.location || "",
      // goalAmount: campaign.goalAmount?.toString() || "",
      causeId: campaign.causeId?.toString() || "",
      startDate: campaign.startDate?.split("T")[0] || "",
      endDate: campaign.endDate?.split("T")[0] || "",
    });
    setImagePreview(campaign.image && campaign.image.startsWith("http") ? campaign.image : null);
    setImageFile(null);

    // Load existing products into cart
    if (campaign.campaignProducts && campaign.campaignProducts.length > 0) {
      const existingProducts = campaign.campaignProducts.map((p: CampaignProduct) => ({
        id: p.id,
        productId: p.productId,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity: p.quantity,
      }));
      setCart(existingProducts);
    } else {
      setCart([]);
    }
  }, [campaign]);

  // Load causes
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        const data = await adminGetCauses();
        setCauses(Array.isArray(data) ? data : data?.data || []);
      } catch (err) { console.error("Failed to load causes:", err); }
    };
    load();
  }, [isOpen]);

  // Load products when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await adminGetProducts();
        setProducts(data?.Products || data?.products || []);
      } catch (err) { console.error("Failed to load products:", err); }
      finally { setLoadingProducts(false); }
    };
    loadProducts();
  }, [isOpen]);

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

  // ── Cart Helpers ──────────────────────────────────────────────────────────
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;
    const existing = cart.find((i) => i.productId === product.id);
    if (existing) {
      setCart(cart.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }]);
    }
    setSelectedProductId("");
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(cart
      .map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
      .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  const handleSubmit = async () => {
    if (!campaign) return;
    if (!form.title) { showToast("Title is required", "error"); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      // formData.append("goalAmount", form.goalAmount);
      formData.append("causeId", form.causeId);
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      if (imageFile) formData.append("image", imageFile);

      // Add products to formData
      formData.append("products", JSON.stringify(cart.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
        ...(p.id && { id: p.id }) // Include existing product ID for updates
      }))));

      await adminUpdateCampaign(campaign.id, formData);

      // ADD THIS
      // if (cart.length > 0) {
      //   await adminAddCampaignProducts({
      //     campaignId: campaign.id,
      //     products: cart.map((p) => ({
      //       productId: p.productId,
      //       quantity: p.quantity,
      //     })),
      //   });
      // }
      showToast("✅ Campaign updated!", "success");
      setTimeout(() => { onSuccess(); onClose(); }, 1000);
    } catch (err: any) {
      showToast(err.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update campaign details and products</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <FiX size={18} />
          </button>
        </div>

        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>{toast.msg}</div>
        )}

        <div className="p-6 space-y-8">

          {/* Campaign Basics */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-bold text-gray-800">Campaign Basics</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Update your campaign information.</p>
            </div>
            <div className="flex-1 space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      : <FiUpload size={20} className="text-gray-400" />
                    }
                  </div>
                  <div>
                    <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-[#334E79] text-white text-xs font-semibold rounded-lg hover:bg-[#2a3e60] transition">
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </button>
                    {imageFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 truncate max-w-[160px]">{imageFile.name}</span>
                        <button onClick={() => { setImageFile(null); setImagePreview(campaign.image?.startsWith("http") ? campaign.image : null); }}>
                          <FiTrash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">Recommended: 1200 × 600px · JPG/PNG</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cause <span className="text-red-500">*</span></label>
                  <select value={form.causeId} onChange={(e) => setForm({ ...form, causeId: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition">
                    <option value="">Select a cause</option>
                    {causes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Goals & Timeline */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-bold text-gray-800">Goals & Timeline</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Update fundraising goals and schedule.</p>
            </div>
            <div className="flex-1 space-y-4">
              {/* <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Target Amount (₹) <span className="text-red-500">*</span></label>
                <input type="number" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
              </div> */}

              <div className="bg-gray-50 rounded-xl p-4 border">
                <p className="text-xs text-gray-500 mb-1">
                  Campaign Goal Amount
                </p>

                <p className="text-2xl font-bold text-[#334E79]">
                  ₹{cartTotal.toLocaleString("en-US")}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Auto calculated from products
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Products Section */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <div className="flex items-center gap-2">
                <FiPackage size={16} className="text-gray-500" />
                <h3 className="text-sm font-bold text-gray-800">Products</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Manage products needed for this campaign.</p>
            </div>
            <div className="flex-1 space-y-4">

              {/* Add Product */}
              <div className="flex gap-2">
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 text-gray-700 transition">
                  <option value="">
                    {loadingProducts ? "Loading products..." : "Select a product to add"}
                  </option>
                  {products
                    .filter((p) => !cart.find((c) => c.productId === p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price.toLocaleString("en-US")}
                      </option>
                    ))
                  }
                </select>
                <button onClick={addToCart} disabled={!selectedProductId}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shrink-0 ${selectedProductId ? "bg-[#334E79] text-white hover:bg-[#2a3e60]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}>
                  <FiPlus size={14} /> Add
                </button>
              </div>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-400 border-2 border-dashed border-gray-200">
                  No products added. Select from the dropdown above.
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {isValidUrl(item.image)
                          ? <img src={item.image || "/assets/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[8px] text-gray-400">No img</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">₹{item.price.toLocaleString("en-US")} each</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => updateQty(item.productId, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <div className="text-right shrink-0 w-20">
                        <p className="text-sm font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toLocaleString("en-US")}
                        </p>
                        <button onClick={() => removeFromCart(item.productId)}
                          className="text-[10px] text-red-400 hover:text-red-600 transition">Remove</button>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between bg-[#334E79]/5 border border-[#334E79]/20 rounded-xl px-4 py-3 mt-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span className="text-base font-bold text-[#334E79]">
                      ₹{cartTotal.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Description */}
          <div className="flex gap-8">
            <div className="w-48 shrink-0">
              <h3 className="text-sm font-bold text-gray-800">Story</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Update the campaign description.</p>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none transition" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#334E79] hover:bg-[#2a3e60] text-white"
              }`}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}