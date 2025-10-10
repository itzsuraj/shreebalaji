import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/admin')) {
    // Allowlist: login page and login API should not be protected
    if (url.pathname === '/admin/login' || url.pathname === '/api/admin/login') {
      return NextResponse.next();
    }
    const token = (request.cookies.get('admin_token')?.value || '').trim();
    const expected = (process.env.ADMIN_TOKEN || '').trim();
    if (!token || !expected || token !== expected) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};


