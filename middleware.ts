import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { securityHeaders } from "./lib/security"

export function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next()

  // Add security headers
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

