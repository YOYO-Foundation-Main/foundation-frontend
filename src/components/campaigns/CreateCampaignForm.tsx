"use client";
import { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiTrash2, FiCheck, FiChevronRight, FiPlus, FiMinus } from "react-icons/fi";
import {
  startCampaignDraft,
  updateCampaignDraftDetails,
  updateCampaignDraftBeneficiary,
  addCampaignProducts,
  submitCampaignDraft,
} from "@/features/campaigns/api/userCampaign.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { isValidUrl } from "@/utils/url";
import { useRouter } from "next/navigation";
// interface Props { isOpen: boolean; onClose: () => void; }
interface CauseOption { id: number; name: string; }
interface Product { id: number; name: string; price: number; description: string; image: string | null; }
interface CartItem { product: Product; quantity: number; }

const STEPS = [
  { id: 1, label: "Your Info" },
  { id: 2, label: "Campaign" },
  { id: 3, label: "Beneficiary" },
  { id: 4, label: "Products" },
  { id: 5, label: "Review" },
];

// function isValidUrl(url: string | null | undefined): boolean {
//   if (!url) return false;
//   try { new URL(url); return true; } catch { return false; }
// }

export default function CreateCampaignForm() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  // Data
  const [causes, setCauses] = useState<CauseOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Step 1
  const [step1, setStep1] = useState({ name: "", email: "", mobile: "", causeId: "" });

  // Step 2
  const [step2, setStep2] = useState({ title: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 3
  const [step3, setStep3] = useState({
    beneficiaryName: "", beneficiaryRelation: "",
    beneficiaryMobile: "", beneficiaryCity: "", beneficiaryState: "",
  });

  // Step 4 — cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      setStep1((p) => ({ ...p, name: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  // Load causes
  useEffect(() => {
    const loadCauses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cause`);
        const data = await res.json();
        setCauses(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error("Failed to load causes", err);
      }
    };

    loadCauses();
  }, []);

  // Load products when reaching step 4
  useEffect(() => {
    if (step !== 4 || products.length > 0) return;
    const load = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
        const data = await res.json();
        // Response: { success: true, Products: [...] }
        setProducts(data?.Products || data?.products || []);
      } catch { /* no products ok */ }
      finally { setLoadingProducts(false); }
    };
    load();
  }, [step]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const reset = () => {
    setStep(1); setDraftId(null); setSubmitted(false);
    setStep1({ name: "", email: "", mobile: "", causeId: "" });
    setStep2({ title: "", description: "" });
    setStep3({ beneficiaryName: "", beneficiaryRelation: "", beneficiaryMobile: "", beneficiaryCity: "", beneficiaryState: "" });
    setCart([]); setSelectedProductId("");
    setImageFile(null); setImagePreview(null);
  };

  const handleClose = () => {
    reset(); // optional
    router.push("/");
  };
  // ── Cart helpers ──────────────────────────────────────────────────────────
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      setCart(cart.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setSelectedProductId("");
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(cart
      .map((i) => i.product.id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
      .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((i) => i.product.id !== productId));
  };

  // ── Step handlers ─────────────────────────────────────────────────────────
  const handleStep1 = async () => {
    if (!step1.name) { showToast("Name is required", "error"); return; }
    if (!step1.email) { showToast("Email is required", "error"); return; }
    if (!step1.mobile || step1.mobile.length < 10) { showToast("Valid 10-digit mobile required", "error"); return; }
    if (!step1.causeId) { showToast("Please select a cause", "error"); return; }
    try {
      setLoading(true);
      const result = await startCampaignDraft({
        name: step1.name, email: step1.email,
        mobile: step1.mobile, causeId: Number(step1.causeId),
      });
      const id = result?.id || result?.draftId;
      if (!id) throw new Error("No draft ID returned");
      setDraftId(id);
      setStep(2);
    } catch (err: any) {
      showToast(err.message || "Failed to start draft", "error");
    } finally { setLoading(false); }
  };

  const handleStep2 = async () => {
    if (!step2.title) { showToast("Title is required", "error"); return; }
    if (!draftId) { showToast("Draft ID missing, please restart", "error"); return; }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", step2.title);
      fd.append("description", step2.description);
      if (imageFile) fd.append("image", imageFile);
      await updateCampaignDraftDetails(draftId, fd);
      setStep(3);
    } catch (err: any) {
      showToast(err.message || "Failed to save campaign details", "error");
    } finally { setLoading(false); }
  };

  const handleStep3 = async () => {
    if (!step3.beneficiaryName) { showToast("Beneficiary name is required", "error"); return; }
    if (!step3.beneficiaryRelation) { showToast("Relation is required", "error"); return; }
    if (!step3.beneficiaryMobile) { showToast("Beneficiary mobile is required", "error"); return; }
    if (!draftId) return;
    try {
      setLoading(true);
      await updateCampaignDraftBeneficiary(draftId, step3);
      setStep(4);
    } catch (err: any) {
      showToast(err.message || "Failed to save beneficiary", "error");
    } finally { setLoading(false); }
  };

  const handleStep4 = async () => {
    if (cart.length === 0) { showToast("Please add at least one product", "error"); return; }
    if (!draftId) return;
    try {
      setLoading(true);
      await addCampaignProducts(
        draftId,
        cart.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      );
      setStep(5);
    } catch (err: any) {
      showToast(err.message || "Failed to add products", "error");
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!draftId) return;
    try {
      setLoading(true);
      await submitCampaignDraft(draftId);
      setSubmitted(true);
    } catch (err: any) {
      showToast(err.message || "Failed to submit campaign", "error");
    } finally { setLoading(false); }
  };

  const handleNext = () => {
    if (step === 1) handleStep1();
    else if (step === 2) handleStep2();
    else if (step === 3) handleStep3();
    else if (step === 4) handleStep4();
  };



  const selectedCause = causes.find((c) => c.id === Number(step1.causeId));

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <FiCheck size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Campaign Submitted!</h2>
          <p className="text-gray-500 text-sm mb-2 leading-relaxed">
            Your campaign is under admin review. You'll be notified once it goes live.
          </p>
          {cart.length > 0 && (
            <p className="text-xs text-gray-400 mb-6">
              Products requested: {cart.length} item{cart.length > 1 ? "s" : ""} · Total ₹{cartTotal.toLocaleString("en-US")}
            </p>
          )}
          <button onClick={handleClose}
            className="w-full bg-[#D2252B] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">Start a Campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Step {step} of {STEPS.length} — {STEPS[step - 1].label}
            </p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
            <FiX size={18} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition ${step > s.id ? "bg-green-500 text-white"
                  : step === s.id ? "bg-[#D2252B] text-white"
                    : "bg-gray-200 text-gray-400"
                  }`}>
                  {step > s.id ? <FiCheck size={10} /> : s.id}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block whitespace-nowrap ${step === s.id ? "text-gray-800" : "text-gray-400"
                  }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 rounded ${step > s.id ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast.msg && (
          <div className={`mx-6 mt-3 px-4 py-2 rounded-xl text-sm text-center font-medium shrink-0 ${toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>{toast.msg}</div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP 1: Your Info ── */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Your full name" value={step1.name}
                  onChange={(e) => setStep1({ ...step1, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" placeholder="your@email.com" value={step1.email}
                  onChange={(e) => setStep1({ ...step1, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mobile <span className="text-red-500">*</span></label>
                <input type="tel" placeholder="10-digit mobile number" maxLength={10} value={step1.mobile}
                  onChange={(e) => setStep1({ ...step1, mobile: e.target.value.replace(/\D/g, "") })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cause <span className="text-red-500">*</span></label>
                <select value={step1.causeId} onChange={(e) => setStep1({ ...step1, causeId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] text-gray-700 transition">
                  <option value="">Select a cause</option>
                  {causes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2: Campaign Details ── */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Campaign Title <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Help children get food support" value={step2.title}
                  onChange={(e) => setStep2({ ...step2, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea rows={4} placeholder="Tell your story. Why this campaign? How will it help?" value={step2.description}
                  onChange={(e) => setStep2({ ...step2, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] resize-none transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  <div onClick={() => fileRef.current?.click()}
                    className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-200 shrink-0">
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      : <><FiUpload size={16} className="text-gray-400" /><span className="text-[9px] text-gray-400">Upload</span></>
                    }
                  </div>
                  <div>
                    <button onClick={() => fileRef.current?.click()}
                      className="px-3 py-1.5 bg-[#D2252B] text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition">
                      {imagePreview ? "Change" : "Upload Image"}
                    </button>
                    {imageFile && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">{imageFile.name}</span>
                        <button onClick={() => { setImageFile(null); setImagePreview(null); }}>
                          <FiTrash2 size={11} className="text-red-400" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG/PNG recommended</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                      }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Beneficiary ── */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                Who will directly benefit from this campaign?
              </p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Beneficiary Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Ramesh Patel" value={step3.beneficiaryName}
                  onChange={(e) => setStep3({ ...step3, beneficiaryName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Relation / Role <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. NGO Head, Patient, Student" value={step3.beneficiaryRelation}
                  onChange={(e) => setStep3({ ...step3, beneficiaryRelation: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mobile <span className="text-red-500">*</span></label>
                <input type="tel" placeholder="10-digit mobile" maxLength={10} value={step3.beneficiaryMobile}
                  onChange={(e) => setStep3({ ...step3, beneficiaryMobile: e.target.value.replace(/\D/g, "") })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <input type="text" placeholder="e.g. Ahmedabad" value={step3.beneficiaryCity}
                    onChange={(e) => setStep3({ ...step3, beneficiaryCity: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label>
                  <input type="text" placeholder="e.g. Gujarat" value={step3.beneficiaryState}
                    onChange={(e) => setStep3({ ...step3, beneficiaryState: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] transition" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Products ── */}
          {step === 4 && (
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500">Select products needed for this campaign and set quantities.</p>

              {/* Product selection grid with images */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Available Products</label>

                {loadingProducts ? (
                  <div className="text-center py-8 text-gray-400">Loading products...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                    {products
                      .filter((p) => !cart.find((c) => c.product.id === p.id))
                      .map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedProductId(String(product.id));
                            // Auto-add to cart when clicked
                            const existing = cart.find((i) => i.product.id === product.id);
                            if (existing) {
                              setCart(cart.map((i) =>
                                i.product.id === product.id
                                  ? { ...i, quantity: i.quantity + 1 }
                                  : i
                              ));
                            } else {
                              setCart([...cart, { product, quantity: 1 }]);
                            }
                            setSelectedProductId("");
                          }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:border-[#D2252B] hover:bg-red-50 transition group"
                        >
                          {/* Product Image */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                            {isValidUrl(product.image) ? (
                              <img
                                src={product.image || "/assets/placeholder.png"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                <span className="text-[10px] text-gray-500">No img</span>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs font-bold text-[#D2252B]">₹{product.price.toLocaleString("en-US")}</p>
                          </div>

                          {/* Add button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const existing = cart.find((i) => i.product.id === product.id);
                              if (existing) {
                                setCart(cart.map((i) =>
                                  i.product.id === product.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                                ));
                              } else {
                                setCart([...cart, { product, quantity: 1 }]);
                              }
                            }}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#D2252B] hover:text-white hover:border-[#D2252B] transition shrink-0"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                {!loadingProducts && products.filter((p) => !cart.find((c) => c.product.id === p.id)).length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed">
                    {cart.length > 0 ? "All products added to cart ✓" : "No products available"}
                  </div>
                )}
              </div>

              {/* Cart items */}
              {cart.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-400 border-2 border-dashed border-gray-200">
                  No products added yet. Click on any product above to add.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-600">Your Cart ({cart.length} items)</label>
                    <button
                      onClick={() => setCart([])}
                      className="text-[10px] text-red-400 hover:text-red-600 transition"
                    >
                      Clear all
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div key={item.product.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">

                      {/* Product image */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {isValidUrl(item.product.image)
                          ? <img src={item.product.image || "/assets/placeholder.png"} alt={item.product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">₹{item.product.price.toLocaleString("en-US")} each</p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => updateQty(item.product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                          <FiPlus size={12} />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right shrink-0 w-20">
                        <p className="text-sm font-bold text-gray-800">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-US")}
                        </p>
                        <button onClick={() => removeFromCart(item.product.id)}
                          className="text-[10px] text-red-400 hover:text-red-600 transition">Remove</button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex items-center justify-between bg-[#D2252B]/5 border border-[#D2252B]/20 rounded-xl px-4 py-3 mt-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span className="text-base font-bold text-[#D2252B]">
                      ₹{cartTotal.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 5: Review ── */}
          {step === 5 && (
            <div className="p-6 space-y-3">
              <p className="text-xs text-gray-400">Review everything before submitting.</p>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Your Info</p>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span className="text-gray-500">Name</span><span className="font-medium text-gray-800">{step1.name}</span>
                  <span className="text-gray-500">Email</span><span className="font-medium text-gray-800 truncate">{step1.email}</span>
                  <span className="text-gray-500">Mobile</span><span className="font-medium text-gray-800">{step1.mobile}</span>
                  <span className="text-gray-500">Cause</span><span className="font-medium text-gray-800">{selectedCause?.name || "—"}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Campaign</p>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2"><span className="text-gray-500 shrink-0">Title</span><span className="font-medium text-gray-800">{step2.title}</span></div>
                  {step2.description && <div className="flex gap-2"><span className="text-gray-500 shrink-0">Desc</span><span className="text-gray-700 line-clamp-2">{step2.description}</span></div>}
                  {imageFile && <div className="flex gap-2"><span className="text-gray-500 shrink-0">Image</span><span className="font-medium text-gray-800 truncate">{imageFile.name}</span></div>}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Beneficiary</p>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span className="text-gray-500">Name</span><span className="font-medium text-gray-800">{step3.beneficiaryName}</span>
                  <span className="text-gray-500">Role</span><span className="font-medium text-gray-800">{step3.beneficiaryRelation}</span>
                  <span className="text-gray-500">Mobile</span><span className="font-medium text-gray-800">{step3.beneficiaryMobile}</span>
                  <span className="text-gray-500">Location</span><span className="font-medium text-gray-800">{[step3.beneficiaryCity, step3.beneficiaryState].filter(Boolean).join(", ") || "—"}</span>
                </div>
              </div>

              {cart.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Products ({cart.length} item{cart.length > 1 ? "s" : ""})
                  </p>
                  <div className="space-y-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                        <span className="font-medium text-gray-800">₹{(item.product.price * item.quantity).toLocaleString("en-US")}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold text-[#D2252B] pt-1 border-t border-gray-200 mt-1">
                      <span>Total</span>
                      <span>₹{cartTotal.toLocaleString("en-US")}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                📋 Your campaign will be reviewed by our admin team before going live.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} disabled={loading}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-white transition">
              ← Back
            </button>
          ) : (
            <button onClick={handleClose} className="px-4 py-2 text-sm text-gray-500 font-medium transition">Cancel</button>
          )}

          {step < 5 ? (
            <button onClick={handleNext} disabled={loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition ${loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#D2252B] hover:bg-red-700 text-white"
                }`}>
              {loading ? "Please wait..." : "Continue"}
              {!loading && <FiChevronRight size={15} />}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#D2252B] hover:bg-red-700 text-white"
                }`}>
              {loading ? "Submitting..." : "🚀 Submit Campaign"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}