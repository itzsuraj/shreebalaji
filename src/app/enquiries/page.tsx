'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEnquiry } from '@/context/EnquiryContext';
import { Trash2, MessageSquare } from 'lucide-react';

export default function EnquiriesPage() {
  const router = useRouter();
  const { enquiries, removeEnquiry, updateEnquiry } = useEnquiry();

  if (enquiries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <MessageSquare className="h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">No Enquiries Yet</h1>
        <p className="text-gray-600 mb-8">
          You haven&apos;t made any product enquiries yet. Start exploring our products!
        </p>
        <button
          onClick={() => router.push('/products')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Enquiries</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enquiry Items */}
        <div className="lg:col-span-2 space-y-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={enquiry.productImage}
                    alt={enquiry.productName}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{enquiry.productName}</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <select
                      value={enquiry.quantity}
                      onChange={(e) => updateEnquiry(enquiry.id, { quantity: Number(e.target.value) })}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {enquiry.message && (
                    <div className="mb-3">
                      <label className="text-sm text-gray-600 block mb-1">Message:</label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{enquiry.message}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Enquired on: {enquiry.timestamp.toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => removeEnquiry(enquiry.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Enquiry Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Enquiries</span>
              <span>{enquiries.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{enquiries.reduce((total, enquiry) => total + enquiry.quantity, 0)}</span>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-4">
                We&apos;ll get back to you with pricing and availability information for your enquiries.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 