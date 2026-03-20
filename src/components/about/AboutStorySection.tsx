import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";

export default function AboutStorySection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-20">

        {/* ================= TOP SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT IMAGE */}
          <div>
            <Image
              src="/assets/tr.jpg"
              alt="story"
              width={500}
              height={500}
              className="rounded-2xl object-cover w-full h-auto"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-6">
              Make a Difference,
              <br />
              Support Those in Need.
            </h2>

            {/* TEXT GRID */}
            <div className="grid sm:grid-cols-2 gap-6 text-[#6B6B6B] text-sm leading-relaxed mb-8">
              <p>
                Libero dictum ut purus ut vel sit egestas. Amet id in tristique
                bibendum justo netus augue id.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur. Amet id in tristique
                bibendum justo netus augue id.
              </p>
              <p>
                Nunc tristique quis leo duis gravida volutpat vitae quam quam.
                Ultrices urna nec massa commodo id sit amet.
              </p>
              <p>
                Ultrices urna nec massa commodo id sit amet. Libero dictum ut
                purus ut vel sit egestas.
              </p>
            </div>

            {/* PROFILE + SIGN */}
            <div className="flex items-center gap-6 flex-wrap">
              
              {/* PROFILE */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-[#121212] text-sm">
                    Felipe Vaughn
                  </p>
                  <p className="text-gray-500 text-xs">Founder</p>
                </div>
              </div>

              {/* SIGNATURE */}
              <Image
                src="/assets/sign.png"
                alt="signature"
                width={120}
                height={50}
                className="object-contain"
              />
            </div>

          </div>
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-8">
              About our Organization
            </h2>

            <div className="space-y-6">
              
              {/* ITEM */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFEDEE] flex items-center justify-center">
                  <FaHeart className="text-[#D2252B]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#121212]">
                    Our Mission
                  </h4>
                  <p className="text-[#6B6B6B] text-sm">
                    Amet id in tristique bibendum justo netus augue id. Nunc
                    tristique quis leo duis gravida volutpat vitae quam.
                  </p>
                </div>
              </div>

              {/* ITEM */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFEDEE] flex items-center justify-center">
                  <FaEye className="text-[#D2252B]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#121212]">
                    Our Vision
                  </h4>
                  <p className="text-[#6B6B6B] text-sm">
                    Ultrices urna nec massa commodo id sit amet. Libero dictum ut
                    purus ut vel sit egestas.
                  </p>
                </div>
              </div>

              {/* ITEM */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFEDEE] flex items-center justify-center">
                  <FaStar className="text-[#D2252B]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#121212]">
                    Our Values
                  </h4>
                  <p className="text-[#6B6B6B] text-sm">
                    Ut ac mattis senectus ac suspendisse vitae vel nulla
                    eleifend. Est eros facilisi aenean nisl a.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT IMAGES */}
          <div className="flex gap-6">
            <Image
              src="/assets/handshake.png"
              alt="handshake"
              width={200}
              height={300}
              className="rounded-2xl object-cover w-1/2"
            />
            <Image
              src="/assets/hands.png"
              alt="hands"
              width={200}
              height={300}
              className="rounded-2xl object-cover w-1/2"
            />
          </div>

        </div>

      </div>
    </section>
  );
}