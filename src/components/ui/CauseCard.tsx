"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  image: string | null | undefined;
  description: string;
}

// ✅ Check if URL is valid before passing to next/image
function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function CauseCard({ id, name, image, description }: Props) {
  const router = useRouter();

  const validImage = isValidUrl(image);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">

      {/* ✅ Only render Image if URL is valid, else show placeholder */}
      {validImage ? (
        <Image
          src={image as string}
          alt={name || "cause"}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}

      <div className="p-5">
        <h3 className="font-semibold text-lg text-black line-clamp-1">
          {name || "No Title"}
        </h3>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {description || "No description available"}
        </p>

        <button
          onClick={() => router.push(`/causes/${id}`)}
          className="mt-5 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-[#D2252B] transition"
        >
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
}