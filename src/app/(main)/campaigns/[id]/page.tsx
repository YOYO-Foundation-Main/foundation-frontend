"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCampaignById } from "@/features/campaigns/api/campaign.api";
import { Campaign, CampaignProduct } from "@/features/campaigns/types/campaign.types";
import { FiArrowLeft, FiMapPin, FiCalendar } from "react-icons/fi";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function isValidUrl(url?: string) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function getProgress(raised: number, goal: number) {
  if (!goal) return 0;
  return Math.min((raised / goal) * 100, 100);
}

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [mode, setMode] = useState<"products" | "money">("products");
  const router = useRouter();
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getCampaignById(id);
        setCampaign(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!campaign) return <div className="p-10">Loading...</div>;

  const products = campaign.campaignProducts || [];
  const progress = getProgress(campaign.raisedAmount || 0, campaign.goalAmount || 1);

  const increaseQty = (productId: number, max: number) => {
    setSelectedProducts((prev) => {
      const current = prev[productId] || 0;
      if (current >= max) return prev;
      return { ...prev, [productId]: current + 1 };
    });
  };

  const decreaseQty = (productId: number) => {
    setSelectedProducts((prev) => {
      const newQty = (prev[productId] || 0) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const selectedProductDetails = Object.entries(selectedProducts).map(
    ([id, qty]) => {
      const product = products.find(p => p.id === Number(id));
      return {
        campaignProductId: product?.id,
        name: product?.name,
        image: product?.image,
        price: product?.price,
        quantity: qty,
      };
    }
  );
  return (
    <div className="bg-[#F7F7F7] min-h-screen py-10">

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

        {/* ================= LEFT SIDE ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-28 lg:mt-18 h-fit sticky top-[110px]">

          {/* <Link href="/campaigns" className="text-gray-500 flex items-center gap-2">
            <FiArrowLeft /> Back
          </Link> */}

          {/* IMAGE */}
          <div className="w-full h-[300px] relative rounded-2xl overflow-hidden shadow">
            <Image
              src={
                campaign.image && isValidUrl(campaign.image)
                  ? campaign.image
                  : "/assets/placeholder.png"
              }
              alt="campaign"
              fill
              className="object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">

            <h1 className="text-2xl font-bold">{campaign.title}</h1>

            {/* META */}
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FiMapPin /> {campaign.location || "Unknown"}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar /> {campaign.createdAt?.slice(0, 10)}
              </span>
            </div>

            {/* PROGRESS */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>₹{fmt(campaign.raisedAmount || 0)} raised</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-[#D2252B] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {campaign.description}
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-28 lg:mt-18 h-fit sticky top-[110px]">

          {/* SWITCH */}
          <div className="flex bg-[#F3F3F3] rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode("products")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === "products"
                ? "bg-[#D2252B] text-white"
                : "text-gray-500"
                }`}
            >
              Donate Products
            </button>

            <button
              onClick={() => setMode("money")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === "money"
                ? "bg-[#D2252B] text-white"
                : "text-gray-500"
                }`}
            >
              Donate Money
            </button>
          </div>

          {/* ================= PRODUCTS MODE ================= */}
          {mode === "products" && (
            <div>

              {/* GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                {products.map((p: CampaignProduct) => {
                  const qty = selectedProducts[p.id] || 0;

                  return (
                    <div
                      key={p.id}
                      className="bg-[#FAFAFA] rounded-2xl p-3 transition transform hover:-translate-y-1 hover:shadow-md"
                    >
                      {/* IMAGE */}
                      <div className="w-full h-24 relative mb-3">
                        <Image
                          src={
                            isValidUrl(p.image)
                              ? p.image!
                              : "/assets/placeholder.png"
                          }
                          alt={p.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* NAME */}
                      <p className="text-sm font-semibold mb-1 line-clamp-1">
                        {p.name}
                      </p>

                      {/* REQUIRED */}
                      <p className="text-xs text-gray-500 mb-1">
                        {p.quantity} Qty needed
                      </p>

                      {/* PROGRESS BAR */}
                      {/* <div className="w-full h-[4px] bg-gray-200 rounded-full mb-2">
                        <div className="h-[4px] bg-[#FF4D2D] rounded-full w-[20%]" />
                      </div> */}

                      {/* PRICE */}
                      <p className="text-sm font-semibold mb-3">
                        ₹{p.price}
                        <span className="text-xs text-gray-400"> /unit</span>
                      </p>

                      {/* ADD / COUNTER */}
                      {qty === 0 ? (
                        <button
                          onClick={() => increaseQty(p.id, p.quantity)}
                          className="w-full border border-[#D2252B] text-[#D2252B] py-1.5 rounded-lg text-sm font-semibold hover:bg-[#D2252B] hover:text-white transition"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-[#D2252B] text-white rounded-lg px-2 py-1">
                          <button onClick={() => decreaseQty(p.id)}>-</button>
                          <span>{qty}</span>
                          <button onClick={() => increaseQty(p.id, p.quantity)}>+</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DONATE BAR */}
              <div className="mt-8 border-t pt-4">

                {/* <div className="text-xs text-gray-500 mb-3 text-center">
                  ₹500 Donated by someone 15 mins ago
                </div> */}

                <button
                  onClick={() => {
                    if (Object.keys(selectedProducts).length === 0) {
                      alert("Please select at least one product");
                      return;
                    }

                    // ✅ store data
                    localStorage.setItem(
                      "donationData",
                      JSON.stringify({
                        campaignId: campaign.id,
                        selectedProductDetails,
                        donationAmount: 0, // important
                        mode: "products",
                      })
                    );

                    // ✅ navigate (ALSO FIXED LOWERCASE)
                    router.push(`/Donate/${campaign.id}/Checkout?mode=products`);
                  }}
                  className="w-full bg-[#D2252B] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                >
                  DONATE NOW (₹
                  {Object.entries(selectedProducts).reduce((sum, [id, qty]) => {
                    const product = products.find(p => p.id === Number(id));
                    return product ? sum + product.price * qty : sum;
                  }, 0)}
                  )
                </button>
              </div>
            </div>
          )}

          {/* ================= MONEY MODE ================= */}
          {mode === "money" && (
            <div>

              {/* TABLE */}
              <div className="space-y-3 text-sm mb-6">

                {/* HEADER */}
                <div className="grid grid-cols-3 font-semibold text-gray-700 border-b pb-2">
                  <span>Materials</span>
                  <span className="text-center">Required Qty</span>
                  <span className="text-right">Price/Unit</span>
                </div>

                {/* ROWS */}
                {products.map((p: CampaignProduct) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-3 items-center text-gray-600 py-1"
                  >
                    {/* NAME */}
                    <span className="truncate">{p.name}</span>

                    {/* QUANTITY */}
                    <span className="text-center">{p.quantity}</span>

                    {/* PRICE */}
                    <span className="text-right font-medium">₹{p.price}</span>
                  </div>
                ))}

              </div>

              {/* GOAL */}
              <div className="bg-[#F4F7FB] rounded-xl p-4 mb-5">
                <div className="flex justify-between font-semibold">
                  <span>Total Goal</span>
                  <span>₹{fmt(campaign.goalAmount || 0)}</span>
                </div>
              </div>

              {/* QUICK AMOUNT */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1800, 2500, 4000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2 rounded-lg border text-sm ${donationAmount === amt
                      ? "border-[#D2252B] text-[#FF4D2D]"
                      : "text-gray-500"
                      }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full border p-3 rounded-lg mb-5"
                value={donationAmount || ""}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
              />

              {/* DONATE BAR */}
              <div className="border-t pt-4">

                {/* <div className="text-xs text-gray-500 mb-3 text-center">
                  ₹2,500 Donated by Radhika 5 hours ago
                </div> */}

                <button
                  onClick={() => {
                    // ✅ prevent empty donation
                    if (mode === "products" && Object.keys(selectedProducts).length === 0) {
                      alert("Please select at least one product");
                      return;
                    }

                    if (mode === "money" && donationAmount <= 0) {
                      alert("Please enter donation amount");
                      return;
                    }

                    // ✅ store data
                    localStorage.setItem(
                      "donationData",
                      JSON.stringify({
                        campaignId: campaign.id,
                        selectedProductDetails,
                        donationAmount,
                        mode,
                      })
                    );

                    // ✅ navigate
                    router.push(`/Donate/${campaign.id}/Checkout?mode=${mode}`);
                  }}
                  className="w-full bg-[#D2252B] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                >
                  DONATE NOW (
                  ₹
                  {mode === "products"
                    ? Object.entries(selectedProducts).reduce((sum, [id, qty]) => {
                      const product = products.find((p) => p.id === Number(id));
                      return product ? sum + product.price * (qty as number) : sum;
                    }, 0)
                    : donationAmount}
                  )
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}