// import { NextResponse, NextRequest } from "next/server";

// const protectedRoutes = {
//   "/admin": ["admin"],
//   "/dashboard": ["admin", "user"],
//   "/settings": ["admin", "user"],
// };

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Check if the path is protected
//   const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
//     pathname.startsWith(route)
//   );
//   console.log(protectedRoutes, isProtectedRoute);
//   if (isProtectedRoute) {
//     // Get token and role from cookies
//     const token = request.cookies.get("accessToken")?.value;
//     const role = request.cookies.get("userRole")?.value;
//     // const token = localStorage.getItem("accessToken");
//     // const role = localStorage.getItem("role");
//     // console.log(token);
//     if (!token || !role) {
//       const url = new URL("/login", request.url);
//       url.searchParams.set("callbackUrl", pathname);
//       return NextResponse.redirect(url);
//     }

//     const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
//       pathname.startsWith(route)
//     )?.[1];

//     if (!requiredRoles?.includes(role)) {
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/dashboard/:path*", "/settings/:path*"],
// };

//***--*--*-**-* */

import { NextResponse, NextRequest } from "next/server";
import { RouteConfig } from "./types";

export const PROTECTED_ROUTES: RouteConfig = {
  "/admin": ["admin"],
  "/dashboard": ["admin"],
  "/settings": ["admin", "user"],
};

export const AUTH_ROUTES = {
  LOGIN: "/login",
  UNAUTHORIZED: "/unauthorized",
  CHANGE_PASSWORD: "/dashboard/change-password",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if current path matches any protected routes
  const matchingRoute = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );

  if (matchingRoute) {
    const [route, allowedRoles] = matchingRoute;
    const token = request.cookies.get("accessToken")?.value;
    const role = request.cookies.get("userRole")?.value;

    // Redirect to login if no auth credentials
    if (!token || !role) {
      const loginUrl = new URL(AUTH_ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to unauthorized if role doesn't match
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(
        new URL(AUTH_ROUTES.UNAUTHORIZED, request.url)
      );
    }
  }

  return NextResponse.next();
}
// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
// Configure middleware matcher
// export const config = {
//   matcher: [
//     // Match specific paths that need protection
//     {
//       source: "/admin/:path*",
//       missing: [
//         { type: "cookie", key: "accessToken" },
//         { type: "cookie", key: "userRole" },
//       ],
//     },
//     {
//       source: "/dashboard/:path*",
//       missing: [
//         { type: "cookie", key: "accessToken" },
//         { type: "cookie", key: "userRole" },
//       ],
//     },
//     {
//       source: "/settings/:path*",
//       missing: [
//         { type: "cookie", key: "accessToken" },
//         { type: "cookie", key: "userRole" },
//       ],
//     },
//   ],
// };
