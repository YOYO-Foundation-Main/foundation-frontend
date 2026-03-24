import Image from "next/image";
import { FaPlay } from "react-icons/fa";
 import Link from "next/link";

export default function ImpactVideoSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ================= VIDEO BANNER ================= */}
        <div className="relative">

          {/* BACKGROUND IMAGE */}
          <Image
            src="/assets/p4.jpg"
            alt="impact"
            width={1200}
            height={600}
            className="w-full h-[350px] md:h-[420px] object-cover rounded-xl grayscale"
          />

          {/* PLAY BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow hover:scale-110 transition">
              <FaPlay className="text-black ml-1" />
            </button>
          </div>

          {/* OVERLAY CARD */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-xl p-6 md:flex justify-between items-center shadow">

            <div>
              <p className="text-[#D2252B] text-sm mb-2">
                Our Activity
              </p>

              <h3 className="text-xl md:text-2xl font-semibold text-black">
                See How We’re <br /> Making An Impact
              </h3>
            </div>

            <p className="text-sm text-gray-500 mt-4 md:mt-0 max-w-md">
              Watch our video to discover how we empower communities through
              education, healthcare, and sustainable solutions, creating
              meaningful change for a better tomorrow.
            </p>

          </div>
        </div>

        {/* ================= CTA SECTION ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <p className="text-[#D2252B] text-sm mb-2">
              Join Our Team
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-black">
              Become A Volunteer And <br />
              Create Lasting Change
            </h2>
          </div>

         

<Link
  href="/volunteer"
  className="bg-[#D2252B] text-white px-6 py-3 rounded-full text-sm hover:bg-[#b91f24] transition"
>
  Join Now →
</Link>

        </div>

      </div>
    </section>
  );
}