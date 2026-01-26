/**
 * CSRF Protection Utilities
 * Generates and validates CSRF tokens
 */

import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.ADMIN_TOKEN || 'default-csrf-secret-change-in-production';
const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_TOKEN_HEADER = 'x-csrf-token';

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  const hmac = createHmac('sha256', CSRF_SECRET)
    .update(token + timestamp)
    .digest('hex');
  
  return `${token}:${timestamp}:${hmac}`;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;
    
    const [tokenPart, timestamp, hmac] = parts;
    
    // Check if token is expired (24 hours)
    const tokenTime = parseInt(timestamp, 10);
    if (Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
      return false;
    }
    
    // Verify HMAC
    const expectedHmac = createHmac('sha256', CSRF_SECRET)
      .update(tokenPart + timestamp)
      .digest('hex');
    
    return hmac === expectedHmac;
  } catch {
    return false;
  }
}

/**
 * Get CSRF token from request
 */
export function getCSRFTokenFromRequest(request: Request): string | null {
  // Check header first (preferred for API calls)
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  if (headerToken) return headerToken;
  
  // Fallback to cookie (for form submissions)
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(^|; )${CSRF_TOKEN_COOKIE}=([^;]+)`));
  return match ? match[2] : null;
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFRequest(request: Request): boolean {
  const token = getCSRFTokenFromRequest(request);
  if (!token) return false;
  return validateCSRFToken(token);
}

/**
 * Set CSRF token in response cookie
 */
export function setCSRFTokenCookie(response: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  response.headers.append(
    'Set-Cookie',
    `${CSRF_TOKEN_COOKIE}=${token}; HttpOnly; Secure=${isProduction}; SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`
  );
}
