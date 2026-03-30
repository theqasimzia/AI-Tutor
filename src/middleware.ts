import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

const roleRedirectMap: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  PARENT: "/parent/dashboard",
  STUDENT: "/student/dashboard",
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request })

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup")
  const isProtectedRoute =
    pathname.startsWith("/student") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/admin")

  if (isAuthRoute && token) {
    const role = (token.role as string) || "PARENT"
    const redirectUrl = roleRedirectMap[role] || "/parent/dashboard"
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isProtectedRoute && token) {
    const role = (token.role as string) || "PARENT"

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const redirectUrl = roleRedirectMap[role] || "/parent/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    if (pathname.startsWith("/parent") && role !== "PARENT") {
      const redirectUrl = roleRedirectMap[role] || "/parent/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Allow both STUDENT and PARENT roles to access student routes
    if (
      pathname.startsWith("/student") &&
      role !== "STUDENT" &&
      role !== "PARENT"
    ) {
      const redirectUrl = roleRedirectMap[role] || "/parent/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/student/:path*",
    "/parent/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/signup/:path*",
  ],
}
