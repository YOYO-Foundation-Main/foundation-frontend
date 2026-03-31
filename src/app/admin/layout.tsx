"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid, FiHeart, FiFlag, FiCalendar,
  FiFileText, FiUsers, FiLogOut, FiChevronDown,
  FiBarChart2, FiDollarSign, FiInbox,
} from "react-icons/fi";
import { useAdminStore } from "@/features/admin/store/admin.store";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: FiGrid },
  { label: "Causes", href: "/admin/causes", icon: FiHeart },
  {
    label: "Campaigns", icon: FiFlag,
    children: [
      { label: "Analytics", href: "/admin/campaigns/analytics" },
      { label: "Campaigns", href: "/admin/campaigns" },
    ],
  },
  { label: "Events", href: "/admin/events", icon: FiCalendar },
  { label: "Donations", href: "/admin/donations", icon: FiDollarSign },
  { label: "Blogs", href: "/admin/blogs", icon: FiFileText },
  { label: "Users", href: "/admin/users", icon: FiUsers },
  { label: "Financials", href: "/admin/financials", icon: FiBarChart2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logoutAdmin } = useAdminStore();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const firstLetter = admin?.email?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">

      {/* SIDEBAR */}
      <aside className="w-[220px] bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-full z-40 shadow-sm">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-base font-bold text-gray-800">YOYO Foundation</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV.map((item) => {
            if (item.children) {
              const isGroupActive = item.children.some((c) => pathname === c.href);
              const isOpen = openGroup === item.label || isGroupActive;
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isGroupActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} />
                      {item.label}
                    </div>
                    <FiChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="ml-8 mt-0.5 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition ${
                            pathname === child.href
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade banner */}
        <div className="mx-3 mb-3 p-4 bg-blue-600 rounded-xl text-white">
          <p className="text-xs font-bold mb-1">YOYO Foundation<br />Just Got an Upgrade</p>
          <p className="text-[10px] opacity-80 mb-2">Fresh, faster, and better tools for productivity</p>
          <button className="w-full bg-white text-blue-600 text-xs font-semibold py-1.5 rounded-lg">
            Try the New Version
          </button>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-gray-100 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[220px] flex-1 min-h-screen">

        {/* Top bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
            <p className="text-xs text-gray-400">Hello {admin?.email?.split("@")[0]}, Good Morning!</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-400 w-48">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search anything
            </div>

            {/* Admin avatar */}
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold">
              {firstLetter}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-gray-700">{admin?.email?.split("@")[0] || "Admin"}</p>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white text-xs text-gray-400 flex justify-between">
          <span>Copyright © 2026 YOYO Foundation · Privacy Policy · Terms and conditions · Contact</span>
        </div>
      </main>
    </div>
  );
}