'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Invalid password');
        return;
      }
      window.location.href = '/admin';
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
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      </div>
    </>
  );
}












