import { NextResponse, NextRequest } from "next/server";
import { RouteConfig } from "./types";

export const PROTECTED_ROUTES: RouteConfig = {
  "/dashboard": ["admin"],
  "/cart": ["user", "admin"],
  "/profile": ["user", "admin"],
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
