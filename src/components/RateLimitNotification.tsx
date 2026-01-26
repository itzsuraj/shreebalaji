/**
 * Component to display rate limit notifications
 */
'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface RateLimitInfo {
  retryAfter?: number;
  remaining?: number;
  resetTime?: Date;
}

export default function RateLimitNotification() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const handleRateLimit = (event: CustomEvent<RateLimitInfo>) => {
      setRateLimitInfo(event.detail);
      if (event.detail.retryAfter) {
        setCountdown(event.detail.retryAfter);
      }
    };

    window.addEventListener('rate-limit-exceeded', handleRateLimit as EventListener);

    return () => {
      window.removeEventListener('rate-limit-exceeded', handleRateLimit as EventListener);
    };
  }, []);

  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      if (countdown === 0) {
        setRateLimitInfo(null);
        setCountdown(null);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          setRateLimitInfo(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (!rateLimitInfo) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-lg rounded">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Too Many Requests
            </h3>
            <p className="text-sm text-red-700 mb-2">
              You've made too many requests. Please slow down.
            </p>
            {countdown !== null && countdown > 0 && (
              <div className="flex items-center text-xs text-red-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>Retry in {countdown} seconds</span>
              </div>
            )}
            {rateLimitInfo.remaining !== undefined && (
              <p className="text-xs text-red-600 mt-1">
                Remaining requests: {rateLimitInfo.remaining}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setRateLimitInfo(null);
              setCountdown(null);
            }}
            className="ml-4 text-red-500 hover:text-red-700"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
