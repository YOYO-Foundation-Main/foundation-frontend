"use client";
import { useState } from "react";

const amounts = [500, 1000, 2000, 5000, 10000, 50000];

export default function Hero() {
  const [type, setType] = useState<"one-time" | "weekly">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden"
      style={{ backgroundImage: "url('/assets/herobg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28 lg:py-20 flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-16">

        {/* LEFT */}
        <div className="w-full lg:max-w-2xl text-center lg:text-left">
          <p className="text-[#D2252B] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Making a Difference Together
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black leading-[1.05] tracking-tight">
            Give Hope,
            <br />
            <span className="text-[#D2252B]">Save Lives</span>
          </h1>

          <p className="mt-6 text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            Join thousands of donors transforming lives across the globe. Every
            rupee you give creates lasting change.
          </p>

          {/* Stats */}
          <div className="flex gap-8 sm:gap-12 mt-10 justify-center lg:justify-start">
            <div>
              <p className="text-[#D2252B] text-2xl sm:text-3xl font-black">₹12,84,528</p>
              <p className="text-sm text-gray-400 mt-0.5">Total Donated</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[#D2252B] text-2xl sm:text-3xl font-black">12,460</p>
              <p className="text-sm text-gray-400 mt-0.5">People Helped</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Donation card */}
        <div className="w-full max-w-[400px] lg:max-w-[380px] shrink-0">
          <div className="bg-white text-black rounded-2xl p-6 sm:p-7 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-5 text-center">Make a Donation</h3>

            {/* Toggle */}
            <div className="flex mb-5 bg-gray-100 rounded-xl p-1">
              {(["one-time", "weekly"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    type === t ? "bg-[#D2252B] text-white shadow-sm" : "text-gray-500"
                  }`}>
                  {t === "one-time" ? "One-time" : "Weekly"}
                </button>
              ))}
            </div>

            {/* Amount grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {amounts.map((amt) => (
                <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                  className={`py-2.5 text-sm rounded-xl border-2 font-semibold transition-all ${
                    selectedAmount === amt
                      ? "bg-[#D2252B] text-white border-[#D2252B]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#D2252B] hover:text-[#D2252B]"
                  }`}>
                  ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input type="number" placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                className="w-full border-2 border-gray-200 focus:border-[#D2252B] rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400" />
            </div>

            <button className="w-full bg-[#D2252B] hover:bg-[#b91f24] text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-red-200">
              DONATE NOW
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure & encrypted payment</p>
          </div>
        </div>
      </div>
    </section>
  );
}