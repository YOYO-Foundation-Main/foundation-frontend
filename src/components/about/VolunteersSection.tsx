"use client";

import Image from "next/image";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const volunteers = [
  {
    name: "Brycen Gregory",
    role: "Volunteer",
    image: "/assets/v1.png",
  },
  {
    name: "Brycen Gregory",
    role: "Volunteer",
    image: "/assets/v2.png",
  },
  {
    name: "Brycen Gregory",
    role: "Volunteer",
    image: "/assets/v3.png",
  },
];

export default function VolunteersSection() {
  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* HEADING */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#121212] mb-14">
          Our Volunteers
        </h2>

        {/* CARDS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {volunteers.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              
              {/* IMAGE */}
              <div className="overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={400}
                  className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="text-center py-6 px-4">
                <h3 className="font-semibold text-[#121212] text-lg">
                  {item.name}
                </h3>
                <p className="text-[#D2252B] text-sm mb-4">
                  {item.role}
                </p>

                {/* SOCIAL ICONS */}
                <div className="flex justify-center gap-4 text-gray-600 text-sm">
                  <FaFacebookF className="cursor-pointer hover:text-[#D2252B]" />
                  <FaXTwitter className="cursor-pointer hover:text-[#D2252B]" />
                  <FaInstagram className="cursor-pointer hover:text-[#D2252B]" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* DOTS (STATIC UI like figma) */}
        <div className="flex justify-center mt-10 gap-2">
          <span className="w-2 h-2 bg-[#D2252B] rounded-full" />
          <span className="w-2 h-2 bg-gray-300 rounded-full" />
          <span className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>

      </div>
    </section>
  );
}