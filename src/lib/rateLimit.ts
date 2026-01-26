/**
 * Simple in-memory rate limiter
 * For production, consider using Redis/Upstash for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param maxRequests - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns { allowed: boolean, remaining: number, resetTime: number }
   */
  check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      this.store.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  
  // Also include user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent.substring(0, 50)}`;
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimit(
  maxRequests: number,
  windowMs: number,
  identifier?: string
) {
  return (request: Request): { allowed: boolean; remaining: number; resetTime: number } => {
    const id = identifier || getClientIdentifier(request);
    return rateLimiter.check(id, maxRequests, windowMs);
  };
}

/**
 * Predefined rate limiters
 */
export const rateLimiters = {
  // Admin login: 5 attempts per 15 minutes
  adminLogin: (request: Request) => rateLimit(5, 15 * 60 * 1000)(request),
  
  // Admin API: 100 requests per minute
  adminAPI: (request: Request) => rateLimit(100, 60 * 1000)(request),
  
  // Public API: 60 requests per minute
  publicAPI: (request: Request) => rateLimit(60, 60 * 1000)(request),
  
  // File upload: 10 uploads per minute
  fileUpload: (request: Request) => rateLimit(10, 60 * 1000)(request),
  
  // Order creation: 5 orders per minute
  orderCreation: (request: Request) => rateLimit(5, 60 * 1000)(request),
};
