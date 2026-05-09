
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFeaturedCampaigns } from "@/features/auth/api/user.api";

interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  goalAmount: number;
  raisedAmount: number; 
  status: string;
}

export default function FeaturedCarousel() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeaturedCampaigns();
        const filtered = data.filter((c: Campaign) => c.status === "APPROVED");
        setCampaigns(filtered.slice(0, 5));
      } catch (err) {
        console.error("Error fetching featured campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (campaigns.length === 0) return;
    const interval = setInterval(() => {
      goTo((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [campaigns]);

  const goTo = (updater: (prev: number) => number) => {
    setAnimating(true);
    setTimeout(() => {
      setIndex(updater);
      setAnimating(false);
    }, 300);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((prev) => (prev + 1) % campaigns.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[420px] bg-[#f5ede6] rounded-3xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#FF5A1F] text-sm font-medium tracking-wide">
            Loading campaigns...
          </p>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) return null;

  const c = campaigns[index];
  const progress = Math.min(
    Math.round((c.raisedAmount / c.goalAmount) * 100),
    100
  );

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden cursor-pointer select-none group"
      style={{ height: "clamp(320px, 45vw, 500px)" }}
      onClick={() => router.push(`/campaigns/${c.id}`)}
    >
      {/* Background Image — full bleed */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: animating ? 0 : 1 }}
      >
        <img
          src={c.image}
          alt={c.title}
          className="w-full h-full object-cover object-center"
          style={{ display: "block" }}
        />
      </div>

      {/* Multi-layer gradient overlay — left-heavy like screenshot */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 68%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 text-white"
        style={{
          opacity: animating ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Location badge */}
        <div className="flex items-center gap-1.5 mb-3">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#D2252B]"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-xs md:text-sm font-medium text-white/80 tracking-wide uppercase">
            {c.location}
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-extrabold leading-tight mb-3 max-w-lg"
          style={{
            fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {c.title}
        </h2>

        {/* Description */}
        <p
          className="text-white/75 mb-5 max-w-sm leading-relaxed"
          style={{
            fontSize: "clamp(0.75rem, 1.3vw, 0.95rem)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {c.description}
        </p>

        {/* Progress bar */}
        <div className="w-60 mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-white/90">
              ₹{c.raisedAmount.toLocaleString("en-IN")}{" "}
              <span className="text-white/50 font-normal">raised</span>
            </span>
            <span className="text-xs font-bold text-[#4ade80]">
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)",
                transition: "width 0.6s ease",
                boxShadow: "0 0 8px rgba(74,222,128,0.6)",
              }}
            />
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            Goal: ₹{c.goalAmount.toLocaleString("en-IN")}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/campaigns/${c.id}`);
          }}
          className="relative overflow-hidden rounded-xl font-bold tracking-widest uppercase text-white w-fit transition-transform active:scale-95"
          style={{
            background: "#D2252B",
            padding: "12px 28px",
            fontSize: "clamp(0.7rem, 1.1vw, 0.82rem)",
            boxShadow: "0 4px 20px rgba(255,90,31,0.5)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "#d2454a")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "#df595d")
          }
        >
          Donate Now
        </button>
      </div>

      {/* Prev Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "white",
          fontSize: "20px",
        }}
      >
        ‹
      </button>

      {/* Next Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "white",
          fontSize: "20px",
        }}
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {campaigns.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              goTo(() => i);
            }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === index ? "24px" : "8px",
              height: "8px",
              background:
                i === index ? "#FF5A1F" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
