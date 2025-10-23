import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Debug Login - Development',
  description: 'Debug login page for development purposes.',
  robots: 'noindex, nofollow',
};

export default function DebugLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Login</h1>
            <p className="text-gray-600 mb-6">
              This is a development-only page for debugging login issues.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-red-800 mb-2">Development Only</h3>
              <p className="text-sm text-red-700">
                This page should not be accessible in production. It&apos;s intended for development and debugging purposes only.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Go to Login Page
              </Link>
              <Link
                href="/admin/login"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors inline-block text-center"
              >
                Go to Admin Login
              </Link>
              <Link
                href="/"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block text-center"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
