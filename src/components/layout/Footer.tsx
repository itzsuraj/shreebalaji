'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Garment Accessories Pro</h3>
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
                <Link href="/bulk-enquiry" className="text-gray-400 hover:text-white">
                  Bulk Enquiry
                </Link>
              </li>
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
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe for industry updates, new products, and special bulk pricing offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded text-gray-900 w-full"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="text-gray-400">
              <p>&copy; {new Date().getFullYear()} Garment Accessories Pro. All rights reserved.</p>
            </div>
            <div className="text-gray-400">
              <p>Serving garment manufacturers worldwide since 2024</p>
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