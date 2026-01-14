'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, Search, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';

interface Category {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const categories: Category[] = [
  {
    name: 'Buttons',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    href: '/products?category=buttons',
  },
  {
    name: 'Zippers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    href: '/products?category=zippers',
  },
  {
    name: 'Elastic',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    href: '/products?category=elastic',
  },
  {
    name: 'Cords',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    href: '/products?category=cords',
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { count: wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'menu'>('categories');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-4">
          {/* Header with icons and close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/wishlist')}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Product..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-2 px-4 text-center font-semibold ${
                activeTab === 'categories'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Categories
            </button>
            <div className="w-px bg-gray-200" />
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-2 px-4 text-center font-semibold ${
                activeTab === 'menu'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Main Menu
            </button>
          </div>

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-600 group-hover:text-primary-600 transition-colors">
                      {category.icon}
                    </div>
                    <span className="text-gray-700 group-hover:text-teal-600 font-medium">
                      {category.name}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {/* Main Menu Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-2">
              <Link
                href="/products"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-teal-600 font-medium">All Products</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-teal-600 font-medium">About Us</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/blog"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-teal-600 font-medium">Blog</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-teal-600 font-medium">Contact</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-teal-600 font-medium">FAQ</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
