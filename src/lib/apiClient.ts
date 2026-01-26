/**
 * API Client with automatic CSRF token handling and rate limiting feedback
 */

import { useCSRF } from '@/hooks/useCSRF';

interface FetchOptions extends RequestInit {
  skipCSRF?: boolean; // Skip CSRF for GET requests or public endpoints
  showRateLimitError?: boolean; // Show user-friendly rate limit errors
}

class APIClient {
  private csrfToken: string | null = null;
  private tokenPromise: Promise<string> | null = null;

  private async getCSRFToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    this.tokenPromise = (async () => {
      try {
        const res = await fetch('/api/admin/csrf-token');
        if (!res.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        const data = await res.json();
        this.csrfToken = data.csrfToken;
        return data.csrfToken;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
      } finally {
        this.tokenPromise = null;
      }
    })();

    return this.tokenPromise;
  }

  private async buildHeaders(options: FetchOptions): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    
    // Copy existing headers
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    // Add CSRF token for state-changing methods
    if (!options.skipCSRF && options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
      try {
        const token = await this.getCSRFToken();
        headers['X-CSRF-Token'] = token;
      } catch (error) {
        console.warn('Could not fetch CSRF token:', error);
      }
    }

    // Set Content-Type if not already set and body is JSON
    if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  async fetch(url: string, options: FetchOptions = {}): Promise<Response> {
    const headers = await this.buildHeaders(options);

    const response = await fetch(url, {
      ...options,
      headers: headers as HeadersInit,
    });

    // Handle rate limiting
    if (response.status === 429 && options.showRateLimitError !== false) {
      const retryAfter = response.headers.get('Retry-After');
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');
      
      // You can dispatch a custom event or use a callback here
      window.dispatchEvent(new CustomEvent('rate-limit-exceeded', {
        detail: {
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
          remaining: remaining ? parseInt(remaining, 10) : undefined,
          resetTime: resetTime ? new Date(resetTime) : undefined,
        }
      }));
    }

    return response;
  }

  // Convenience methods
  async get(url: string, options: FetchOptions = {}) {
    return this.fetch(url, { ...options, method: 'GET', skipCSRF: true });
  }

  async post(url: string, body: any, options: FetchOptions = {}) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  async put(url: string, body: any, options: FetchOptions = {}) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  async delete(url: string, options: FetchOptions = {}) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }

  // Clear CSRF token cache (useful after logout)
  clearCache() {
    this.csrfToken = null;
    this.tokenPromise = null;
  }
}

// Singleton instance
export const apiClient = new APIClient();

// Hook for React components
export function useAPIClient() {
  return apiClient;
}
