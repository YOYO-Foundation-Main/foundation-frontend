import Image from "next/image";
import { FaPlay } from "react-icons/fa";

export default function TestimonialSection() {
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          {/* Quote icon */}
          <div className="text-[#D2252B] text-5xl mb-4">“</div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] leading-snug mb-6">
            Together, we can change <br /> lives for the better
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
            Sollicitudin vitae diam senectus molestie cras in gravida egestas ac.
            Tortor condimentum suspendisse duis et velit donec turpis interdum elit.
            Tincidunt ultrices eu vitae ut velit purus urna in.
          </p>

          {/* Author */}
          <div>
            <p className="font-semibold text-black">George Henry</p>
            <p className="text-gray-500 text-sm">Donor</p>
          </div>
          <div>
            <p className="font-semibold text-black">George Henry</p>
            <p className="text-gray-500 text-sm">Donor</p>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-6">
            <span className="w-3 h-3 bg-[#D2252B] rounded-full" />
            <span className="w-3 h-3 bg-gray-300 rounded-full" />
            <span className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* RIGHT IMAGE / VIDEO */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src="/assets/tr.jpg"
              alt="testimonial"
              width={500}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Play Button (UI only for now) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 bg-[#D2252B] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
              <FaPlay className="text-white ml-1" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}