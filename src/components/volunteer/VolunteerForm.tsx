"use client";
import Image from "next/image";

export default function VolunteerForm() {
  return (
    <section className="relative py-20 bg-[#f8f8f8]">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div>
          <p className="text-[#D2252B] text-sm tracking-wider mb-3">
            APPLICATIONS
          </p>

          <h2 className="text-4xl font-bold text-[#0E2A36] mb-4 leading-tight">
            Become a volunteer
          </h2>

          <p className="text-gray-500 mb-6 leading-relaxed">
            Elit sit risus lorem proin eget eu molestie nibh odio non neque turpis proin viverra vel arcu venenatis nulla fin blandit lorem.
          </p>

          <ul className="space-y-3 text-gray-600 mb-8">
            <li className="flex items-center gap-2">
              <span className="text-[#D2252B]">✔</span>
              Viverra vel arcu venenatis nulla fin blandit lorem.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#D2252B]">✔</span>
              Leo egestas sit auctor non proin posuere tortor.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#D2252B]">✔</span>
              Ut in pretium, nunc eget morbi congue quis feugiat.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#D2252B]">✔</span>
              Viverra vel arcu venenatis nulla fin blandit lorem.
            </li>
          </ul>

          <Image
            src="/assets/p2.jpg"
            alt="volunteer"
            width={500}
            height={300}
            className="rounded-2xl object-cover"
          />
        </div>

        {/* RIGHT (BACKGROUND IMAGE + FORM CARD) */}
        <div className="relative">

          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Image
              src="/assets/p2.jpg"
              alt="bg"
              fill
              className="object-cover opacity-20"
            />
          </div>

          {/* FORM CARD */}
          <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              If You Have Any Questions, Contact Us
            </h3>

            <div className="space-y-4">
              <input placeholder="Full Name" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2252B]" />
              <input placeholder="Email address" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2252B]" />
              <input placeholder="Phone" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2252B]" />
              <input placeholder="Subject" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2252B]" />
              <textarea placeholder="Message" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-[#D2252B]" />
            </div>

            <button className="mt-6 w-full bg-[#D2252B] text-white py-3 rounded-lg font-medium hover:bg-[#b81e24] transition">
              Send Message →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}