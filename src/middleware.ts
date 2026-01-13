import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const hostname = request.headers.get('host') || '';

  // Redirect non-www to www (balajisphere.com -> www.balajisphere.com)
  if (hostname === 'balajisphere.com') {
    const wwwUrl = new URL(request.url);
    wwwUrl.hostname = 'www.balajisphere.com';
    return NextResponse.redirect(wwwUrl, 301); // 301 = permanent redirect
  }

  // Admin route protection
  if (url.pathname.startsWith('/admin')) {
    // Allowlist: login page and login API should not be protected
    if (url.pathname === '/admin/login' || url.pathname === '/api/admin/login') {
      const res = NextResponse.next();
      // Ensure admin routes are never indexed
      res.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return res;
    }
    const token = (request.cookies.get('admin_token')?.value || '').trim();
    const expected = (process.env.ADMIN_TOKEN || '').trim();
    if (!token || !expected || token !== expected) {
      const loginUrl = new URL('/admin/login', request.url);
      const res = NextResponse.redirect(loginUrl);
      // Ensure admin routes are never indexed
      res.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return res;
    }
    // Authenticated admin routes should still not be indexed
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


