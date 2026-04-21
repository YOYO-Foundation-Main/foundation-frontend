import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { isValidUrl } from "@/utils/url";

interface Props {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string | null;
  description?: string;
  cause?: string;
  featured?: boolean; // big featured card (first event)
}

// function isValidUrl(url: string | null | undefined): boolean {
//   if (!url) return false;
//   try { new URL(url); return true; } catch { return false; }
// }

export default function EventCard({
  id, title, date, location, image, description, cause, featured = false,
}: Props) {
  const validImage = isValidUrl(image);

  if (featured) {
    // ── Big featured card (left column) ──────────────────────────────────────
    return (
      <Link href={`/events/${id}`} className="block group">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition h-full">

          {/* Image */}
          <div className="relative h-64 md:h-auto bg-gray-200 overflow-hidden">
            {validImage ? (
              <Image src={image!} alt={title} fill className="object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
            )}
            {cause && (
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-[#D2252B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {cause}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#D2252B] text-xs font-semibold mb-3">
                <FiCalendar size={12} />
                {date}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-[#D2252B] transition">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiMapPin size={13} className="text-gray-400 shrink-0" />
                {location}
              </div>
            </div>

            <button className="mt-6 w-full bg-[#D2252B] hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-xl transition">
              Register Now
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ── Regular card ────────────────────────────────────────────────────────────
  return (
    <Link href={`/events/${id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition">

        {/* Image */}
        <div className="relative h-44 bg-gray-200 overflow-hidden">
          {validImage ? (
            <Image src={image!} alt={title} fill className="object-cover group-hover:scale-105 transition duration-300" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
          )}
          {cause && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#D2252B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {cause}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[#D2252B] text-xs font-semibold mb-1.5">{date}</p>
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#D2252B] transition">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{description}</p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FiMapPin size={11} /> {location}
            </div>
            <span className="text-xs font-semibold text-[#D2252B] hover:underline">Register →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}