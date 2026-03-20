"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";

const testimonials = [
  {
    name: "Rachel S.",
    role: "Donor",
    text: "I've supported many causes, but this one stands out. The team's dedication to empowering people through practical solutions is inspiring.",
  },
  {
    name: "Sarah L.",
    role: "Donor",
    text: "I'm proud to support such a dedicated organization that's truly making a difference.",
  },
  {
    name: "Michael B.",
    role: "Donor",
    text: "Working with this organization has been an eye-opening experience.",
  },
  {
    name: "Maria A.",
    role: "Donor",
    text: "The impact I've seen is incredible. Their focus on sustainability is something I deeply believe in.",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const itemsPerView = 3; // desktop
  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  const start = activeIndex * itemsPerView;
  const visibleItems = testimonials.slice(start, start + itemsPerView);

  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[#D2252B] font-semibold text-sm mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Hear From Our Supporters:
            <br />
            Together, We Make A Difference
          </h2>
        </div>

        {/* CARDS (NO SCROLL) */}
        <div className="grid md:grid-cols-3 gap-6">

          {visibleItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              
              {/* PROFILE ICON */}
              <div className="mb-4 w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-gray-500 text-lg" />
              </div>

              {/* QUOTE */}
              <div className="text-[40px] leading-none text-[#575757] mb-3">
                “
              </div>

              {/* TEXT */}
              <p className="text-[#575757] text-sm leading-relaxed mb-6">
                {item.text}
              </p>

              {/* NAME */}
              <div>
                <p className="font-semibold text-[#121212] text-sm">
                  {item.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {item.role}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* DOTS */}
        <div className="flex justify-center mt-10 gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                i === activeIndex
                  ? "bg-[#D2252B] w-6"
                  : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}