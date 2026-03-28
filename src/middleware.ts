import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Routes that require login
const PROTECTED_ROUTES = [
  "/profile",
  "/dashboard",
  "/donate",
  "/my-donations",
];

// ✅ Routes only for NON logged-in users (redirect if already logged in)
const AUTH_ROUTES = [
  "/login",
  "/signup",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Get token from cookies (we'll save it there on login)
  const token = request.cookies.get("token")?.value;

  // ✅ If trying to access protected route without token → redirect to home
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "true"); // optional: trigger login modal
    return NextResponse.redirect(url);
  }

  // ✅ If already logged in and trying to access login/signup → redirect to home
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// ✅ Which routes this middleware runs on
export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/donate/:path*",
    "/my-donations/:path*",
    "/login",
    "/signup",
  ],
};