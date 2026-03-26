"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useAuthModal from "@/features/auth/hooks/useAuthModal";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuthStore } from "@/features/auth/store/auth.store";



export default function Navbar() {
  const { isOpen, openModal, closeModal } = useAuthModal();
  const { user, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ first letter
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "";

  return (
    <>
      <header className="w-full absolute top-0 left-0 z-50  bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4 text-white">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="YOYO Foundation"
              width={60}
              height={60}
            />
            <span className="font-semibold text-sm md:text-base">
              YOYO Foundation
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/campaigns">Campaigns</Link>
            <Link href="/get-involved">Get Involved</Link>
            <Link href="/volunteers">Volunteers</Link>
            <Link href="/events">Events</Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* ✅ IF NOT LOGGED IN */}
            {!user && (
              <>
                <button
                  onClick={openModal}
                  className="hidden md:block border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
                >
                  LOGIN
                </button>

                <button className="hidden md:block bg-[#D2252B] px-6 py-2 rounded-full">
                  DONATE
                </button>
              </>
            )}

            {/* ✅ IF LOGGED IN */}
            {user && (
              <div className="relative">
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-[#D2252B] flex items-center justify-center font-bold cursor-pointer"
                >
                  {firstLetter}
                </div>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                    
                    <div className="px-4 py-2 border-b text-sm font-medium">
                      {user.name}
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col p-6 text-white">

            <div className="flex justify-end">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-3xl"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-6 mt-10 text-lg font-medium">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link href="/campaigns" onClick={() => setMenuOpen(false)}>Campaigns</Link>
              <Link href="/get-involved" onClick={() => setMenuOpen(false)}>Get Involved</Link>
              <Link href="/volunteers" onClick={() => setMenuOpen(false)}>Volunteers</Link>
              <Link href="/" onClick={() => setMenuOpen(false)}>Events</Link>
            </nav>

            {/* MOBILE ACTION */}
            {!user ? (
              <div className="mt-10 flex flex-col gap-4">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openModal();
                  }}
                  className="border border-white py-3 rounded-full"
                >
                  LOGIN
                </button>

                <button className="bg-[#D2252B] py-3 rounded-full">
                  DONATE
                </button>
              </div>
            ) : (
              <div className="mt-10 flex flex-col gap-4">
                <div className="text-lg">Hi, {user.name}</div>

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="border border-white py-3 rounded-full"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* AUTH MODAL */}
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}