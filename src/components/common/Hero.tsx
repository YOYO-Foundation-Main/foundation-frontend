"use client";

import { useState } from "react";

const amounts = [500, 1000, 2000, 5000, 10000, 50000];

export default function Hero() {
  const [type, setType] = useState<"one-time" | "weekly">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  return (
    <section
      className="relative min-h-screen flex items-center text-white"
      style={{
        backgroundImage: "url('/assets/herobg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col md:flex-row justify-between items-center gap-10 py-28 md:py-20">

        {/* LEFT SIDE */}
        <div className="w-full md:max-w-xl text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Give Hope,
            <br />
            Save Lives
          </h1>

          <p className="mt-5 text-gray-300 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
            Libero mauris sed sed proin. Blandit aliquet ipsum faucibus
            dictum natoque arcu. Potenti ante sed in amet massa aliquet.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mt-8 justify-center md:justify-start">
            <div>
              <p className="text-[#D2252B] text-xl md:text-2xl font-semibold">
                ₹1 284 528
              </p>
              <p className="text-sm text-gray-300">Donation</p>
            </div>

            <div>
              <p className="text-[#D2252B] text-xl md:text-2xl font-semibold">
                12 460
              </p>
              <p className="text-sm text-gray-300">People Helped</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="bg-white text-black rounded-xl p-6 w-full max-w-[360px] shadow-2xl border border-gray-200 shrink-0">
          <h3 className="text-lg font-semibold mb-5 text-center">
            Donation Amount
          </h3>

          {/* Toggle */}
          <div className="flex mb-5 border border-[#D2252B] rounded-md overflow-hidden">
            <button
              onClick={() => setType("one-time")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                type === "one-time"
                  ? "bg-[#D2252B] text-white"
                  : "text-gray-500 bg-white"
              }`}
            >
              One-time
            </button>

            <button
              onClick={() => setType("weekly")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                type === "weekly"
                  ? "bg-[#D2252B] text-white"
                  : "text-gray-500 bg-white"
              }`}
            >
              Weekly
            </button>
          </div>

          {/* Amount Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
                className={`py-2 text-sm rounded-md border transition ${
                  selectedAmount === amt
                    ? "bg-[#D2252B] text-white border-[#D2252B]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#D2252B]"
                }`}
              >
                {amt} Ks
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <input
            type="number"
            placeholder="Custom Amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className="w-full border border-[#D2252B] rounded-md p-2 mb-5 text-sm outline-none focus:ring-2 focus:ring-[#D2252B]"
          />

          {/* CTA */}
          <button className="w-full bg-[#D2252B] hover:bg-[#b91f24] text-white py-2 rounded-md font-semibold transition">
            DONATE NOW
          </button>
        </div>
      </div>
    </section>
  );
}