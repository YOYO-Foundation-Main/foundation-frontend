"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiLogOut, FiUser, FiPlus } from "react-icons/fi"; // ✅ Added FiPlus
import useAuthModal from "@/features/auth/hooks/useAuthModal";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuthStore } from "@/features/auth/store/auth.store";
import CreateCampaignUserModal from "@/components/campaigns/CreateCampaignUserModal"; // ✅ Import your modal

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Volunteers", href: "/volunteer" },
  { label: "Events", href: "/events" },
];

export default function Navbar() {
  const { isOpen, openModal, closeModal } = useAuthModal();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // ✅ Modal state

  const profileRef = useRef<HTMLDivElement>(null);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "";

  // Scroll detection — navbar gets subtle bg on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-3 text-white">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <Image
                src="/assets/logo.png"
                alt="YOYO Foundation"
                width={48}
                height={48}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-sm tracking-widest text-white uppercase">YOYO</span>
              <span className="text-[10px] tracking-[0.2em] text-[#D2252B] uppercase font-medium">Foundation</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-md group ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {label}
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#D2252B] rounded-full transition-all duration-300 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* NOT LOGGED IN */}
            {!user && (
              <>
                <button
                  onClick={openModal}
                  className="hidden md:flex items-center gap-2 border border-white/30 hover:border-white px-5 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-all duration-200"
                >
                  Login
                </button>

                <button className="hidden md:flex items-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-red-900/30">
                  Donate
                </button>
              </>
            )}

            {/* LOGGED IN */}
            {user && (
              <>
                {/* ✅ CREATE CAMPAIGN BUTTON - Desktop */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="hidden md:flex items-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-red-900/30"
                >
                  <FiPlus size={14} />
                  Create Campaign
                </button>

                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#D2252B] flex items-center justify-center font-bold text-sm shadow-md">
                      {firstLetter}
                    </div>
                    <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    {/* Chevron */}
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-50">
                      {/* User info */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#D2252B] flex items-center justify-center font-bold text-white text-sm">
                            {firstLetter}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="py-1">
                        {/* ✅ CREATE CAMPAIGN in dropdown */}
                        <button
                          onClick={() => {
                            setShowCreateModal(true);
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
                        >
                          <FiPlus size={15} />
                          Create Campaign
                        </button>
                        <Link
  href="/profile"
  onClick={() => setProfileOpen(false)}
  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
>
  <FiUser size={15} />
  My Profile
</Link>
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-medium"
                        >
                          <FiLogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition"
            >
              <RxHamburgerMenu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[300px] bg-[#0a0a0a] border-l border-white/10 flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Image src="/assets/logo.png" alt="YOYO" width={36} height={36} />
              <div>
                <p className="text-xs font-bold tracking-widest text-white uppercase">YOYO</p>
                <p className="text-[9px] tracking-[0.2em] text-[#D2252B] uppercase">Foundation</p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <RxCross2 size={16} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
            {NAV_LINKS.map(({ label, href }, i) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#D2252B]/15 text-white border border-[#D2252B]/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D2252B]" />}
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="px-4 pb-8 pt-4 border-t border-white/10">
            {!user ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setMenuOpen(false); openModal(); }}
                  className="w-full border border-white/30 hover:border-white py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-all"
                >
                  Login
                </button>
                <button className="w-full bg-[#D2252B] hover:bg-[#b91c22] py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all">
                  Donate
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-full bg-[#D2252B] flex items-center justify-center font-bold text-white">
                    {firstLetter}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                {/* ✅ CREATE CAMPAIGN in mobile menu */}
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] py-2.5 rounded-full text-sm font-semibold transition-all"
                >
                  <FiPlus size={15} />
                  Create Campaign
                </button>
                
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 py-2.5 rounded-full text-sm font-medium transition-all"
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ CREATE CAMPAIGN MODAL */}
      <CreateCampaignUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* AUTH MODAL */}
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}