'use client';

import dynamic from 'next/dynamic';

// Lazy-load the heavy floating widget on the client only
const CustomerSupportWidget = dynamic(() => import('./CustomerSupportWidget'), {
  ssr: false,
});

export default function ClientSupportWidget() {
  return <CustomerSupportWidget />;
}


