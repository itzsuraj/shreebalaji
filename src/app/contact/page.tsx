import { Metadata } from 'next';
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ContactStructuredData from './ContactStructuredData';

export const metadata: Metadata = {
  title: "Contact Us - Shree Balaji Enterprises | Get in Touch",
  description: "Contact Shree Balaji Enterprises for garment accessories. Located in Mumbai. Call +91 9372268410 or email us for bulk orders and enquiries.",
  keywords: "contact, garment accessories, Mumbai, phone, email, address, Shree Balaji Enterprises",
  alternates: {
    canonical: 'https://www.balajisphere.com/contact',
  },
  openGraph: {
    title: "Contact Us - Shree Balaji Enterprises",
    description: "Get in touch with us for quality garment accessories. Located in Mumbai.",
    url: 'https://www.balajisphere.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactStructuredData />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-900 max-w-2xl mx-auto">
            Get in touch with our team for quality garment accessories, bulk orders, 
            and expert guidance for your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Only (form removed) */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-900 mb-6">
                We&apos;re here to help you find the perfect garment accessories for your needs. 
                Reach out to us through any of the following channels.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <a 
                    href="tel:+919372268410" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    +91 9372268410
                  </a>
                  <p className="text-gray-900 text-sm mt-1">Call us for immediate assistance</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <a 
                    href="mailto:shreebalajienterprises400077@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    shreebalajienterprises400077@gmail.com
                  </a>
                  <p className="text-gray-900 text-sm mt-1">Send us detailed enquiries</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-gray-900">
                    C Wing 704, Grit Height<br />
                    G.M Link Road, Opposite Indian Oil Nagar<br />
                    Near Shankara Colony, Chembur West<br />
                    Mumbai - 400043, Maharashtra, India
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Business Hours</h3>
                  <p className="text-gray-900">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp</h3>
                  <a 
                    href="https://wa.me/919372268410" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    +91 9372268410
                  </a>
                  <p className="text-gray-900 text-sm mt-1">Quick enquiries and support</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/products" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Browse Our Products
                </Link>
                <Link 
                  href="/bulk-enquiry" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Bulk Order Enquiry
                </Link>
                <Link 
                  href="/about" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Learn About Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Location</h2>
          <div className="bg-blue-100 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-900">
                C Wing 704, Grit Height<br />
                G.M Link Road, Chembur West, Mumbai - 400043
              </p>
              <p className="text-sm text-gray-700 mt-2">
                (Interactive map can be added here)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 