// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the current path
  const path = request.nextUrl.pathname;

  // Get user authentication status from cookies
  const userAuthStatusCookie = request.cookies.get("userAuthStatus")?.value;

  // Routes that require authentication
  const protectedRoutes = ["/", "/products", "/cart", "/shipping", "/checkout"];
  // Routes that require admin role
  const isAdminRoute = path.startsWith("/admin/");

  // Check if current route requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // User is not authenticated (userAuthStatus is "null" or doesn't exist)
  if (userAuthStatusCookie === "null" || !userAuthStatusCookie) {
    // If trying to access protected route or admin route, redirect to signin
    if (isProtectedRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // If we reach here, user is authenticated
  // For admin routes, check if user has admin role
  if (isAdminRoute) {
    try {
      // Parse the userAuthStatus to get the user object
      const userObj = JSON.parse(userAuthStatusCookie);

      // Check if user has admin role
      if (userObj?.role !== "admin") {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      // If parsing fails, assume user is not admin and redirect
      console.error("Error parsing user authentication data:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Protected routes for authenticated users
    "/",
    "/products/:path*",
    "/cart/:path*",
    "/shipping/:path*",
    "/checkout/:path*",
    // Admin routes
    "/admin/:path*",
  ],
};
