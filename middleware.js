import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  const publicPaths = ['/login', '/signup']
  const isPublic = publicPaths.includes(path)
  if (path === '/') {
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.redirect(new URL('/home', request.url))
}

  // Not logged in + trying to access protected page
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in + trying to access login/signup
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}