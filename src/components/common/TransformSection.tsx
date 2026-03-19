import Image from "next/image";

export default function TransformSection() {
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT IMAGE */}
        <div className="w-full">
          <Image
            src="/assets/tr.jpg"
            alt="transform"
            width={600}
            height={400}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-black leading-snug">
            Transforming Good <br />
            Intentions into Good Actions
          </h2>

          <p className="text-gray-500 text-sm mt-5 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Amet id in tristique
            bibendum justo netus augue id. Nunc tristique quis leo dui gravida
            volutpat vitae quam quam.
          </p>

          {/* STEPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-sm">
            
            <div className="flex items-start gap-3">
              <span className="bg-[#D2252B] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                1
              </span>
              <p className="text-black">Choose your cause</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-[#D2252B] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                2
              </span>
              <p className="text-black">Register on our website</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-[#D2252B] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                3
              </span>
              <p className="text-black">Donate the amount you like</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-[#D2252B] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                4
              </span>
              <p className="text-black">Stay tuned about cause</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}