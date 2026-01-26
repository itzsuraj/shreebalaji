/**
 * API endpoint to get CSRF token for admin operations
 * This token must be included in X-CSRF-Token header for state-changing operations
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken, setCSRFTokenCookie } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  // Verify admin is authenticated
  const adminToken = request.cookies.get('admin_token')?.value;
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (!adminToken || !expectedToken || adminToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate new CSRF token
  const csrfToken = generateCSRFToken();
  
  const response = NextResponse.json({ csrfToken });
  
  // Set CSRF token in cookie
  setCSRFTokenCookie(response, csrfToken);
  
  return response;
}
