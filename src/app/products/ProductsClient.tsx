'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Star, MessageSquare, ArrowLeft } from 'lucide-react';
import { getProductImage } from '@/utils/imageUtils';

interface ProductsClientProps {
  products: Product[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleEnquiry = (product: Product) => {
    const url = `${window.location.origin}/products/${product.id}`;
    const message = encodeURIComponent(`Hello, I am interested in ${product.name}.\nProduct link: ${url}\nPlease provide more details.`);
    window.open(`https://wa.me/919372268410?text=${message}`, '_blank');
  };

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
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Sort By</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm text-gray-700 font-medium">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-blue-600 font-bold text-lg mb-2">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button 
                    onClick={() => handleEnquiry(product)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold text-base shadow-md"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 