"use client";

import Image from "next/image";
import { RiShareBoxLine } from "react-icons/ri";

const volunteers = [
  { name: "Patricia E. Wall", role: "Co-Founder & CEO", image: "/assets/c1.jpg" },
  { name: "Elyse A. Phillips", role: "Walkers Ridge", image: "/assets/c2.jpg" },
  { name: "Patricia E. Wall", role: "Co-Founder & CEO", image: "/assets/c3.jpg" },
  { name: "Thomas C. Bale", role: "Goldcliff Circle", image: "/assets/c1.jpg" },
  { name: "Patricia E. Wall", role: "Co-Founder & CEO", image: "/assets/c1.jpg" },
  { name: "Elyse A. Phillips", role: "Walkers Ridge", image: "/assets/c2.jpg" },
  { name: "Patricia E. Wall", role: "Co-Founder & CEO", image: "/assets/c1.jpg" },
  { name: "Thomas C. Bale", role: "Goldcliff Circle", image: "/assets/c2.jpg" },
  { name: "Patricia E. Wall", role: "Co-Founder & CEO", image: "/assets/c1.jpg" },
  { name: "Elyse A. Phillips", role: "Walkers Ridge", image: "/assets/c2.jpg" },
  { name: "Patricia E. Wall", role: "Co-Founder & CEO", image: "/assets/c2.jpg" },
  { name: "Thomas C. Bale", role: "Goldcliff Circle", image: "/assets/c3.jpg" },
];

export default function VolunteersSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0E2A36] mb-4 leading-tight">
            Our Volunteers
          </h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {volunteers.map((item, index) => (
            <div key={index} className="group relative rounded-xl overflow-hidden">

              {/* IMAGE */}
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-60 object-cover rounded-xl"
              />

              {/* ✅ SHARE ICON — react-icons */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow cursor-pointer hover:bg-gray-100 transition">
                <RiShareBoxLine size={15} className="text-gray-600" />
              </div>

              {/* CARD INFO */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[85%] bg-[#f3efe9] rounded-lg px-4 py-3 text-center shadow-md">
                <h3 className="text-sm font-semibold text-black">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}