import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If the request is for the root path
  if (request.nextUrl.pathname === '/') {
    // Redirect to the login page
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: '/'
} 