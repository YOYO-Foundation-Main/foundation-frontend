import Image from "next/image";

export default function GallerySection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6">

        {/* LEFT BIG IMAGE */}
        <Image
          src="/assets/p1.jpg"
          alt="gallery"
          width={800}
          height={400}
          className="col-span-1 h-[260px] md:h-[320px] w-full object-cover rounded-xl"
        />

        {/* RIGHT TOP IMAGE */}
        <Image
          src="/assets/p2.jpg"
          alt="gallery"
          width={400}
          height={300}
          className="h-[260px] md:h-[320px] w-full object-cover rounded-xl"
        />

        {/* LEFT BOTTOM IMAGE */}
        <Image
          src="/assets/p3.jpg"
          alt="gallery"
          width={400}
          height={300}
          className="h-[220px] md:h-[260px] w-full object-cover rounded-xl"
        />

        {/* RIGHT BIG IMAGE */}
        <Image
          src="/assets/p4.jpg"
          alt="gallery"
          width={800}
          height={400}
          className="col-span-1 h-[220px] md:h-[260px] w-full object-cover rounded-xl"
        />

      </div>
    </section>
  );
}