import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Account - Shree Balaji Enterprises',
  description: 'Manage your account and orders with Shree Balaji Enterprises.',
  robots: 'noindex, nofollow',
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Management</h2>
              <p className="text-gray-600 mb-4">Track your orders and view order history.</p>
              <Link
                href="/track-order"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Track Orders
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h2>
              <p className="text-gray-600 mb-4">Get help with your account or orders.</p>
              <Link
                href="/contact"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block"
              >
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800">
              For account-related inquiries, please contact us at{' '}
              <a href="tel:+919372268410" className="font-semibold hover:underline">
                +91 9372268410
              </a>{' '}
              or email us for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




