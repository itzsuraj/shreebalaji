'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-700 mb-6">Thank you! Your payment has been verified.</p>
      {orderId && (
        <p className="mb-8">Order ID: <span className="font-mono">{orderId}</span></p>
      )}
      <div className="space-x-4">
        <Link href="/products" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Continue Shopping</Link>
        <Link href="/" className="inline-block border px-4 py-2 rounded hover:bg-gray-50">Go Home</Link>
      </div>
    </div>
  );
}













