'use client';

import { MessageSquare, Heart } from 'lucide-react';

interface ProductActionsProps {
  productName: string;
  productId: string;
}

export default function ProductActions({ productName, productId }: ProductActionsProps) {
  const handleEnquiry = () => {
    const url = `${window.location.origin}/products/${productId}`;
    const message = encodeURIComponent(`Hello, I am interested in ${productName}.\nProduct link: ${url}\nPlease provide more details.`);
    window.open(`https://wa.me/919372268410?text=${message}`, '_blank');
  };

  return (
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
  );
} 