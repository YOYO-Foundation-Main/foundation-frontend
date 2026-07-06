// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
// import { FiLogOut, FiUser, FiPlus } from "react-icons/fi";
// import useAuthModal from "@/features/auth/hooks/useAuthModal";
// import AuthModal from "@/features/auth/components/AuthModal";
// import { useAuthStore } from "@/features/auth/store/auth.store";
// import CreateCampaignUserModal from "@/components/campaigns/CreateCampaignUserModal";

// const NAV_LINKS = [
//   { label: "Home", href: "/" },
//   { label: "About Us", href: "/about" },
//   { label: "Campaigns", href: "/campaigns" },
//   { label: "Get Involved", href: "/get-involved" },
//   { label: "Volunteers", href: "/volunteer" },
//   { label: "Events", href: "/events" },
// ];

// export default function Navbar() {
//   const { isOpen, openLogin, openSignup, closeModal } = useAuthModal(); 
//   const { user, logout } = useAuthStore();
//   const pathname = usePathname();
//   const router = useRouter();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [showCreateModal, setShowCreate] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // ✅ NEW: logout modal state
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const profileRef = useRef<HTMLDivElement>(null);

//   const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "";

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   useEffect(() => {
//     const fn = (e: MouseEvent) => {
//       if (profileRef.current && !profileRef.current.contains(e.target as Node))
//         setProfileOpen(false);
//     };
//     document.addEventListener("mousedown", fn);
//     return () => document.removeEventListener("mousedown", fn);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [menuOpen]);

//   const isLoggedIn = mounted && !!user;

//   // ❌ REMOVED alert-based logout
//   // ✅ NEW: modal-based logout
//   const confirmLogout = () => {
//     logout();
//     setShowLogoutModal(false);
//     setProfileOpen(false);
//     setMenuOpen(false);
//     router.push("/");
//   };

//   return (
//     <>
//       <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black"
//         }`}>
//         <div className="max-w-7xl mx-auto h-[76px] flex items-center justify-between px-4 sm:px-6 lg:px-10 text-white">

//           {/* ── LOGO ── */}
//           <Link href="/" className="flex items-center gap-3 group shrink-0">
//             <Image
//               src="/assets/newlogo.png"
//               alt="YOYO Foundation"
//               width={32}
//               height={32}
//               className="transition-transform duration-300 group-hover:scale-105"
//             />
//             <div className="flex flex-col leading-tight">
//               <span className="font-black text-base tracking-[0.2em] text-white uppercase">YOYO</span>
//               <span className="text-[11px] tracking-[0.25em] text-[#D2252B] uppercase font-semibold">Foundation</span>
//             </div>
//           </Link>

//           {/* ── DESKTOP NAV ── */}
//           <nav className="hidden xl:flex items-center gap-0.5">
//             {NAV_LINKS.map(({ label, href }) => {
//               const isActive = pathname === href;
//               return (
//                 <Link key={href} href={href}
//                   className={`relative px-4 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 rounded-md group ${isActive ? "text-white" : "text-gray-400 hover:text-white"
//                     }`}>
//                   {label}
//                   <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#D2252B] rounded-full transition-all duration-300 ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
//                     }`} />
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* ── RIGHT ── */}
//           <div className="flex items-center gap-2.5">

//             {!isLoggedIn && (
//               <>
//                 <button onClick={openLogin}
//                   className="hidden md:flex items-center border border-white/30 hover:border-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-200">
//                   Sign In
//                 </button>
//                 <button className="hidden md:flex items-center bg-[#D2252B] hover:bg-[#b91c22] px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-900/30">
//                   Donate
//                 </button>
//               </>
//             )}

//             {isLoggedIn && (
//               <>
//                 <button onClick={() => setShowCreate(true)}
//                   className="hidden md:flex items-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-red-900/30">
//                   <FiPlus size={15} /> Create Campaign
//                 </button>

//                 <div ref={profileRef} className="relative hidden md:block">
//                   <button onClick={() => setProfileOpen(!profileOpen)}
//                     className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">

//                     {/* ✅ PROFILE IMAGE SUPPORT */}
//                     <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D2252B] flex items-center justify-center font-bold text-sm shadow-md">
//                       {user?.profileImage ? (
//                         <img
//                           src={user.profileImage}
//                           alt="profile"
//                           className="w-full h-full object-cover"
//                           onError={(e) => (e.currentTarget.style.display = "none")}
//                         />
//                       ) : (
//                         firstLetter
//                       )}
//                     </div>

//                     <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate hidden lg:block">{user!.name}</span>
//                     <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
//                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>

//                   {profileOpen && (
//                     <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-50">
//                       <div className="px-4 py-3.5 bg-gray-50 border-b border-gray-100">
//                         <div className="flex items-center gap-3">

//                           {/* ✅ PROFILE IMAGE HERE ALSO */}
//                           <div className="w-10 h-10 rounded-full overflow-hidden bg-[#D2252B] flex items-center justify-center font-bold text-white text-sm">
//                             {user?.profileImage ? (
//                               <img
//                                 src={user.profileImage}
//                                 alt="profile"
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => (e.currentTarget.style.display = "none")}
//                               />
//                             ) : (
//                               firstLetter
//                             )}
//                           </div>

//                           <div className="overflow-hidden">
//                             <p className="text-sm font-semibold text-gray-800 truncate">{user!.name}</p>
//                             <p className="text-xs text-gray-400 truncate">{user!.email}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="py-1.5">
//                         <button onClick={() => { setShowCreate(true); setProfileOpen(false); }}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#D2252B] hover:bg-red-50 transition font-medium">
//                           <FiPlus size={15} /> Create Campaign
//                         </button>

//                         <Link href="/profile" onClick={() => setProfileOpen(false)}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
//                           <FiUser size={15} /> My Profile
//                         </Link>

//                         <Link
//                           href="/profile?tab=fundraisers"
//                           onClick={() => setProfileOpen(false)}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
//                         >
//                           <FiUser size={15} /> My Fundraisers

//                         </Link>

//                         {/* ✅ TRIGGER MODAL */}
//                         <button
//                           onClick={() => setShowLogoutModal(true)}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-medium">
//                           <FiLogOut size={15} /> Sign Out
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* ── MOBILE DRAWER ── */}
//             <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//               }`}>
//               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

//               <div className={`absolute right-0 top-0 h-full w-[300px] bg-[#0a0a0a] border-l border-white/10 flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
//                 }`}>

//                 {/* HEADER */}
//                 <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
//                   <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
//                     <Image src="/assets/logo.png" alt="YOYO" width={42} height={42} />
//                     <div>
//                       <p className="text-sm font-black tracking-[0.2em] text-white uppercase">YOYO</p>
//                       <p className="text-[10px] tracking-[0.2em] text-[#D2252B] uppercase font-semibold">Foundation</p>
//                     </div>
//                   </Link>

//                   <button
//                     onClick={() => setMenuOpen(false)}
//                     className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
//                   >
//                     <RxCross2 size={17} />
//                   </button>
//                 </div>

//                 {/* NAV */}
//                 <nav className="flex flex-col px-4 py-5 gap-1 flex-1 overflow-y-auto">
//                   {NAV_LINKS.map(({ label, href }) => {
//                     const isActive = pathname === href;
//                     return (
//                       <Link
//                         key={href}
//                         href={href}
//                         onClick={() => setMenuOpen(false)}
//                         className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${isActive
//                           ? "bg-[#D2252B]/15 text-white border border-[#D2252B]/30"
//                           : "text-gray-400 hover:text-white hover:bg-white/5"
//                           }`}
//                       >
//                         {label}
//                       </Link>
//                     );
//                   })}
//                 </nav>

//                 {/* USER SECTION */}
//                 <div className="px-4 pb-8 pt-4 border-t border-white/10 space-y-3">
//                   {!isLoggedIn ? (
//                     <>
//                       <button
//                         onClick={() => { setMenuOpen(false); openLogin(); }}
//                         className="w-full border border-white/30 py-2.5 rounded-full text-sm hover:bg-white hover:text-black"
//                       >
//                         Sign In
//                       </button>

//                       <button className="w-full bg-[#D2252B] py-2.5 rounded-full text-sm font-semibold">
//                         Donate
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {/* PROFILE */}
//                       <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
//                         <div className="w-10 h-10 rounded-full overflow-hidden bg-[#D2252B] flex items-center justify-center">
//                           {user?.profileImage ? (
//                             <img
//                               src={user.profileImage}
//                               alt="profile"
//                               className="w-full h-full object-cover"
//                               onError={(e) => (e.currentTarget.style.display = "none")}
//                             />
//                           ) : (
//                             firstLetter
//                           )}
//                         </div>

//                         <div className="overflow-hidden">
//                           <p className="text-sm font-semibold text-white truncate">{user!.name}</p>
//                           <p className="text-xs text-gray-500 truncate">{user!.email}</p>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => { setShowCreate(true); setMenuOpen(false); }}
//                         className="w-full bg-[#D2252B] py-2.5 rounded-full text-sm font-semibold"
//                       >
//                         Create Campaign
//                       </button>

//                       <Link
//                         href="/profile"
//                         onClick={() => setMenuOpen(false)}
//                         className="w-full text-center border py-2.5 rounded-full text-sm"
//                       >
//                         My Profile
//                       </Link>

//                       <Link
//                         href="/profile?tab=fundraisers"
//                         onClick={() => setMenuOpen(false)}
//                         className="w-full text-center border py-2.5 rounded-full text-sm"
//                       >
//                         My Fundraisers
//                       </Link>

//                       <button
//                         onClick={() => {
//                           setMenuOpen(false);
//                           setShowLogoutModal(true);
//                         }}
//                         className="w-full border border-red-500 text-red-400 py-2.5 rounded-full text-sm"
//                       >
//                         Sign out
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Hamburger */}
//             <button onClick={() => setMenuOpen(true)}
//               className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition">
//               <RxHamburgerMenu size={20} />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ── LOGOUT MODAL ── */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

//           <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 text-center animate-in fade-in zoom-in-95">

//             {/* ICON */}
//             <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
//               <FiLogOut className="text-red-500" size={22} />
//             </div>

//             {/* TITLE */}
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
//               Sign out of your account?
//             </h2>

//             {/* DESCRIPTION */}
//             <p className="text-sm text-gray-500 mt-2 leading-relaxed">
//               You’ll need to sign in again to access your campaigns and profile.
//             </p>

//             {/* ACTIONS */}
//             <div className="mt-6 flex flex-col sm:flex-row gap-3">

//               {/* CANCEL */}
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 className="w-full sm:w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition"
//               >
//                 Stay Logged In
//               </button>

//               {/* LOGOUT */}
//               <button
//                 onClick={confirmLogout}
//                 className="w-full sm:w-1/2 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md shadow-red-200"
//               >
//                 Yes, Sign Out
//               </button>

//             </div>
//           </div>
//         </div>
//       )}
//       <CreateCampaignUserModal isOpen={showCreateModal} onClose={() => setShowCreate(false)} />
//       <AuthModal isOpen={isOpen} onClose={closeModal} />
//     </>
//   );
// }


// new navbar

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiLogOut, FiUser, FiPlus, FiHeart, FiChevronDown } from "react-icons/fi";
import { MdCampaign } from "react-icons/md";
import useAuthModal from "@/features/auth/hooks/useAuthModal";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuthStore } from "@/features/auth/store/auth.store";
import CreateCampaignUserModal from "@/components/campaigns/CreateCampaignForm";

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Volunteers", href: "/volunteer" },
  { label: "Events", href: "/events" },
];

// ─── Avatar helper ────────────────────────────────────────────────────────────

function Avatar({
  src, fallback, size = "sm",
}: { src?: string | null; fallback: string; size?: "sm" | "md" | "lg" }) {
  const [err, setErr] = useState(false);
  const dim = size === "lg" ? "w-12 h-12 text-lg" : size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-sm";
  return (
    <div className={`${dim} rounded-full overflow-hidden bg-gradient-to-br from-[#D2252B] to-[#a01c21] flex items-center justify-center font-extrabold text-white shrink-0 shadow-md`}>
      {src && !err
        ? <img src={src} alt="avatar" className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span>{fallback}</span>
      }
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { isOpen, mode, openLogin, openSignup, closeModal } = useAuthModal();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // const [showCreateModal, setShowCreate] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogout] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isLoggedIn = mounted && !!user;

  const confirmLogout = () => {
    logout();
    setShowLogout(false);
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-black/95 backdrop-blur-md shadow-[0_2px_24px_0_rgba(0,0,0,0.4)]"
        : "bg-black"
        }`}>
        <div className="max-w-7xl mx-auto h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-10 text-white">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 relative">
              <Image
                src="/assets/newlogo.png"
                alt="YOYO Foundation"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-[15px] tracking-[0.22em] text-white uppercase">YOYO</span>
              <span className="text-[10px] tracking-[0.28em] text-[#D2252B] uppercase font-bold">Foundation</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden xl:flex items-center">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 rounded-lg group ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                >
                  {label}
                  {/* Active underline */}
                  <span className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#D2252B] rounded-full transition-all duration-300 ${isActive
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
                    }`} />
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">

            {/* Guest */}
            {!isLoggedIn && (
              <>
                <button
                  onClick={openLogin}
                  className="hidden md:flex items-center gap-2 border border-white/25 hover:border-white/60 px-4 py-2 rounded-full text-[13px] font-medium hover:bg-white hover:text-black transition-all duration-200"
                >
                  Sign In
                </button>
                <button className="hidden md:flex items-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 shadow-lg shadow-red-900/30">
                  <FiHeart size={13} /> Donate
                </button>
              </>
            )}

            {/* Logged in */}

            {/* Create Campaign CTA */}
            <button
              onClick={() => router.push("/startcampaign")}
              className="hidden md:flex items-center gap-2 bg-[#D2252B] hover:bg-[#b91c22] px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 shadow-lg shadow-red-900/30 whitespace-nowrap"
            >
              <FiPlus size={14} />
              <span className="hidden lg:inline">Create Campaign</span>
              <span className="lg:hidden">Create</span>
            </button>
            {isLoggedIn && (
              <>
                {/* Profile dropdown */}
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-200 ${profileOpen
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <Avatar src={user?.profileImage} fallback={firstLetter} size="sm" />
                    <span className="text-[13px] font-medium text-gray-200 max-w-[110px] truncate hidden lg:block">
                      {user!.name}
                    </span>
                    <FiChevronDown
                      size={13}
                      className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                      {/* User info */}
                      <div className="px-4 py-3.5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Avatar src={user?.profileImage} fallback={firstLetter} size="md" />
                          <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-gray-900 truncate">{user!.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{user!.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}

                      <div className="py-1.5">
                        <button
                          onClick={() => { router.push("/startcampaign"); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#D2252B] hover:bg-red-50 transition-colors font-semibold"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                            <FiPlus size={14} className="text-[#D2252B]" />
                          </div>
                          Create Campaign
                        </button>

                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FiUser size={13} className="text-gray-500" />
                          </div>
                          My Profile
                        </Link>

                        <Link
                          href="/profile?tab=fundraisers"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                            <MdCampaign size={13} className="text-gray-500" />
                          </div>
                          My Fundraisers
                        </Link>

                        <div className="mx-3 my-1.5 border-t border-gray-100" />

                        <button
                          onClick={() => { setShowLogout(true); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                            <FiLogOut size={13} className="text-red-500" />
                          </div>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="xl:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all"
              aria-label="Open menu"
            >
              <RxHamburgerMenu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════ MOBILE DRAWER ══════════════════════ */}
      <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div className={`absolute right-0 top-0 h-full w-[290px] sm:w-[320px] bg-[#0c0c0c] border-l border-white/10 flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}>

          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-white/10 shrink-0">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="w-7 h-7 relative">
                <Image src="/assets/newlogo.png" alt="YOYO" fill className="object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-black tracking-[0.22em] text-white uppercase">YOYO</span>
                <span className="text-[9px] tracking-[0.25em] text-[#D2252B] uppercase font-bold">Foundation</span>
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Close menu"
            >
              <RxCross2 size={15} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* User info (logged in only) */}
            {isLoggedIn && (
              <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Avatar src={user?.profileImage} fallback={firstLetter} size="md" />
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold text-white truncate">{user!.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user!.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex flex-col px-4 pt-4 pb-2 gap-1">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? "bg-[#D2252B]/15 text-white border border-[#D2252B]/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {isActive && <span className="w-1 h-4 bg-[#D2252B] rounded-full mr-3" />}
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Drawer footer — auth actions */}
          <div className="px-4 pb-8 pt-4 border-t border-white/10 space-y-2.5 shrink-0">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => { setMenuOpen(false); openLogin(); }}
                  className="w-full border border-white/25 hover:bg-white hover:text-black py-3 rounded-xl text-sm font-medium transition-all"
                >
                  Sign In
                </button>
                <button className="w-full bg-[#D2252B] hover:bg-[#b91c22] py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                  <FiHeart size={14} /> Donate Now
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    router.push("/startcampaign");
                    setMenuOpen(false);
                  }}
                  className="w-full bg-[#D2252B] hover:bg-[#b91c22] py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <FiPlus size={14} /> Create Campaign
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 border border-white/15 hover:bg-white/10 py-2.5 rounded-xl text-xs font-medium text-gray-300 transition-all"
                  >
                    <FiUser size={13} /> My Profile
                  </Link>
                  <Link
                    href="/profile?tab=fundraisers"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 border border-white/15 hover:bg-white/10 py-2.5 rounded-xl text-xs font-medium text-gray-300 transition-all"
                  >
                    <MdCampaign size={13} /> Fundraisers
                  </Link>
                </div>

                <button
                  onClick={() => { setMenuOpen(false); setShowLogout(true); }}
                  className="w-full border border-red-500/40 text-red-400 hover:bg-red-500/10 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <FiLogOut size={13} /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════ LOGOUT MODAL ══════════════════════ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center">

            {/* Icon */}
            <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <FiLogOut className="text-red-500" size={22} />
            </div>

            <h2 className="text-lg font-extrabold text-gray-900 mb-2">
              Sign out?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              You'll need to sign in again to access your campaigns and profile.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Stay Logged In
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-xl bg-[#D2252B] text-white text-sm font-bold hover:bg-[#b51e23] transition shadow-lg shadow-red-200"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <>
        {/* <CreateCampaignUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreate(false)}
        /> */}

        <AuthModal
          isOpen={isOpen}
          onClose={closeModal}
          initialStep={mode}
        />
      </>
    </>
  );
}
