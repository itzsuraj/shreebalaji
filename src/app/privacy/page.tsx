import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Privacy Policy - Shree Balaji Enterprises",
  description: "Privacy policy for Shree Balaji Enterprises. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: 'https://www.balajisphere.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Contact us through our website</li>
              <li>Submit an enquiry form</li>
              <li>Request a quote</li>
              <li>Sign up for our newsletter</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Respond to your enquiries and provide customer support</li>
              <li>Process and fulfill your orders</li>
              <li>Send you important updates about our services</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Shree Balaji Enterprises</strong><br />
                Phone: +91 9372268410<br />
                Email: shreebalajienterprises400077@gmail.com<br />
                Address: C Wing 704, Grit Height, G.M Link Road, Opposite Indian Oil Nagar, Near Shankara Colony, Chembur West, Mumbai - 400043
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 