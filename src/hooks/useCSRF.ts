/**
 * Hook to manage CSRF tokens for admin operations
 */
import { useState, useEffect, useCallback } from 'react';

let csrfTokenCache: string | null = null;
let tokenFetchPromise: Promise<string> | null = null;

async function fetchCSRFToken(): Promise<string> {
  // If we have a cached token, return it
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  // If a fetch is already in progress, wait for it
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  // Start new fetch
  tokenFetchPromise = (async () => {
    try {
      const res = await fetch('/api/admin/csrf-token');
      if (!res.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      const data = await res.json();
      csrfTokenCache = data.csrfToken;
      return data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    } finally {
      tokenFetchPromise = null;
    }
  })();

  return tokenFetchPromise;
}

export function useCSRF() {
  const [token, setToken] = useState<string | null>(csrfTokenCache);
  const [loading, setLoading] = useState(!csrfTokenCache);

  useEffect(() => {
    if (!token) {
      setLoading(true);
      fetchCSRFToken()
        .then(setToken)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  const refreshToken = useCallback(async () => {
    csrfTokenCache = null;
    setToken(null);
    setLoading(true);
    try {
      const newToken = await fetchCSRFToken();
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Error refreshing CSRF token:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const currentToken = token || await fetchCSRFToken();
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': currentToken,
    };
  }, [token]);

  return {
    token,
    loading,
    refreshToken,
    getHeaders,
  };
}
