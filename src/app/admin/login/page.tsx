'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useToast } from '@/hooks/useToast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ retryAfter?: number; remaining?: number } | null>(null);
  const { showError, showSuccess } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRateLimitInfo(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.status === 429) {
        const data = await res.json();
        const retryAfter = res.headers.get('Retry-After');
        const remaining = res.headers.get('X-RateLimit-Remaining');
        setRateLimitInfo({
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
          remaining: remaining ? parseInt(remaining, 10) : undefined,
        });
        showError(data.error || 'Too many login attempts. Please try again later.');
        return;
      }
      
      if (!res.ok) {
        const data = await res.json();
        showError(data.error || 'Invalid password');
        return;
      }
      
      showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      showError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Admin Login - Shree Balaji Enterprises</title>
      </Head>
      <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {rateLimitInfo && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
            <p className="font-semibold">Too many login attempts</p>
            {rateLimitInfo.retryAfter && (
              <p>Please try again in {rateLimitInfo.retryAfter} seconds</p>
            )}
            {rateLimitInfo.remaining !== undefined && (
              <p>Remaining attempts: {rateLimitInfo.remaining}</p>
            )}
          </div>
        )}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
          disabled={loading || (rateLimitInfo?.retryAfter ? rateLimitInfo.retryAfter > 0 : false)}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      </div>
    </>
  );
}












