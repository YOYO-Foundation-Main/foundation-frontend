"use client";

import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const reviews = [
    {
      name: "Jessica B.",
      role: "Community Outreach",
      review: "Being part of a mission-driven organization has transformed my career. The impact we make daily is truly inspiring.",
    },
    {
      name: "Emily T.",
      role: "Product Manager",
      review: "Working here has allowed me to grow professionally while contributing to meaningful causes. The team culture is exceptional.",
    },
    {
      name: "John D.",
      role: "Program Manager",
      review: "I'm proud to be part of a team that puts compassion into action every single day. Best decision I ever made.",
    },
    {
      name: "Sarah L.",
      role: "Communications",
      review: "The opportunity to contribute to real change while working with passionate colleagues makes every day rewarding.",
    },
    {
      name: "Michael G.",
      role: "Finance Officer",
      review: "The passion within the team is unmatched. We're not just employees; we're change-makers united by a common purpose.",
    },
  ];

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 20);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 20
    );
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  return (
    <section 
      className="py-20 bg-gradient-to-b from-[#F9F9F9] to-white text-center overflow-hidden relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        <p className="text-sm text-[#D2252B] font-semibold tracking-wider mb-2">
          Why Our Team Loves Working Here
        </p>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Employee Reviews On Working
          <br />
          With Our Organization
        </h2>

        <p className="text-gray-500 max-w-2xl mx-auto mb-12">
          Hear what our team members have to say about their experience working with us.
        </p>

        {/* Scroll Buttons */}
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="
                absolute left-0 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-lg 
                flex items-center justify-center text-[#D2252B]
                hover:bg-[#D2252B] hover:text-white
                transition-all duration-300
                border border-gray-200
                -translate-x-1/2
              "
            >
              <FaChevronLeft size={16} />
            </button>
          )}

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="
              flex gap-6 overflow-x-auto scroll-smooth pb-6
              scrollbar-hide
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((item, index) => (
              <ReviewCard key={index} {...item} />
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="
                absolute right-0 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-lg 
                flex items-center justify-center text-[#D2252B]
                hover:bg-[#D2252B] hover:text-white
                transition-all duration-300
                border border-gray-200
                translate-x-1/2
              "
            >
              <FaChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              className="
                w-2 h-2 rounded-full transition-all duration-300
                bg-gray-300 hover:bg-[#D2252B] hover:w-4
              "
              onClick={() => {
                const container = scrollContainerRef.current;
                if (container) {
                  const cardWidth = 326; // 300px min-width + 26px gap
                  container.scrollTo({ left: index * cardWidth, behavior: "smooth" });
                }
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}