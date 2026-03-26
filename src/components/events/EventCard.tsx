import Image from "next/image";

interface Props {
  image: string;
  title: string;
  date: string;
  location: string;
  large?: boolean;
}

export default function EventCard({
  image,
  title,
  date,
  location,
  large = false,
}: Props) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${
        large ? "h-[420px]" : "h-[200px]"
      }`}
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="text-xs mb-1">{date}</p>

        <h3 className="font-semibold text-sm md:text-base leading-snug">
          {title}
        </h3>

        <p className="text-xs mt-1 opacity-80">
          📍 {location}
        </p>
      </div>
    </div>
  );
}