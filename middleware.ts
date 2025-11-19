import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const PROTECTED_PATHS = ["/account"]
const AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "access"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  if (isProtected) {
    const accessCookie = request.cookies.get(AUTH_COOKIE)?.value
    if (!accessCookie) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*"],
}
