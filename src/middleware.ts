// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PROTECTED_ROUTES = ["/profile", "/donate", "/my-donations", "/campaigns/create"]; // ✅ Added /campaigns/create

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;
//   const accessToken = request.cookies.get("accessToken")?.value;

//   if (
//     pathname.startsWith("/admin") &&
//     pathname !== "/admin/login" &&
//     !accessToken
//   ) {
//     return NextResponse.redirect(new URL("/admin/login", request.url));
//   }

//   // Not logged in -> protect admin pages
//   if (
//     pathname === "/admin/login" &&
//     accessToken
//   ) {
//     return NextResponse.redirect(
//       new URL("/admin/dashboard", request.url)
//     );
//   }
//   // ✅ User protected routes
//   const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
//   if (isProtected && !accessToken) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/";
//     url.searchParams.set("login", "true");
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/profile/:path*",
//     "/donate/:path*",
//     "/my-donations/:path*",
//     "/campaigns/create/:path*", //Added
//   ],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const accessToken = request.cookies.get("accessToken");
  
  console.log("==== MIDDLEWARE ====");
  console.log("PATH:", request.nextUrl.pathname);
    console.log("COOKIE:", accessToken?.value);

  console.log(
    "ALL COOKIES:",
    request.cookies.getAll()
  );

  console.log(
    "ACCESS:",
    request.cookies.get("accessToken")
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};