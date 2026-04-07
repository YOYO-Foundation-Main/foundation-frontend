import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/profile", "/donate", "/my-donations", "/campaigns/create"]; // ✅ Added /campaigns/create

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("adminToken")?.value;

  // ✅ Admin login page — redirect to dashboard if already logged in
  if (pathname === "/admin/login" && adminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // ✅ Admin protected pages — redirect to login if no token
  if (pathname.startsWith("/admin/") && pathname !== "/admin/login" && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ✅ User protected routes
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "true");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/donate/:path*",
    "/my-donations/:path*",
    "/campaigns/create/:path*", // ✅ Added
  ],
};