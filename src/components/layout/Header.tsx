'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function Header() {
  const { enquiries } = useEnquiry();

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Garment Accessories Pro</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/enquiries"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <MessageSquare className="h-6 w-6" />
              {enquiries.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                  {enquiries.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 