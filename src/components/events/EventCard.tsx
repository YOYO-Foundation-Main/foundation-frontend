import Image from "next/image";

interface Props {
  title: string;
  date: string;
  location: string;
  image: string | null;
  description?: string;
  cause?: string;
  size?: "large" | "small";
}

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

export default function EventCard({
  title,
  date,
  location,
  image,
  description,
  cause,
  size = "small",
}: Props) {
  const validImage = isValidUrl(image);

  return (
    <div className={`relative rounded-xl overflow-hidden group ${
      size === "large" ? "h-[420px]" : "h-[200px]"
    }`}>

      {/* Image or placeholder */}
      {validImage ? (
        <Image
          src={image as string}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        {cause && (
          <span className="text-xs bg-[#D2252B] px-2 py-0.5 rounded-full mb-2 inline-block">
            {cause}
          </span>
        )}
        <p className="text-xs mb-1 opacity-80">{date}</p>
        <h3 className="font-semibold text-sm md:text-base leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-xs mt-1 opacity-80">📍 {location}</p>
      </div>
    </div>
  );
}