import Image from "next/image";

export default function DonationGallery() {
  const images = [
    "/assets/d1.jpg",
    "/assets/d2.jpg",
    "/assets/d3.jpg",
    "/assets/d4.jpg",
  ];

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4 text-black">
        Donation Gallery
      </h3>

      <div className="grid grid-cols-2 gap-4 ">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt="gallery"
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-[160px]"
          />
        ))}
      </div>
    </div>
  );
}