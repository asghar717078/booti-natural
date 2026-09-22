import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Clone response and set pathname header (for root layout to detect admin)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Only protect /admin/* routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Always allow login page and API auth routes
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/auth/')
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (!token || !(await verifyToken(token))) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect /admin root → /admin/dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/admin', '/admin/(.*)', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
