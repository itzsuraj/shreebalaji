import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rateLimit';
import { generateCSRFToken, setCSRFTokenCookie } from '@/lib/csrf';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Rate limiting: 5 attempts per 15 minutes
  const rateLimitResult = rateLimiters.adminLogin(req);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { 
        error: 'Too many login attempts. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        }
      }
    );
  }

  const { password } = (await req.json()) as { password?: string };
  const provided = (password ?? '').trim();
  const expected = (process.env.ADMIN_TOKEN ?? '').trim();
  if (!provided || !expected || provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Generate CSRF token
  const csrfToken = generateCSRFToken();
  
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', expected, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    path: '/', 
    sameSite: 'strict', // Changed from 'lax' to 'strict' for better CSRF protection
    maxAge: 60 * 60 * 8 
  });
  
  // Set CSRF token cookie
  setCSRFTokenCookie(res, csrfToken);
  
  return res;
}


