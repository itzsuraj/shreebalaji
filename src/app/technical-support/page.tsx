/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import { ArrowLeft, Phone, Mail, MessageSquare, FileText, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { getEmailLink } from '@/utils/emailProtection';

export const metadata: Metadata = {
  title: "Technical Support - Garment Accessories | Shree Balaji Enterprises",
  description: "Get expert technical support for garment accessories. Product guidance, installation tips, and troubleshooting help from our experienced team.",
  keywords: "technical support garment accessories, button installation help, zipper troubleshooting, elastic guidance, garment accessories support, product technical help, installation tips, troubleshooting guide, expert support, garment accessories advice, professional guidance, technical assistance",
  alternates: {
    canonical: 'https://www.balajisphere.com/technical-support',
  },
  openGraph: {
    title: "Technical Support - Garment Accessories | Shree Balaji Enterprises",
    description: "Get expert technical support for garment accessories. Product guidance and troubleshooting help.",
    url: 'https://www.balajisphere.com/technical-support',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Technical Support - Garment Accessories | Shree Balaji Enterprises",
    description: "Get expert technical support for garment accessories.",
  },
};

export default function TechnicalSupportPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Technical Support</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert guidance and support for all your garment accessories needs. 
          Our experienced team is here to help you with product selection, installation, and troubleshooting.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-4">Call us directly for immediate assistance</p>
          <a 
            href="tel:+919372268410" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            +91 9372268410
          </a>
          <p className="text-sm text-gray-500 mt-2">Mon-Fri: 9 AM - 6 PM</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">WhatsApp Support</h3>
          <p className="text-gray-600 mb-4">Quick questions and guidance</p>
          <a 
            href="https://wa.me/919372268410" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 font-semibold"
          >
            Chat on WhatsApp
          </a>
          <p className="text-sm text-gray-500 mt-2">24/7 availability</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">Detailed technical queries</p>
          <a 
            href={getEmailLink()} 
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            Send Email
          </a>
          <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
        </div>
      </div>

      {/* Product Support Sections */}
      <div className="space-y-12">
        {/* Buttons Support */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Button Installation & Support</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Installation Guide</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Select the Right Button</h4>
                    <p className="text-sm text-gray-600">Choose button size and type based on fabric weight and garment type</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Mark Button Placement</h4>
                    <p className="text-sm text-gray-600">Use chalk or pins to mark exact button positions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Installation</h4>
                    <p className="text-sm text-gray-600">Use appropriate thread and secure stitching technique</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Common Issues & Solutions</h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Button Falling Off</h4>
                  <p className="text-sm text-yellow-700">Use stronger thread and double-stitch for heavy fabrics</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Button Too Small/Large</h4>
                  <p className="text-sm text-yellow-700">Match button size to fabric weight and buttonhole size</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Color Mismatch</h4>
                  <p className="text-sm text-yellow-700">Test button color against fabric in natural light</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Zippers Support */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Zipper Installation & Support</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Installation Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Choose Correct Zipper Type</h4>
                    <p className="text-sm text-gray-600">Select based on fabric type and application (invisible, coil, metal)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Proper Length</h4>
                    <p className="text-sm text-gray-600">Cut zipper to exact required length plus seam allowance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Installation</h4>
                    <p className="text-sm text-gray-600">Use zipper foot and proper stitching technique</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Troubleshooting</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800">Zipper Getting Stuck</h4>
                  <p className="text-sm text-red-700">Check for fabric caught in teeth, lubricate if needed</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800">Slider Not Moving</h4>
                  <p className="text-sm text-red-700">Ensure proper alignment and check for damage</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800">Teeth Separating</h4>
                  <p className="text-sm text-red-700">Check slider condition and zipper quality</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elastic Support */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Elastic Installation & Support</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Installation Guide</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Measure Correctly</h4>
                    <p className="text-sm text-gray-600">Cut elastic 2-3 inches shorter than waistband opening</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Use Zigzag Stitch</h4>
                    <p className="text-sm text-gray-600">Prevents elastic from breaking during use</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Stretch While Sewing</h4>
                    <p className="text-sm text-gray-600">Ensures proper tension and fit</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Selection Guide</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Width Selection</h4>
                  <p className="text-sm text-blue-700">1/2&quot; - 3/4&quot; for lightweight, 1&quot; - 1.5&quot; for standard, 2&quot; - 3&quot; for heavy fabrics</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Type Selection</h4>
                  <p className="text-sm text-blue-700">Braided for most uses, knitted for comfort, woven for durability</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Stretch Ratio</h4>
                  <p className="text-sm text-blue-700">2:1 for structured, 2.5:1 for standard, 3:1 for comfort</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-50 p-8 rounded-lg mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">How do I choose the right button size?</h3>
            <p className="text-sm text-gray-600">
              Button size should be proportional to fabric weight. Light fabrics use smaller buttons (12-16mm), 
              while heavy fabrics use larger buttons (18-25mm).
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">What's the difference between zipper types?</h3>
            <p className="text-sm text-gray-600">
              Nylon coil zippers are flexible and lightweight, invisible zippers are seamless, 
              and metal zippers are durable for heavy-duty applications.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">How long should elastic last?</h3>
            <p className="text-sm text-gray-600">
              Quality elastic should maintain 80-90% of its stretch and recovery for 2-3 years 
              with normal use and proper care.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Can I wash garments with these accessories?</h3>
            <p className="text-sm text-gray-600">
              Yes, all our accessories are designed to withstand normal washing. 
              Follow care instructions for best results.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-white p-8 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/blog" className="group">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
              <FileText className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2 group-hover:text-blue-600">Blog Articles</h3>
              <p className="text-sm text-gray-600">Expert tips and industry insights</p>
            </div>
          </Link>
          
          <Link href="/products" className="group">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:border-green-400 transition-colors">
              <Users className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2 group-hover:text-green-600">Product Catalog</h3>
              <p className="text-sm text-gray-600">Browse our complete product range</p>
            </div>
          </Link>
          
          <Link href="/contact" className="group">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 hover:border-purple-400 transition-colors">
              <Clock className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2 group-hover:text-purple-600">Contact Us</h3>
              <p className="text-sm text-gray-600">Get personalized assistance</p>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white p-8 rounded-lg text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
        <p className="mb-6">
          Our technical support team is ready to assist you with any questions or issues. 
          Don't hesitate to reach out for expert guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="tel:+919372268410" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Call Now
          </a>
          <a 
            href="https://wa.me/919372268410" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
} 