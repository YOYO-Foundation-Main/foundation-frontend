"use client";
import { useState } from "react";

const tabs = ["Central Africa", "Eastern Europe", "Southeast Asia", "Central America"];

export default function ProjectsRegionSection() {
  const [active, setActive] = useState("Central Africa");

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <p className="text-[#D2252B] text-xs font-bold tracking-[0.2em] uppercase mb-3">Global Reach</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-black">Projects by Region</h2>
        <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto leading-relaxed">
          We operate across continents, bringing change to the communities that need it most.
        </p>

        {/* Tabs — scroll on mobile */}
        <div className="flex justify-start sm:justify-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                active === tab
                  ? "bg-[#D2252B] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="relative mt-10 rounded-2xl overflow-hidden">
          <img src="/assets/world-map.jpg" alt="world map" className="w-full h-auto" />
          {active === "Central Africa" && (
            <>
              <div className="absolute top-[48%] left-[48%] w-4 h-4 sm:w-5 sm:h-5 bg-[#D2252B] rounded-full shadow-lg animate-pulse" />
              <div className="absolute top-[55%] left-[52%] w-4 h-4 sm:w-5 sm:h-5 bg-[#D2252B] rounded-full shadow-lg animate-pulse" />
              <div className="absolute top-[60%] left-[50%] w-4 h-4 sm:w-5 sm:h-5 bg-[#D2252B] rounded-full shadow-lg animate-pulse" />
            </>
          )}
          <div className="absolute top-[40%] left-[30%] w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full opacity-50" />
          <div className="absolute top-[50%] left-[28%] w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full opacity-50" />
          <div className="absolute top-[35%] left-[60%] w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full opacity-50" />
          <div className="absolute top-[45%] left-[65%] w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full opacity-50" />
        </div>
      </div>
    </section>
  );
}