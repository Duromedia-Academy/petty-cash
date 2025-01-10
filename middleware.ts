import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token"); // Retrieve the Firebase token from cookies

  // Public routes that don’t require authentication
  const publicRoutes = ["/signin", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If there's no token, redirect to the signin page
  if (!token) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (token && isPublicRoute) {
    url.pathname = "/dashboard"; // Redirect authenticated users to the dashboard
    return NextResponse.redirect(url);
  }

  // Optional: Add any token verification if needed (e.g., check expiration or validity)
  // try {
  //   const response = await fetch(
  //     "https://identitytoolkit.googleapis.com/v1/accounts:lookup",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ idToken: token }),
  //     }
  //   );

  //   if (response.ok) {
  //     return NextResponse.next(); // Token is valid, proceed
  //   } else {
  //     throw new Error("Invalid token");
  //   }
  // } catch (error) {
  //   console.error("Invalid token in middleware:", error);
  //   url.pathname = "/signin"; // Redirect to signin page if the token is invalid
  //   return NextResponse.redirect(url);
  // }
}

export const config = {
  // Specify routes to apply middleware
  matcher: ["/dashboard/:path*"], // Protect all routes under dashboard
};
