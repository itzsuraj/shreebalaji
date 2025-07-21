'use client';

import Link from 'next/link';
import { getProtectedEmail, getEmailLink } from '@/utils/emailProtection';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Shree Balaji Enterprises</h3>
            <p className="text-gray-400">
              Premium garment accessories for professional garment making and textile industry. Quality buttons, zippers, elastic, and cords.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Product Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=buttons" className="text-gray-400 hover:text-white">
                  Buttons
                </Link>
              </li>
              <li>
                <Link href="/products?category=zippers" className="text-gray-400 hover:text-white">
                  Zippers
                </Link>
              </li>
              <li>
                <Link href="/products?category=elastic" className="text-gray-400 hover:text-white">
                  Elastic
                </Link>
              </li>
              <li>
                <Link href="/products?category=cords" className="text-gray-400 hover:text-white">
                  Cords
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Business Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/enquiries" className="text-gray-400 hover:text-white">
                  My Enquiries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="/technical-support" className="text-gray-400 hover:text-white">
                  Technical Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start">
                <svg className="w-4 h-4 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm">C Wing 704, Grit Height</p>
                  <p className="text-sm">G.M Link Road, Opposite Indian Oil Nagar</p>
                  <p className="text-sm">Near Shankara Colony, Chembur West</p>
                  <p className="text-sm">Mumbai - 400043</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919372268410" className="hover:text-white text-sm break-all">+91 9372268410</a>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={getEmailLink()} className="hover:text-white text-sm break-all" dangerouslySetInnerHTML={{ __html: getProtectedEmail() }}>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center md:text-left">
            <div className="text-gray-400">
              <p>&copy; {new Date().getFullYear()} Shree Balaji Enterprises. All rights reserved.</p>
            </div>
            <div className="text-gray-400">
              <p>Serving garment manufacturers worldwide since 1990</p>
            </div>
            <div className="flex justify-center md:justify-end space-x-4">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 