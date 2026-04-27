// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//     donate,
//     createOrder,
//     verifyPayment,
// } from "@/features/donations/api/donation.api";

// import { loadRazorpay } from "@/utils/loadRazorpay";
// import Image from "next/image";
// export default function CheckoutPage() {
//     const [donationData, setDonationData] = useState<any>(null);

//     const [form, setForm] = useState({
//         donorName: "",
//         donorEmail: "",
//         donorMobile: "",
//         isAnonymous: false,
//     });

//     const [loading, setLoading] = useState(false);
//     const router = useRouter();
//     useEffect(() => {
//         const data = localStorage.getItem("donationData");

//         if (data) {
//             const parsed = JSON.parse(data);

//             // ✅ ensure products always exists
//             setDonationData({
//                 ...parsed,
//                 products: parsed.products || [],
//             });
//         }
//     }, []);

//     if (!donationData) return <div className="p-10">Loading...</div>;
//     // const [loading, setLoading] = useState(false);

//     const handleDonate = async () => {

//         // ✅ VALIDATION HERE
//         if (!form.donorName || !form.donorEmail || !form.donorMobile) {
//             alert("Please fill all details");
//             return;
//         }

//         try {
//             console.log("🚀 Donate Clicked");

//             // =========================
//             // 1. CREATE PAYLOAD
//             // =========================
//             const payload: any = {
//                 campaignId: donationData?.campaignId,
//                 donorName: form.isAnonymous ? "Anonymous" : form.donorName,
//                  donorEmail: form.donorEmail,
//                 donorMobile: form.donorMobile,
//                 isAnonymous: form.isAnonymous,
//             };

//             if (donationData?.mode === "products") {
//                 payload.items = donationData?.selectedProductDetails?.map((p: any) => ({
//                     campaignProductId: p.campaignProductId,
//                     quantity: p.quantity,
//                 }));
//             }

//             if (donationData?.mode === "money") {
//                 payload.amount = donationData?.donationAmount;
//             }

//             console.log("📦 PAYLOAD:", payload);

//             // =========================
//             // 2. CREATE DONATION
//             // =========================
//             const donationRes = await donate(payload);
//             console.log("✅ FULL DONATION RESPONSE:", JSON.stringify(donationRes, null, 2));
//             const donationId = donationRes?.data?.id;
//             console.log("🎯 donationId:", donationId);
//             if (!donationId) {
//                 console.error("❌ donationId missing");
//                 return alert("Donation creation failed");
//             }

//             // =========================
//             // 3. CREATE ORDER
//             // =========================
//             const orderRes = await createOrder(donationId);
//             console.log("💳 ORDER RESPONSE:", orderRes);

//             const order = orderRes?.order;
//             const key = orderRes?.key;

//             if (!order?.id) {
//                 console.error("❌ Order ID missing");
//                 return alert("Order creation failed");
//             }

//             // =========================
//             // 4. LOAD RAZORPAY
//             // =========================
//             const isLoaded = await loadRazorpay();
//             console.log("📜 Razorpay Loaded:", isLoaded);

//             if (!isLoaded) {
//                 return alert("Razorpay SDK failed to load");
//             }

//             console.log("🧠 Razorpay Object:", (window as any).Razorpay);

//             // =========================
//             // 5. OPEN RAZORPAY
//             // =========================
//             const options: any = {
//                 key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY,
//                 amount: order.amount,
//                 currency: order.currency,
//                 name: "Donation",
//                 description: "Support Campaign",
//                 order_id: order.id,

//                 handler: async function (response: any) {
//                     console.log("🎉 PAYMENT SUCCESS:", response);

//                     try {
//                         const verifyRes = await verifyPayment({
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                             donationId: donationId, // 🔥 THIS IS THE FIX
//                         });

//                         console.log("✅ VERIFY RESPONSE:", verifyRes);

//                         localStorage.removeItem("donationData");

//                         router.push(`/Donate/success?donationId=${donationId}`);

//                     } catch (err) {
//                         console.error("❌ VERIFY ERROR:", err);
//                         alert("Verification failed");
//                     }
//                 },

//                 modal: {
//                     ondismiss: function () {
//                         alert("Payment was cancelled");
//                     }
//                 },

//                 prefill: {
//                     name: payload.donorName,
//                     email: payload.donorEmail,
//                     contact: payload.donorMobile,
//                 },

//                 theme: {
//                     color: "#D2252B",
//                 },
//             };

//             console.log("⚡ Opening Razorpay...");

//             const rzp = new (window as any).Razorpay(options);
//             rzp.open();

//         } catch (err) {
//             console.error("🔥 FINAL ERROR:", err);
//             alert("Something went wrong");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#F5F5F5] pt-[100px] px-6">

//             <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

//                 {/* ================= LEFT: SUMMARY ================= */}
//                 <div className="bg-white rounded-2xl p-6 shadow">

//                     <h2 className="text-xl font-bold mb-5">Donation Summary</h2>

//                     {/* ================= PRODUCTS ================= */}
//                     {donationData.mode === "products" && (
//                         <div className="space-y-4">


//                             {(donationData.selectedProductDetails || []).length === 0 ? (
//                                 <p className="text-gray-500 text-sm">No products selected</p>
//                             ) : (
//                                 donationData.selectedProductDetails?.map((p: any) => (
//                                     <div
//                                         key={p.campaignProductId}
//                                         className="flex items-center gap-4 border-b pb-3"
//                                     >
//                                         <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-100">
//                                             <Image
//                                                 src={
//                                                     p?.image && p.image.startsWith("http")
//                                                         ? p.image
//                                                         : "/assets/placeholder.png"
//                                                 }
//                                                 alt={p?.name || "product"}
//                                                 fill
//                                                 className="object-cover"
//                                             />
//                                         </div>
//                                         <div className="flex-1">
//                                             <p className="text-sm font-semibold">{p.name}</p>
//                                             <p className="text-xs text-gray-500">
//                                                 ₹{p.price} × {p.quantity}
//                                             </p>
//                                         </div>

//                                         <div className="text-sm font-semibold">
//                                             ₹{p.price * p.quantity}
//                                         </div>
//                                     </div>
//                                 ))
//                             )}

//                             {/* TOTAL */}
//                             <div className="flex justify-between font-bold pt-3 border-t">
//                                 <span>Total</span>
//                                 <span>
//                                     ₹{donationData.selectedProductDetails?.reduce(
//                                         (sum: number, p: any) => sum + p.price * p.quantity,
//                                         0
//                                     )}
//                                 </span>
//                             </div>
//                         </div>
//                     )}

//                     {/* ================= MONEY ================= */}
//                     {donationData.mode === "money" && (
//                         <div className="text-2xl font-bold text-[#D2252B]">
//                             ₹{donationData.donationAmount}
//                         </div>
//                     )}
//                 </div>

//                 {/* ================= RIGHT: FORM ================= */}
//                 <div className="bg-white rounded-2xl p-6 shadow">

//                     <h2 className="text-xl font-bold mb-4">
//                         Enter your details
//                     </h2>

//                     <div className="space-y-4">

//                         <input
//                             placeholder="Name"
//                             className="w-full border p-3 rounded-lg"
//                             onChange={(e) =>
//                                 setForm({ ...form, donorName: e.target.value })
//                             }
//                         />

//                         <input
//                             placeholder="Email"
//                             className="w-full border p-3 rounded-lg"
//                             onChange={(e) =>
//                                 setForm({ ...form, donorEmail: e.target.value })
//                             }
//                         />

//                         <input
//                             placeholder="Mobile"
//                             className="w-full border p-3 rounded-lg"
//                             onChange={(e) =>
//                                 setForm({ ...form, donorMobile: e.target.value })
//                             }
//                         />

//                         <label className="flex items-center gap-2 text-sm">
//                             <input
//                                 type="checkbox"
//                                 onChange={(e) =>
//                                     setForm({ ...form, isAnonymous: e.target.checked })
//                                 }
//                             />
//                             Donate anonymously
//                         </label>

//                         <button
//                             onClick={handleDonate}
//                             disabled={loading}
//                             className="w-full bg-[#D2252B] text-white py-3 rounded-lg font-bold"
//                         >
//                             {loading ? "Processing..." : "CONTINUE TO PAY"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


//new ui 

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   donate,
//   createOrder,
//   verifyPayment,
// } from "@/features/donations/api/donation.api";

// import { loadRazorpay } from "@/utils/loadRazorpay";
// import Image from "next/image";

// export default function CheckoutPage() {
//   const [donationData, setDonationData] = useState<any>(null);

//   const [form, setForm] = useState({
//     donorName: "",
//     donorEmail: "",
//     donorMobile: "",
//     isAnonymous: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const data = localStorage.getItem("donationData");

//     if (data) {
//       const parsed = JSON.parse(data);
//       setDonationData({
//         ...parsed,
//         products: parsed.products || [],
//       });
//     }
//   }, []);

//   if (!donationData) return <div className="p-10">Loading...</div>;

//   // ✅ MOBILE VALIDATION (ONLY 10 DIGITS)
//   const handleMobileChange = (value: string) => {
//     const cleaned = value.replace(/\D/g, ""); // only numbers
//     if (cleaned.length <= 10) {
//       setForm({ ...form, donorMobile: cleaned });
//     }
//   };

//   const handleDonate = async () => {
//     if (!form.donorName || !form.donorEmail || !form.donorMobile) {
//       alert("Please fill all details");
//       return;
//     }

//     if (form.donorMobile.length !== 10) {
//       alert("Mobile number must be 10 digits");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload: any = {
//         campaignId: donationData?.campaignId,
//         donorName: form.isAnonymous ? "Anonymous" : form.donorName,
//         donorEmail: form.donorEmail,
//         donorMobile: form.donorMobile,
//         isAnonymous: form.isAnonymous,
//       };

//       if (donationData?.mode === "products") {
//         payload.items = donationData?.selectedProductDetails?.map((p: any) => ({
//           campaignProductId: p.campaignProductId,
//           quantity: p.quantity,
//         }));
//       }

//       if (donationData?.mode === "money") {
//         payload.amount = donationData?.donationAmount;
//       }

//       const donationRes = await donate(payload);
//       const donationId = donationRes?.data?.id;

//       if (!donationId) return alert("Donation creation failed");

//       const orderRes = await createOrder(donationId);
//       const order = orderRes?.order;
//       const key = orderRes?.key;

//       const isLoaded = await loadRazorpay();
//       if (!isLoaded) return alert("Razorpay failed to load");

//       const options: any = {
//         key: key,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Donation",
//         description: "Support Campaign",
//         order_id: order.id,

//         handler: async function (response: any) {
//           await verifyPayment({
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             donationId,
//           });

//           localStorage.removeItem("donationData");
//           router.push(`/Donate/success?donationId=${donationId}`);
//         },

//         prefill: {
//           name: payload.donorName,
//           email: payload.donorEmail,
//           contact: payload.donorMobile,
//         },

//         theme: { color: "#E11D48" },
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[100px] px-4 md:px-6">

//       <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

//         {/* ───── LEFT: SUMMARY ───── */}
//         <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg border">

//           <h2 className="text-lg font-bold mb-5 text-gray-800">
//             Donation Summary
//           </h2>

//           {donationData.mode === "products" && (
//             <div className="space-y-4">

//               {donationData.selectedProductDetails?.map((p: any) => (
//                 <div
//                   key={p.campaignProductId}
//                   className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
//                 >
//                   <div className="w-14 h-14 relative rounded-lg overflow-hidden">
//                     <Image
//                       src={p.image}
//                       alt={p.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <p className="text-sm font-semibold">{p.name}</p>
//                     <p className="text-xs text-gray-500">
//                       ₹{p.price} × {p.quantity}
//                     </p>
//                   </div>

//                   <div className="font-bold text-gray-800">
//                     ₹{p.price * p.quantity}
//                   </div>
//                 </div>
//               ))}

//               <div className="flex justify-between font-bold pt-4 border-t text-lg">
//                 <span>Total</span>
//                 <span className="text-rose-500">
//                   ₹
//                   {donationData.selectedProductDetails.reduce(
//                     (sum: number, p: any) =>
//                       sum + p.price * p.quantity,
//                     0
//                   )}
//                 </span>
//               </div>
//             </div>
//           )}

//           {donationData.mode === "money" && (
//             <div className="text-3xl font-extrabold text-rose-500">
//               ₹{donationData.donationAmount}
//             </div>
//           )}
//         </div>

//         {/* ───── RIGHT: FORM ───── */}
//         <div className="bg-white rounded-3xl p-6 shadow-lg border">

//           <h2 className="text-lg font-bold mb-5 text-gray-800">
//             Your Details
//           </h2>

//           <div className="space-y-4">

//             {/* NAME */}
//             <input
//               placeholder="Full Name"
//               className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
//               onChange={(e) =>
//                 setForm({ ...form, donorName: e.target.value })
//               }
//             />

//             {/* EMAIL */}
//             <input
//               type="email"
//               placeholder="Email Address"
//               className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
//               onChange={(e) =>
//                 setForm({ ...form, donorEmail: e.target.value })
//               }
//             />

//             {/* MOBILE */}
//             <input
//               placeholder="Mobile Number"
//               value={form.donorMobile}
//               className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
//               onChange={(e) => handleMobileChange(e.target.value)}
//             />

//             <p className="text-xs text-gray-400">
//               Only 10 digit mobile number allowed
//             </p>

//             {/* ANONYMOUS */}
//             <label className="flex items-center gap-2 text-sm text-gray-600">
//               <input
//                 type="checkbox"
//                 onChange={(e) =>
//                   setForm({ ...form, isAnonymous: e.target.checked })
//                 }
//               />
//               Donate anonymously
//             </label>

//             {/* BUTTON */}
//             <button
//               onClick={handleDonate}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold shadow hover:opacity-90 transition disabled:opacity-50"
//             >
//               {loading ? "Processing..." : "Proceed to Payment"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  donate,
  createOrder,
  verifyPayment,
} from "@/features/donations/api/donation.api";
import { loadRazorpay } from "@/utils/loadRazorpay";
import Image from "next/image";
import {
  FiUser, FiMail, FiPhone, FiShield, FiHeart,
  FiLock, FiCheckCircle, FiPackage,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdVolunteerActivism } from "react-icons/md";

export default function CheckoutPage() {
  const [donationData, setDonationData] = useState<any>(null);
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorMobile: "",
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("donationData");
    if (data) {
      const parsed = JSON.parse(data);
      setDonationData({ ...parsed, products: parsed.products || [] });
    }
  }, []);

  if (!donationData)
    return (
      <div className="min-h-screen bg-rose-50/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#D2252B]/20 border-t-[#D2252B] animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Preparing checkout…</p>
        </div>
      </div>
    );

  // ── same logic as original ──
  const handleMobileChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) setForm({ ...form, donorMobile: cleaned });
  };

  const handleDonate = async () => {
    if (!form.donorName || !form.donorEmail || !form.donorMobile) {
      alert("Please fill all details");
      return;
    }
    if (form.donorMobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }
    try {
      setLoading(true);
      const payload: any = {
        campaignId: donationData?.campaignId,
        donorName: form.isAnonymous ? "Anonymous" : form.donorName,
        donorEmail: form.donorEmail,
        donorMobile: form.donorMobile,
        isAnonymous: form.isAnonymous,
      };
      if (donationData?.mode === "products") {
        payload.items = donationData?.selectedProductDetails?.map((p: any) => ({
          campaignProductId: p.campaignProductId,
          quantity: p.quantity,
        }));
      }
      if (donationData?.mode === "money") {
        payload.amount = donationData?.donationAmount;
      }
      const donationRes = await donate(payload);
      const donationId = donationRes?.data?.id;
      if (!donationId) return alert("Donation creation failed");
      const orderRes = await createOrder(donationId);
      const order = orderRes?.order;
      const key = orderRes?.key;
      const isLoaded = await loadRazorpay();
      if (!isLoaded) return alert("Razorpay failed to load");
      const options: any = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Donation",
        description: "Support Campaign",
        order_id: order.id,
        handler: async function (response: any) {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donationId,
          });
          localStorage.removeItem("donationData");
          router.push(`/Donate/success?donationId=${donationId}`);
        },
        prefill: {
          name: payload.donorName,
          email: payload.donorEmail,
          contact: payload.donorMobile,
        },
        theme: { color: "#D2252B" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount =
    donationData.mode === "products"
      ? donationData.selectedProductDetails?.reduce(
          (sum: number, p: any) => sum + p.price * p.quantity,
          0
        )
      : donationData.donationAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50/30 pt-24 pb-16 px-4 md:px-6">

      {/* ── Page header ── */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-[#D2252B] text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <FiShield size={11} />
          Secure Checkout · 256-bit SSL Encrypted
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
          Complete Your Donation
        </h1>
        <p className="text-sm text-gray-400 mt-1.5">
          Review your contribution and enter your details to proceed
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_460px] gap-6 items-start">

        {/* ═══════════════════════════════════════
            LEFT — DONATION SUMMARY
        ════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="bg-gradient-to-r from-[#D2252B] to-[#a01c21] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <MdVolunteerActivism size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">
                  Donation Summary
                </p>
                <p className="text-white text-sm font-bold leading-tight mt-0.5">
                  {donationData.mode === "products"
                    ? `${donationData.selectedProductDetails?.length ?? 0} item${(donationData.selectedProductDetails?.length ?? 0) !== 1 ? "s" : ""} selected`
                    : "Money Donation"}
                </p>
              </div>
            </div>
            {/* Total pill */}
            <div className="bg-white/20 border border-white/30 rounded-2xl px-4 py-2 text-right">
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">Total</p>
              <p className="text-white text-lg font-extrabold leading-tight">
                ₹{totalAmount?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* ── Products mode ── */}
          {donationData.mode === "products" && (
            <div className="p-5 space-y-3">
              {donationData.selectedProductDetails?.map((p: any) => (
                <div
                  key={p.campaignProductId}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-rose-100 hover:bg-rose-50/40 transition-all duration-200"
                >
                  <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-white shadow-sm">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-gray-400">₹{p.price?.toLocaleString("en-IN")}</span>
                      <span className="text-gray-300 text-xs">×</span>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded-md">
                        {p.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-extrabold text-gray-900">
                      ₹{(p.price * p.quantity)?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total row */}
              <div className="border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiPackage size={14} />
                  <span className="text-sm font-semibold">
                    {donationData.selectedProductDetails?.length} items
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-400 font-medium">Total:</span>
                  <span className="text-xl font-extrabold text-[#D2252B]">
                    ₹{totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Money mode ── */}
          {donationData.mode === "money" && (
            <div className="p-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center">
                <HiOutlineCurrencyRupee size={38} className="text-[#D2252B]" />
              </div>
              <div>
                <p className="text-4xl font-extrabold text-gray-900">
                  ₹{Number(donationData.donationAmount)?.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-400 mt-1.5 font-medium">
                  Your generous cash contribution
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full font-semibold">
                <FiCheckCircle size={12} />
                100% goes to the campaign
              </div>
            </div>
          )}

          {/* Trust strip */}
          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3.5 flex items-center justify-center gap-6">
            {[
              { icon: <FiShield size={12} />, label: "Secure Payment" },
              { icon: <FiLock size={12} />, label: "Data Protected" },
              { icon: <FiHeart size={12} />, label: "Verified Cause" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            RIGHT — DONOR DETAILS FORM
        ════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <FiUser size={15} className="text-[#D2252B]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Your Details</h2>
                <p className="text-xs text-gray-400 font-medium">Used for your donation receipt</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  placeholder="Enter your full name"
                  value={form.donorName}
                  className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D2252B] focus:ring-4 focus:ring-[#D2252B]/8 bg-gray-50 focus:bg-white transition-all"
                  onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.donorEmail}
                  className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D2252B] focus:ring-4 focus:ring-[#D2252B]/8 bg-gray-50 focus:bg-white transition-all"
                  onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                Mobile Number
              </label>
              <div className="relative">
                <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 border-r border-gray-200 pr-2.5 leading-none pointer-events-none select-none">
                  +91
                </span>
                <input
                  placeholder="10-digit number"
                  value={form.donorMobile}
                  className="w-full border border-gray-200 rounded-2xl pl-[72px] pr-10 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D2252B] focus:ring-4 focus:ring-[#D2252B]/8 bg-gray-50 focus:bg-white transition-all"
                  onChange={(e) => handleMobileChange(e.target.value)}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {form.donorMobile.length === 10 ? (
                    <FiCheckCircle size={15} className="text-emerald-500" />
                  ) : (
                    <span className="text-[11px] font-bold text-gray-300">
                      {form.donorMobile.length}/10
                    </span>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 pl-1">Only 10 digit mobile number allowed</p>
            </div>

            {/* Anonymous toggle */}
            <label className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-rose-200 hover:bg-rose-50/30 transition-all group">
              {/* Custom checkbox */}
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                form.isAnonymous
                  ? "bg-[#D2252B] border-[#D2252B]"
                  : "border-gray-300 group-hover:border-[#D2252B]/40"
              }`}>
                {form.isAnonymous && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
              />
              <div>
                <p className="text-sm font-bold text-gray-700 leading-tight">Donate Anonymously</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Your name won't appear publicly on this campaign
                </p>
              </div>
            </label>

            {/* Pay button */}
            <button
              onClick={handleDonate}
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#D2252B] to-[#a01c21] hover:from-[#c01e24] hover:to-[#8a1519] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl py-4 text-[15px] font-extrabold shadow-lg shadow-[#D2252B]/25 hover:shadow-[#D2252B]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              {/* Shine overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent pointer-events-none" />
              <span className="relative flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <FiLock size={15} />
                    Proceed to Payment · ₹{totalAmount?.toLocaleString("en-IN")}
                  </>
                )}
              </span>
            </button>

            {/* Footer reassurance */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <FiShield size={10} className="text-emerald-500" />
              <span>Payments secured by Razorpay · Your data is never shared</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
