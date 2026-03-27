import Image from "next/image";

interface Props {
  title: string;
  date: string;
  location: string;
  image: string;
  size?: "large" | "small";
}

export default function EventCard({
  title,
  date,
  location,
  image,
  size = "small",
}: Props) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden group ${
        size === "large" ? "h-[420px]" : "h-[200px]"
      }`}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition duration-300"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="text-xs mb-1">{date}</p>

        <h3 className="font-semibold text-sm md:text-lg leading-snug">
          {title}
        </h3>

        <p className="text-xs mt-1 opacity-80">
          📍 {location}
        </p>
      </div>
    </div>
  );
}