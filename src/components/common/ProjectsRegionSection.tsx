"use client";

import { useState } from "react";

const tabs = [
  "Central Africa",
  "Eastern Europe",
  "Southeast Asia",
  "Central America",
];

export default function ProjectsRegionSection() {
  const [activeTab, setActiveTab] = useState("Central Africa");

  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8 text-center">
        
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-black">
          Projects by Region
        </h2>

        <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
          Adipiscing in vitae nec posuere eget fringilla a morbi. Ultricies lacus
          turpis proin tempor faucibus ullamcorper massa tristique est.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mt-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 border-b-2 transition ${
                activeTab === tab
                  ? "text-[#D2252B] border-[#D2252B]"
                  : "text-black border-transparent hover:text-[#D2252B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="relative mt-10">
          <img
            src="/assets/world-map.jpg"
            alt="world map"
            className="w-full"
          />

          {/* RED MARKERS (Active Region) */}
          {activeTab === "Central Africa" && (
            <>
              <div className="absolute top-[48%] left-[48%] w-5 h-5 bg-[#D2252B] rounded-full shadow-md" />
              <div className="absolute top-[55%] left-[52%] w-5 h-5 bg-[#D2252B] rounded-full shadow-md" />
              <div className="absolute top-[60%] left-[50%] w-5 h-5 bg-[#D2252B] rounded-full shadow-md" />
            </>
          )}

          {/* BLACK MARKERS (Other Regions) */}
          <div className="absolute top-[40%] left-[30%] w-5 h-5 bg-black rounded-full" />
          <div className="absolute top-[50%] left-[28%] w-5 h-5 bg-black rounded-full" />
          <div className="absolute top-[35%] left-[60%] w-5 h-5 bg-black rounded-full" />
          <div className="absolute top-[45%] left-[65%] w-5 h-5 bg-black rounded-full" />
        </div>

      </div>
    </section>
  );
}