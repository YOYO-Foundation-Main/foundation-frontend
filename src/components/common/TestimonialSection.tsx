import Image from "next/image";
import { FaPlay } from "react-icons/fa";

// TestimonialSection.tsx
export default function TestimonialSection() {
  return (
    <section className="bg-[#f5f5f5] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* White card wrapper */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center p-8 lg:p-12">
            
            {/* LEFT */}
            <div>
              <div className="text-[#D2252B] text-6xl font-serif leading-none mb-4 select-none">"</div>

              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 leading-snug mb-6">
                Together, we can change <br className="hidden sm:block" /> lives for the better
              </h2>

              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                Every small act of generosity ripples outward. Thanks to donors like
                you, families across the world have clean water, education, and hope.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#D2252B] flex items-center justify-center text-white font-bold text-lg">
                  G
                </div>
                <div>
                  <p className="font-bold text-gray-900">George Henry</p>
                  <p className="text-sm text-gray-500">Monthly Donor since 2022</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-8 h-2 bg-[#D2252B] rounded-full" />
                <span className="w-2 h-2 bg-gray-300 rounded-full" />
                <span className="w-2 h-2 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image src="/assets/tr.jpg" alt="testimonial" width={600} height={450}
                className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D2252B] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition">
                  <FaPlay className="text-white ml-1 text-lg sm:text-xl" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}