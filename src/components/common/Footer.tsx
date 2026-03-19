import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* LEFT SECTION */}
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-5">
           <Image
                       src="/assets/logo.png"
                       alt="YOYO Foundation"
                       width={70}
                       height={70}
                       className="object-contain"
                     />
            <h2 className="text-white font-semibold text-xl">
              YOYO Foundation
            </h2>
          </div>

          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            Tincidunt luctus porta amet lectus at ultricies nec sed non.
            Sed sit egestas enim consectetur donec faucibus...
          </p>

          <p className="text-sm mb-2">
            <span className="font-semibold text-white">Phone:</span>{" "}
            (610) 366-7883
          </p>

          <p className="text-sm">
            <span className="font-semibold text-white">Address:</span>{" "}
            8911 Tanglewood Ave. Capitol Heights, MD 20743
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-3 mt-6">
            <a className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D2252B] hover:text-white transition">
              <FaFacebookF size={14} />
            </a>

            <a className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D2252B] hover:text-white transition">
              <FaXTwitter size={14} />
            </a>

            <a className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D2252B] hover:text-white transition">
              <FaInstagram size={14} />
            </a>
          </div>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-lg">About Us</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="#" className="hover:text-white transition">Causes</Link></li>
            <li><Link href="#" className="hover:text-white transition">Volunteers</Link></li>
            <li><Link href="#" className="hover:text-white transition">Partners</Link></li>
            <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-lg">Useful Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:text-white transition">F.A.Q</Link></li>
            <li><Link href="#" className="hover:text-white transition">News</Link></li>
            <li><Link href="#" className="hover:text-white transition">Reports</Link></li>
            <li><Link href="#" className="hover:text-white transition">Terms of Use</Link></li>
            <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* CAUSES */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-lg">Causes</h3>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-16 bg-gray-700 rounded-md hover:scale-105 transition"
              />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        © Copyright YOYO Foundation 2026.
      </div>
    </footer>
  );
}