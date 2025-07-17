import { Metadata } from 'next';
import { ArrowLeft, Award, Users, Factory, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Us - Shree Balaji Enterprises | Leading Garment Accessories Manufacturer",
  description: "Learn about Shree Balaji Enterprises, Mumbai's premier manufacturer of quality garment accessories. 20+ years of excellence in buttons, zippers, elastic, and cords.",
  keywords: "about us, garment accessories manufacturer, Mumbai, quality, experience, Shree Balaji Enterprises",
  openGraph: {
    title: "About Us - Shree Balaji Enterprises",
    description: "Leading manufacturer of quality garment accessories in Mumbai with 20+ years of experience.",
    type: 'website',
  },
};

export default function AboutPage() {
  return (
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
        <h1 className="text-4xl font-bold mb-4">About Shree Balaji Enterprises</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leading manufacturer and supplier of premium garment accessories in Mumbai, 
          serving the textile industry with quality and reliability since 2024.
        </p>
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in Mumbai, Shree Balaji Enterprises has been at the forefront of garment accessories 
            manufacturing, providing high-quality products to garment manufacturers across India and beyond.
          </p>
          <p className="text-gray-600 mb-4">
            Our commitment to quality, innovation, and customer satisfaction has made us a trusted partner 
            in the textile industry, serving both small-scale tailors and large-scale garment manufacturers.
          </p>
          <p className="text-gray-600">
            We understand the critical role that accessories play in garment quality and durability, 
            which is why we maintain the highest standards in our manufacturing processes.
          </p>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <Award className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Premium Quality</h4>
                <p className="text-gray-600 text-sm">All products meet international quality standards</p>
              </div>
            </div>
            <div className="flex items-start">
              <Factory className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Direct Manufacturer</h4>
                <p className="text-gray-600 text-sm">Cut out middlemen for better prices</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Expert Support</h4>
                <p className="text-gray-600 text-sm">Technical guidance and product selection help</p>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Wide Reach</h4>
                <p className="text-gray-600 text-sm">Serving customers across India and internationally</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-blue-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-blue-800">Our Mission</h3>
          <p className="text-gray-700">
            To provide high-quality garment accessories that enhance the durability and aesthetics 
            of garments while maintaining competitive pricing and excellent customer service.
          </p>
        </div>
        <div className="bg-green-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-green-800">Our Vision</h3>
          <p className="text-gray-700">
            To become the most trusted and preferred supplier of garment accessories in India, 
            known for quality, innovation, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Product Categories Overview */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Product Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Buttons</h3>
            <p className="text-gray-600 text-sm">
              Metal, plastic, and wooden buttons for all types of garments
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Zippers</h3>
            <p className="text-gray-600 text-sm">
              Nylon coil, invisible, and decorative zippers
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Elastic</h3>
            <p className="text-gray-600 text-sm">
              High-quality elastic bands for waistbands and cuffs
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Cords</h3>
            <p className="text-gray-600 text-sm">
              Cotton cords and drawstrings for various applications
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Work With Us?</h2>
        <p className="mb-6">
          Get in touch with our team to discuss your garment accessory requirements 
          and discover how we can help your business grow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
          <Link 
            href="/products" 
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
} 