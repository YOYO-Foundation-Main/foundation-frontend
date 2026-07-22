
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  donate,
  createOrder,
  verifyPayment,
  getPlatformSettings,
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
  const [platformSettings, setPlatformSettings] = useState<any>(null);
  const [isTipEnabled, setIsTipEnabled] =
    useState(true);
  const [selectedTipPercent, setSelectedTipPercent] =
    useState<number>(0);

  const [customTip, setCustomTip] =
    useState<number>(0);

  const [useCustomTip, setUseCustomTip] =
    useState(false);
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

    const loadSettings = async () => {
      try {
        const settings =
          await getPlatformSettings();
        console.log("SETTINGS RESPONSE", settings);
        setPlatformSettings(settings.data);

        setSelectedTipPercent(
          settings.data.defaultTipPercent || 0
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();
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

        // tipAmount:
        //   platformSettings?.isTipEnabled
        //     ? tipAmount
        //     : 0,

      };
        if(platformSettings?.isTipEnabled) {
          if (useCustomTip) {
            payload.customTipAmount = customTip;
          } else if (selectedTipPercent > 0) {
            payload.selectedTipPercent = selectedTipPercent;
          }
        }
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
        (sum: number, p: any) =>
          sum + p.price * p.quantity,
        0
      )
      : donationData.donationAmount;


  // const tipAmount =
  //   useCustomTip
  //     ? customTip
  //     : Math.round(
  //       totalAmount *
  //       (selectedTipPercent / 100)
  //     );

  const calculatedTip =
    useCustomTip
      ? customTip
      : Math.round(
        totalAmount *
        (selectedTipPercent / 100)
      );

  const tipAmount =
    platformSettings?.isTipEnabled
      ? calculatedTip
      : 0;

  const finalPayableAmount =
    totalAmount + tipAmount;

  donationData.mode === "products"
    ? donationData.selectedProductDetails?.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    )
    : donationData.donationAmount;

  // console.log("totalAmount", totalAmount);
  // console.log("tipAmount", tipAmount);
  // console.log("finalPayableAmount", finalPayableAmount);
  // console.log("isTipEnabled", isTipEnabled);


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

          
          {platformSettings?.isTipEnabled && (
            <div className="border-t border-gray-100 p-5 space-y-4">

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Support Foundation Platform
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Helps us maintain the platform and support more causes.
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {platformSettings?.tipOptions?.map(
                  (tip: number) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => {
                        setUseCustomTip(false);
                        setSelectedTipPercent(tip);
                        setCustomTip(0);
                      }}
                      className={`px-3 py-2 rounded-xl border text-sm font-semibold ${!useCustomTip &&
                        selectedTipPercent === tip
                        ? "border-[#D2252B] bg-[#D2252B]/10 text-[#D2252B]"
                        : "border-gray-200 text-gray-600"
                        }`}
                    >
                      {tip}%
                    </button>
                  )
                )}

                <button
                  type="button"
                  // onClick={() => setUseCustomTip(true)}
                  onClick={() => {
                    setUseCustomTip(true);
                    setSelectedTipPercent(0);
                  }}
                  className={`px-3 py-2 rounded-xl border text-sm font-semibold ${useCustomTip
                    ? "border-[#D2252B] bg-[#D2252B]/10 text-[#D2252B]"
                    : "border-gray-200 text-gray-600"
                    }`}
                >
                  Custom
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUseCustomTip(false);
                    setSelectedTipPercent(0);
                    setCustomTip(0);
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
                >
                  No Tip
                </button>
              </div>

              {useCustomTip && (
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) =>
                    setCustomTip(Number(e.target.value) || 0)
                  }
                  placeholder="Enter custom tip"
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                />
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Donation</span>
                  <span>₹{totalAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Support</span>
                  <span>₹{tipAmount}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total Payable</span>
                  <span>₹{finalPayableAmount}</span>
                </div>
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
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${form.isAnonymous
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
                    Proceed to Payment · ₹{finalPayableAmount?.toLocaleString("en-IN")}</>
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
