import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full absolute top-0 left-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 text-white">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="YOYO Foundation"
            width={70}
            height={70}
            className="object-contain"
          />
          <span className="font-semibold text-base">
            YOYO Foundation
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/causes" className="hover:text-gray-300 transition">
            Causes
          </Link>
          <Link href="/impact" className="hover:text-gray-300 transition">
            Impact
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contact Us
          </Link>
        </nav>

        {/* Donate Button */}
        <button className="bg-[#D2252B] hover:bg-[#b91f24] px-6 py-2 rounded-full text-sm font-semibold transition">
          DONATE
        </button>
      </div>
    </header>
  );
}