"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiLogOut, FiUser, FiPlus } from "react-icons/fi";
import useAuthModal from "@/features/auth/hooks/useAuthModal";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuthStore } from "@/features/auth/store/auth.store";
import CreateCampaignUserModal from "@/components/campaigns/CreateCampaignUserModal";

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "/about" },
  { label: "Campaigns",    href: "/campaigns" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Volunteers",   href: "/volunteer" },
  { label: "Events",       href: "/events" },
];

export default function Navbar() {
  const { isOpen, openModal, closeModal } = useAuthModal();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen]           = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [showCreateModal, setShowCreate]  = useState(false);
  const [mounted, setMounted]             = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isLoggedIn = mounted && !!user;

  return (
    <>
      <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black"
      }`}>
        <div className="max-w-7xl mx-auto h-[76px] flex items-center justify-between px-4 sm:px-6 lg:px-10 text-white">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/assets/mainlogo.png"
              alt="YOYO Foundation"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base tracking-[0.2em] text-white uppercase">YOYO</span>
              <span className="text-[11px] tracking-[0.25em] text-[#D2252B] uppercase font-semibold">Foundation</span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`relative px-4 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 rounded-md group ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}>
                  {label}
                  <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#D2252B] rounded-full transition-all duration-300 ${
                    isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
                  }`} />
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT ── */}
          <div className="flex items-center gap-2.5">

            {/* Not logged in */}
            {!isLoggedIn && (
              <>
                <button onClick={openModal}
                  className="hidden md:flex items-center border border-white/30 hover:border-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-200">
                  Login
                </button>
                <button className="hidden md:flex items-center bg-[#D2252B] hover:bg-[#b91c22] px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-900/30">
                  Donate
                </button>
              </>
            )}

            {/* Logged in */}
            {isLoggedIn && (
              <>
                <button onClick={() => setShowCreate(true)}
                  className="hidden md:flex items-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-red-900/30">
                  <FiPlus size={15} /> Create Campaign
                </button>

                <div ref={profileRef} className="relative hidden md:block">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#D2252B] flex items-center justify-center font-bold text-sm shadow-md">
                      {firstLetter}
                    </div>
                    <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate hidden lg:block">{user!.name}</span>
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-50">
                      <div className="px-4 py-3.5 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#D2252B] flex items-center justify-center font-bold text-white text-sm">
                            {firstLetter}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user!.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user!.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1.5">
                        <button onClick={() => { setShowCreate(true); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#D2252B] hover:bg-red-50 transition font-medium">
                          <FiPlus size={15} /> Create Campaign
                        </button>
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
                          <FiUser size={15} /> My Profile
                        </Link>
                        <button onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-medium">
                          <FiLogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(true)}
              className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition">
              <RxHamburgerMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-300 ${
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

        <div className={`absolute right-0 top-0 h-full w-[300px] bg-[#0a0a0a] border-l border-white/10 flex flex-col transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
              <Image src="/assets/logo.png" alt="YOYO" width={42} height={42} />
              <div>
                <p className="text-sm font-black tracking-[0.2em] text-white uppercase">YOYO</p>
                <p className="text-[10px] tracking-[0.2em] text-[#D2252B] uppercase font-semibold">Foundation</p>
              </div>
            </Link>
            <button onClick={() => setMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition">
              <RxCross2 size={17} />
            </button>
          </div>

          <nav className="flex flex-col px-4 py-5 gap-1 flex-1 overflow-y-auto">
            {NAV_LINKS.map(({ label, href }, i) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-[#D2252B]/15 text-white border border-[#D2252B]/30" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D2252B] shrink-0" />}
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-8 pt-4 border-t border-white/10 space-y-3">
            {!isLoggedIn ? (
              <>
                <button onClick={() => { setMenuOpen(false); openModal(); }}
                  className="w-full border border-white/30 hover:border-white py-2.5 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all">
                  Login
                </button>
                <button className="w-full bg-[#D2252B] hover:bg-[#b91c22] py-2.5 rounded-full text-sm font-semibold transition-all">
                  Donate
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#D2252B] flex items-center justify-center font-bold text-white shrink-0">
                    {firstLetter}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{user!.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user!.email}</p>
                  </div>
                </div>
                <button onClick={() => { setShowCreate(true); setMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] py-2.5 rounded-full text-sm font-semibold transition-all">
                  <FiPlus size={15} /> Create Campaign
                </button>
                <Link href="/profile" onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border border-white/20 text-gray-300 hover:bg-white/10 py-2.5 rounded-full text-sm font-medium transition-all">
                  <FiUser size={15} /> My Profile
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 py-2.5 rounded-full text-sm font-medium transition-all">
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <CreateCampaignUserModal isOpen={showCreateModal} onClose={() => setShowCreate(false)} />
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}