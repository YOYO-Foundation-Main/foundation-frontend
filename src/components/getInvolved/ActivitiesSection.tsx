import Image from "next/image";

export default function ActivitiesSection() {
  return (
    <section className="bg-[#F5F5F5] py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TOP TITLE */}
        <div className="mb-12 max-w-2xl">
          <p className="text-sm text-[#D2252B] mb-2">
            Our Activity
          </p>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-black">
            Explore The Wide Range Of Activities And Programs We're Leading to Drive Change For A Better Future
          </h2>
        </div>

        {/* CONTENT GRID */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT BIG IMAGE */}
          <div>
            <Image
              src="/assets/core1.jpg"
              alt="activity"
              width={600}
              height={400}
              className="rounded-xl object-cover w-full h-[320px] grayscale"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">

            {/* SMALL IMAGE */}
            <Image
              src="/assets/core1.jpg"
              alt="activity"
              width={400}
              height={300}
              className="rounded-xl object-cover w-full h-[200px]"
            />

            {/* TEXT */}
            <p className="text-sm text-gray-500 leading-relaxed">
              Our activities are designed to create long-lasting positive impacts in the communities we serve. Through a variety of innovative programs, partnerships, and direct initiatives, we aim to empower individuals, uplift families, and drive meaningful change.
              <br /><br />
              Join us as we work together to make the world a better place for all.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}