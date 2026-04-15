import Image from "next/image";

const galleryImages = [
  "/assets/c1.jpg", "/assets/c2.jpg", "/assets/c3.jpg",
  "/assets/c1.jpg", "/assets/c2.jpg", "/assets/c3.jpg",
];

export default function GallerySection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-[#D2252B] text-xs font-bold tracking-[0.2em] uppercase mb-3">Our Work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black">Gallery</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {galleryImages.map((img, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl bg-gray-100 ${
              i === 0 ? "col-span-2 sm:col-span-1 h-[200px] sm:h-[280px]" : "h-[160px] sm:h-[280px]"
            }`}>
              <Image src={img} alt={`gallery-${i}`} fill
                className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}