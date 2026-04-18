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

            // ✅ ensure products always exists
            setDonationData({
                ...parsed,
                products: parsed.products || [],
            });
        }
    }, []);

    if (!donationData) return <div className="p-10">Loading...</div>;
    // const [loading, setLoading] = useState(false);

    const handleDonate = async () => {

        // ✅ VALIDATION HERE
        if (!form.donorName || !form.donorEmail || !form.donorMobile) {
            alert("Please fill all details");
            return;
        }

        try {
            console.log("🚀 Donate Clicked");

            // =========================
            // 1. CREATE PAYLOAD
            // =========================
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

            console.log("📦 PAYLOAD:", payload);

            // =========================
            // 2. CREATE DONATION
            // =========================
            const donationRes = await donate(payload);
            console.log("✅ FULL DONATION RESPONSE:", JSON.stringify(donationRes, null, 2));
            const donationId = donationRes?.data?.id;
            console.log("🎯 donationId:", donationId);
            if (!donationId) {
                console.error("❌ donationId missing");
                return alert("Donation creation failed");
            }

            // =========================
            // 3. CREATE ORDER
            // =========================
            const orderRes = await createOrder(donationId);
            console.log("💳 ORDER RESPONSE:", orderRes);

            const order = orderRes?.order;
            const key = orderRes?.key;

            if (!order?.id) {
                console.error("❌ Order ID missing");
                return alert("Order creation failed");
            }

            // =========================
            // 4. LOAD RAZORPAY
            // =========================
            const isLoaded = await loadRazorpay();
            console.log("📜 Razorpay Loaded:", isLoaded);

            if (!isLoaded) {
                return alert("Razorpay SDK failed to load");
            }

            console.log("🧠 Razorpay Object:", (window as any).Razorpay);

            // =========================
            // 5. OPEN RAZORPAY
            // =========================
            const options: any = {
                key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: "Donation",
                description: "Support Campaign",
                order_id: order.id,

                handler: async function (response: any) {
                    console.log("🎉 PAYMENT SUCCESS:", response);

                    try {
                        const verifyRes = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            donationId: donationId, // 🔥 THIS IS THE FIX
                        });

                        console.log("✅ VERIFY RESPONSE:", verifyRes);

                        localStorage.removeItem("donationData");

                        router.push(`/Donate/success?donationId=${donationId}`);

                    } catch (err) {
                        console.error("❌ VERIFY ERROR:", err);
                        alert("Verification failed");
                    }
                },

                modal: {
                    ondismiss: function () {
                        alert("Payment was cancelled");
                    }
                },

                prefill: {
                    name: payload.donorName,
                    email: payload.donorEmail,
                    contact: payload.donorMobile,
                },

                theme: {
                    color: "#D2252B",
                },
            };

            console.log("⚡ Opening Razorpay...");

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("🔥 FINAL ERROR:", err);
            alert("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] pt-[100px] px-6">

            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

                {/* ================= LEFT: SUMMARY ================= */}
                <div className="bg-white rounded-2xl p-6 shadow">

                    <h2 className="text-xl font-bold mb-5">Donation Summary</h2>

                    {/* ================= PRODUCTS ================= */}
                    {donationData.mode === "products" && (
                        <div className="space-y-4">


                            {(donationData.selectedProductDetails || []).length === 0 ? (
                                <p className="text-gray-500 text-sm">No products selected</p>
                            ) : (
                                donationData.selectedProductDetails?.map((p: any) => (
                                    <div
                                        key={p.campaignProductId}
                                        className="flex items-center gap-4 border-b pb-3"
                                    >
                                        <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={
                                                    p?.image && p.image.startsWith("http")
                                                        ? p.image
                                                        : "/assets/placeholder.png"
                                                }
                                                alt={p?.name || "product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{p.name}</p>
                                            <p className="text-xs text-gray-500">
                                                ₹{p.price} × {p.quantity}
                                            </p>
                                        </div>

                                        <div className="text-sm font-semibold">
                                            ₹{p.price * p.quantity}
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* TOTAL */}
                            <div className="flex justify-between font-bold pt-3 border-t">
                                <span>Total</span>
                                <span>
                                    ₹{donationData.selectedProductDetails?.reduce(
                                        (sum: number, p: any) => sum + p.price * p.quantity,
                                        0
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ================= MONEY ================= */}
                    {donationData.mode === "money" && (
                        <div className="text-2xl font-bold text-[#D2252B]">
                            ₹{donationData.donationAmount}
                        </div>
                    )}
                </div>

                {/* ================= RIGHT: FORM ================= */}
                <div className="bg-white rounded-2xl p-6 shadow">

                    <h2 className="text-xl font-bold mb-4">
                        Enter your details
                    </h2>

                    <div className="space-y-4">

                        <input
                            placeholder="Name"
                            className="w-full border p-3 rounded-lg"
                            onChange={(e) =>
                                setForm({ ...form, donorName: e.target.value })
                            }
                        />

                        <input
                            placeholder="Email"
                            className="w-full border p-3 rounded-lg"
                            onChange={(e) =>
                                setForm({ ...form, donorEmail: e.target.value })
                            }
                        />

                        <input
                            placeholder="Mobile"
                            className="w-full border p-3 rounded-lg"
                            onChange={(e) =>
                                setForm({ ...form, donorMobile: e.target.value })
                            }
                        />

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    setForm({ ...form, isAnonymous: e.target.checked })
                                }
                            />
                            Donate anonymously
                        </label>

                        <button
                            onClick={handleDonate}
                            disabled={loading}
                            className="w-full bg-[#D2252B] text-white py-3 rounded-lg font-bold"
                        >
                            {loading ? "Processing..." : "CONTINUE TO PAY"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

