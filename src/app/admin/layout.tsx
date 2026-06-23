"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid, FiHeart, FiFlag, FiCalendar,
  FiFileText, FiUsers, FiLogOut, FiChevronDown,
  FiPackage, FiDollarSign, FiMenu, FiX, FiShield,
} from "react-icons/fi";
import { useAdminStore } from "@/features/admin/store/admin.store";
import { Contact, FolderTree, ImageIcon } from "lucide-react";

const NAV = [
  // ───── OVERVIEW ─────
  { label: "Dashboard", href: "/admin/dashboard", icon: FiGrid },

  // ───── CORE ─────
  {
    label: "Campaigns",
    icon: FiFlag,
    children: [
      { label: "All Campaigns", href: "/admin/campaigns" },
      { label: "Analytics", href: "/admin/campaigns/analytics" },
    ],
  },

  { label: "Causes", href: "/admin/causes", icon: FiHeart },

  {
    label: "Donations",
    icon: FiDollarSign,
    children: [
      { label: "All Donations", href: "/admin/donations" },
      { label: "Top Donors", href: "/admin/top-donors" },
    ],
  },
  
  // { label: "Product Category", href: "/admin/product-categories", icon: FolderTree },


  { label: "Products", href: "/admin/products", icon: FiPackage },

  // ───── USERS & TRUST ─────
  { label: "Users", href: "/admin/users", icon: FiUsers },
  { label: "KYC Verification", href: "/admin/kyc", icon: FiShield },

  // -------NGO---------------------
    { label: "NGO Verification ", href: "/admin/ngos", icon: FiShield },

  // ───── CONTENT ─────
  { label: "Blogs", href: "/admin/blogs", icon: FiFileText },
  { label: "Events", href: "/admin/events", icon: FiCalendar },

  // ───── SUPPORT ─────
  { label: "Contact Queries", href: "/admin/contacts", icon: Contact },

  // ───── Volunteers Admin (optional upgrade) ─────
  { label: "Volunteers", href: "/admin/volunteer", icon: FiUsers },


// gallery
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },

];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const { admin, logoutAdmin } = useAdminStore();

  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

 
  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const firstLetter = admin?.email?.charAt(0)?.toUpperCase() || "A";

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!admin && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [admin, isLoginPage, router]);

   if (isLoginPage) {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100">
        <p className="text-sm sm:text-base font-bold text-gray-800">YOYO Foundation</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 sm:px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV.map((item) => {
          if (item.children) {
            const isGroupActive = item.children.some((c) => pathname === c.href);
            const isOpen = openGroup === item.label || isGroupActive;
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenGroup(isOpen ? null : item.label)}
                  className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition ${isGroupActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <item.icon size={14} />
                    {item.label}
                  </div>
                  <FiChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="ml-6 sm:ml-8 mt-0.5 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition ${pathname === child.href
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="mx-2 sm:mx-3 mb-3 p-3 sm:p-4 bg-[#D7ECF7] rounded-xl text-[#334E79]">
        <p className="text-[10px] sm:text-xs font-bold mb-1">YOYO Foundation<br />Just Got an Upgrade</p>
        <p className="text-[8px] sm:text-[10px] opacity-80 mb-2">Fresh, faster, and better tools for productivity</p>
        {/* <button className="w-full bg-[#334E79] text-[#FFFFFF] text-[10px] sm:text-xs font-semibold py-1.5 rounded-lg">
          Try the New Version
        </button> */}
      </div>

      {/* Logout */}
      {/* <div className="px-2 sm:px-3 pb-4 border-t border-gray-100 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
        >
          <FiLogOut size={14} />
          Logout
        </button>
      </div> */}
    </>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[220px] bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-40 shadow-sm overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-100 z-50 shadow-xl transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex justify-end p-3 border-b border-gray-100">
          <button onClick={() => setMobileMenuOpen(false)} className="p-1">
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-h-screen w-full lg:ml-[220px]">

        {/* Top bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gray-800">Dashboard</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                Hello {admin?.email?.split("@")[0]},
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">


            {/* Mobile search icon */}
            <button className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Admin avatar */}
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold">
              {firstLetter}
            </div>
            {/* <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-700">{admin?.email?.split("@")[0] || "Admin"}</p>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div> */}
            <div className="relative group">
              <div className="hidden sm:block cursor-pointer">
                <p className="text-xs font-semibold text-gray-700">
                  {admin?.email?.split("@")[0] || "Admin"}
                </p>
                <p className="text-[10px] text-gray-400">Admin</p>
              </div>

              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Page content */}
        <div className="p-3 sm:p-4 md:p-6">{children}</div>

        {/* Footer */}
        <div className="px-3 sm:px-4 md:px-6 py-4 border-t border-gray-100 bg-white text-[10px] sm:text-xs text-gray-400 flex flex-wrap justify-between gap-2">
          <span>Copyright © 2026 YOYO Foundation</span>
          <span className="flex flex-wrap gap-2 sm:gap-3">
            <span className="hidden sm:inline">·</span>
            Privacy Policy
            <span>·</span>
            Terms and conditions
            <span>·</span>
            Contact
          </span>
        </div>
      </main>
    </div>
  );
}