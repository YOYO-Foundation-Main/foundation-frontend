"use client";
import Image from "next/image";
import Link from "next/link";
import useAuthModal from "@/features/auth/hooks/useAuthModal";
import AuthModal from "@/features/auth/components/AuthModal";

export default function Navbar() {
  const { isOpen, openModal, closeModal } = useAuthModal();
  return (
    <>
      <header className="w-full absolute top-0 left-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 text-white">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="YOYO Foundation"
              width={70}
              height={70}
            />
            <span className="font-semibold text-base">
              YOYO Foundation
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            
            <Link href="/campaigns">Campaigns</Link>
            <Link href="/get-involved">Get Involved</Link>
            <Link href="/">Events</Link>
            <Link href="/">Success Story</Link>
            <Link href="/">Pages</Link>


            {/* <Link href="/causes">Causes</Link> */}
            {/* <Link href="/impact">Impact</Link> */}
            
            {/* <Link href="/contact">Contact Us</Link> */}
          </nav>

          {/* Buttons */}
          <div className="flex gap-4">

            {/* LOGIN BUTTON */}
            <button
              onClick={openModal}
              className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition cursor-pointer"
            >
              LOGIN
            </button>

            {/* Donate */}
            <button className="bg-[#D2252B] px-6 py-2 rounded-full">
              DONATE
            </button>
          </div>
        </div>
      </header>
      {/* MODAL */}
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}