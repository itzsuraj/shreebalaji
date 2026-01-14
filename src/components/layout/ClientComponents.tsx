'use client';

import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), {
  ssr: false,
});

const ClientSupportWidget = dynamic(() => import('@/components/ClientSupportWidget'), {
  ssr: false,
});

export default function ClientComponents() {
  return (
    <>
      <GoogleAnalytics />
      <ClientSupportWidget />
    </>
  );
}
