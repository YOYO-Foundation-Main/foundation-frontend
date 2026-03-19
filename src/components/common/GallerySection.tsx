import Image from "next/image";

const galleryImages = [
  "/assets/c1.jpg",
  "/assets/c2.jpg",
  "/assets/c3.jpg",
  "/assets/c1.jpg",
  "/assets/c2.jpg",
  "/assets/c3.jpg",
];

export default function GallerySection() {
  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-black text-center mb-12">
          Our Gallery
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="relative w-full h-[240px] rounded-xl overflow-hidden"
            >
              <Image
                src={img}
                alt={`gallery-${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}