'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-7CH7ZEL9KN';
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

  useEffect(() => {
    // Load GA after first user interaction or when browser is idle
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

    const win = window as unknown as {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => void;
      addEventListener: (type: string, listener: (...args: unknown[]) => void, opts?: unknown) => void;
      removeEventListener: (type: string, listener: (...args: unknown[]) => void) => void;
      location: Location;
    } & Window;

    const loadGA = () => {
      win.dataLayer = win.dataLayer || [];
      win.gtag = function(...args: unknown[]) {
        win.dataLayer.push(args);
      };
      win.gtag('js', new Date());
      win.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: win.location.href,
      });
    };

    const onFirstInteraction = () => {
      loadGA();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };

    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(loadGA, { timeout: 3000 });
    } else {
      win.addEventListener('pointerdown', onFirstInteraction, { once: true } as unknown as AddEventListenerOptions);
      win.addEventListener('keydown', onFirstInteraction, { once: true } as unknown as AddEventListenerOptions);
      // Fallback after 3s
      setTimeout(() => {
        loadGA();
        win.removeEventListener('pointerdown', onFirstInteraction);
        win.removeEventListener('keydown', onFirstInteraction);
      }, 3000);
    }
  }, [GA_MEASUREMENT_ID]);

  // If site uses GTM, let GTM manage GA to avoid duplication/conflicts
  if (!GA_MEASUREMENT_ID || GTM_ID) {
    return null;
  }

  // Keep script tag but defer by lazyOnload; actual init is deferred above
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />;
} 