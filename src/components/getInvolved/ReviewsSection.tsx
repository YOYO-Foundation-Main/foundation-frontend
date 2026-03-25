"use client";

import ReviewCard from "./ReviewCard";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Jessica B.",
      role: "Community Outreach",
      review: "Being part of a mission-driven organization...",
    },
    {
      name: "Emily T.",
      role: "Product Manager",
      review: "Working here has allowed me to grow...",
    },
    {
      name: "John D.",
      role: "Program Manager",
      review: "I'm proud to be part of a team...",
    },
    {
      name: "Sarah L.",
      role: "Communications",
      review: "The opportunity to contribute...",
    },
    {
      name: "Michael G.",
      role: "Finance Officer",
      review: "The passion within the team...",
    },
  ];

  return (
    <section className="py-20 bg-[#F9F9F9] text-center text-black overflow-hidden">

      <p className="text-sm text-[#D2252B] mb-2">
        Why Our Team Loves Working Here
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">
        Employee Reviews On Working <br />
        With Our Organization
      </h2>

      <div className="overflow-x-auto">
        <div className="flex gap-6 px-6 w-max">
          {reviews.map((item, index) => (
            <ReviewCard key={index} {...item} />
          ))}
        </div>
      </div>

    </section>
  );
}