import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Terms of Service - Shree Balaji Enterprises",
  description: "Terms of service for Shree Balaji Enterprises. Read our terms and conditions for using our services and products.",
  alternates: {
    canonical: 'https://www.balajisphere.com/terms',
  },
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the Shree Balaji Enterprises website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Shree Balaji Enterprises&apos;s website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Product Information</h2>
            <p className="text-gray-700 mb-4">
              While we strive to provide accurate product information, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Pricing and Payment</h2>
            <p className="text-gray-700 mb-4">
              All prices are subject to change without notice. Payment terms will be discussed and agreed upon at the time of order placement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              Delivery times are estimates only. We are not responsible for delays beyond our control. Risk of loss and title for items pass to you upon delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Returns and refunds are subject to our return policy. Please contact us directly to discuss any issues with your order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Shree Balaji Enterprises be liable for any damages arising out of the use or inability to use the materials on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service, please contact us:
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