
"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/features/admin/store/admin.store";
import {
  adminLogout,
} from "@/features/admin/api/admin.api";
import {
  FiGrid,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiShield,
  FiChevronDown,
  FiTarget,
} from "react-icons/fi";
import { FaRupeeSign,FaHandHoldingHeart} from "react-icons/fa";
// import { LuBuildingIcon } from "lucide-react";

const NAV = [
  {
    label: "Dashboard",
    href: "/admin/super/dashboard",
    icon: FiGrid,
  },
  {
    label: "Admin Management",
    href: "/admin/super/admins",
    icon: FiShield,
  },
  // {
  //   label: "Finance",
  //   href: "/admin/super/finance",
  //   icon: FiDollarSign,
  // },
  {
    label: "Finance",
    icon: FaRupeeSign,
    children: [
      {
        label: "Overview",
        href: "/admin/super/finance",
      },
      {
        label: "Revenue Trend",
        href: "/admin/super/finance/revenue",
      },
      {
        label: "Platform Income Trend",
        href: "/admin/super/finance/platform",
      },
      {
        label: "Donations",
        href: "/admin/super/finance/donations",
      },
    ],
  },
  {
    label: "NGOs",
    href: "/admin/super/ngos",
    icon: FaHandHoldingHeart,
  },
  {
    label: "Campaigns",
    icon: FiTarget,
    children: [
      {
        label: "Overview",
        href: "/admin/super/campaigns",
      },
    ]
  },
  {
    label: "Users",
    href: "/admin/super/users",
    icon: FiUsers,
  },
  {
    label: "Platform Settings",
    href: "/admin/super/settings",
    icon: FiSettings,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logoutAdmin } = useAdminStore();
  // console.log("SUPER LAYOUT ADMIN:", admin);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const expanded: Record<string, boolean> = {};

    NAV.forEach((item) => {
      if (
        item.children?.some((child) => pathname.startsWith(child.href))
      ) {
        expanded[item.label] = true;
      }
    });

    setOpenMenus(expanded);
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // const handleLogout = () => {
  //   logoutAdmin();
  //   router.replace("/admin/login");
  // };
  const handleLogout = async () => {
    try {
      await adminLogout();      // backend logout

      logoutAdmin();            // clear zustand

      router.replace("/admin/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (admin && admin.role !== "SUPER_ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [admin, router]);
  // const pathname = usePathname();

  // useEffect(() => {
  //   if (
  //     pathname.startsWith("/admin/super") &&
  //     admin &&
  //     admin.role !== "SUPER_ADMIN"
  //   ) {
  //     router.replace("/admin/dashboard");
  //   }
  // }, [pathname, admin, router]);

  // if (!admin) return null;
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }
  // Derive initials from email
  const initials = admin.email
    ? admin.email.slice(0, 2).toUpperCase()
    : "SA";

  // Derive page title from current path
  const activeNav = NAV.find((n) => n.href === pathname);
  const pageTitle = activeNav?.label ?? "Super Admin";

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 flex flex-col min-h-screen bg-gray-950 relative">

        {/* Subtle red accent line at top */}
        <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent" />

        {/* Brand / Logo area */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
            <FiShield className="text-white" size={16} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-wide">
              YOYO Foundation
            </p>
            <p className="text-gray-500 text-xs leading-tight mt-0.5 tracking-widest uppercase">
              Super Admin
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-gray-800" />

        {/* Nav label */}
        <p className="px-5 pt-5 pb-2 text-[10px] font-semibold tracking-widest uppercase text-gray-600">
          Navigation
        </p>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map((item) => {
            // -----------------------------
            // Parent with children
            // -----------------------------
            if (item.children) {
              const expanded = openMenus[item.label];

              const parentActive = item.children.some((child) =>
                pathname.startsWith(child.href)
              );

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${parentActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                      : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
                      }`}
                  >
                    <item.icon size={17} />

                    <span className="flex-1 text-left">
                      {item.label}
                    </span>

                    <FiChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96 mt-1" : "max-h-0"
                      }`}
                  >
                    <div className="ml-6 pl-3 border-l border-gray-800 space-y-1">
                      {item.children.map((child) => {
                        const active = pathname === child.href;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center rounded-lg px-3 py-2 text-sm transition ${active
                              ? "bg-red-500 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                              }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // -----------------------------
            // Normal link
            // -----------------------------
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${active
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                  : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
                  }`}
              >
                <item.icon size={17} />

                <span className="truncate">
                  {item.label}
                </span>

                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: admin profile card + logout */}
        <div className="px-3 pb-5 pt-3 space-y-2">
          <div className="mx-0 border-t border-gray-800 mb-3" />

          {/* Admin identity card */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-900">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {admin.email}
              </p>
              <p className="text-red-400 text-[10px] mt-0.5 tracking-wide font-medium uppercase">
                {admin.role?.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-600/10 hover:text-red-400 transition-all duration-150"
          >
            <FiLogOut size={16} className="group-hover:translate-x-0.5 transition-transform duration-150" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Topbar */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Breadcrumb-style current page */}
            <div className="flex items-center gap-2">
              {activeNav && (
                <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <activeNav.icon size={14} className="text-red-600" />
                </span>
              )}
              <h1 className="font-bold text-gray-900 text-base">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {admin.role?.replace("_", " ")}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
