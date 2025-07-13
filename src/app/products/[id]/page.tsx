'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, Heart } from 'lucide-react';
import { products } from '@/data/products';
import { notFound } from 'next/navigation';
import { getProductImage } from '@/utils/imageUtils';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleEnquiry = () => {
    const message = encodeURIComponent(`Hello, I am interested in ${product.name}. Please provide more details.`);
    window.open(`https://wa.me/919372268410?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-blue-600">
              ₹{product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button 
              onClick={handleEnquiry}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Enquiry
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Features */}
          {product.features && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="font-medium">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 