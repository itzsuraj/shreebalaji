import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Enquiry Form - Shree Balaji Enterprises',
  description: 'Submit your product enquiry to Shree Balaji Enterprises. Get quotes for bulk orders of garment accessories.',
  keywords: 'product enquiry, bulk order enquiry, garment accessories quote, button manufacturer enquiry, zipper supplier enquiry',
  alternates: {
    canonical: 'https://www.balajisphere.com/enquiry-form',
  },
};

export default function EnquiryFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Enquiry Form</h1>
            <p className="text-lg text-gray-600">
              Submit your requirements and we'll get back to you with a detailed quote
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">How to Submit Your Enquiry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Option 1: Contact Form</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Use our main contact form for general enquiries and product information.
                </p>
                <Link
                  href="/contact"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
                >
                  Go to Contact Form
                </Link>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Option 2: Direct Contact</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Call us directly for immediate assistance with your requirements.
                </p>
                <a
                  href="tel:+919372268410"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block"
                >
                  Call +91 9372268410
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What We Need</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Product specifications and quantities
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Delivery timeline requirements
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Quality standards and certifications
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Your contact information
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Response</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Detailed pricing and quotes
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sample availability information
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Production timeline estimates
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Technical specifications and certifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
