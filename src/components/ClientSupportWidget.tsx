'use client';

import dynamic from 'next/dynamic';

// Lazy-load the AI chatbot on the client only
const AIChatbot = dynamic(() => import('./AIChatbot'), {
  ssr: false,
});

export default function ClientSupportWidget() {
  return <AIChatbot />;
}









