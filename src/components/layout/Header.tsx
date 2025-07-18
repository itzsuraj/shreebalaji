'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'm interested in your garment accessories. Please provide more information.");
    window.open(`https://wa.me/919372268410?text=${message}`, '_blank');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow relative">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="Shree Balaji Enterprises Logo"
                  fill
                  className="object-contain"
                  />
              </div>
              <span className="text-xl font-bold text-gray-900 italic">Shree Balaji Enterprises</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
            <button
              onClick={handleWhatsAppClick}
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Contact us on WhatsApp"
            >
              <WhatsAppIcon />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleWhatsAppClick}
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Contact us on WhatsApp"
            >
              <WhatsAppIcon />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/products" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                href="/blog" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                Contact
              </Link>
              <Link 
                href="/faq" 
                className="block text-gray-700 hover:text-blue-600 transition-colors py-2 text-lg"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Quick Contact:</p>
                <a 
                  href="tel:+919372268410"
                  className="block text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  +91 9372268410
                </a>
                <a 
                  href="mailto:shreebalajienterprises400077@gmail.com"
                  className="block text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 