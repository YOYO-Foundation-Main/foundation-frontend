import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  id: number;
  title: string;
  date: string;
  image: string;
  description: string;
}

export default function BlogCard({ id, title, date, image, description }: Props) {
  return (
    <Link href={`/blog/${id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">

        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="p-5">
          <p className="text-gray-400 text-xs mb-2">{date}</p>

          <h3 className="font-semibold text-lg text-black mb-2 line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-500 text-sm mb-4 line-clamp-3">
            {description}
          </p>

          <span className="flex items-center gap-2 text-sm font-medium text-black group-hover:text-[#D2252B] transition">
            READ MORE
            <FaArrowRight className="text-[#D2252B] text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}