"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isValidUrl } from "@/utils/url";

interface Props {
  id: string;
  name: string;
  image: string | null | undefined;
  description: string;
}

// function isValidUrl(url: string | null | undefined): boolean {
//   if (!url) return false;
//   try { new URL(url); return true; } catch { return false; }
// }

export default function CauseCard({ id, name, image, description }: Props) {
  const router = useRouter();
  const validImage = isValidUrl(image);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 group">
      <div className="relative w-full h-48 sm:h-52 overflow-hidden">
        {validImage ? (
          <Image src={image as string} alt={name || "cause"} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-base sm:text-lg text-black line-clamp-1">{name || "No Title"}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{description || "No description available"}</p>
        <button onClick={() => router.push(`/causes/${id}`)}
          className="mt-5 w-full bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#D2252B] transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
}