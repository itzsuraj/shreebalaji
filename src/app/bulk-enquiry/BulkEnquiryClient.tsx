'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Users, Calendar, DollarSign, Truck } from 'lucide-react';

export default function BulkEnquiryClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'buttons', name: 'Buttons', icon: Package },
    { id: 'zippers', name: 'Zippers', icon: Package },
    { id: 'elastic', name: 'Elastic', icon: Package },
    { id: 'cords', name: 'Cords', icon: Package },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // You can add filtering logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bulk Enquiry</h1>
          <p className="text-xl text-gray-900 mb-8">
            Get competitive pricing for large quantities of garment accessories
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Bulk Discounts</h3>
              <p className="text-sm text-gray-900">Special pricing for large orders</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-900">Quick processing for bulk orders</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Dedicated Support</h3>
              <p className="text-sm text-gray-900">Personal account manager</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
              <p className="text-sm text-gray-900">Custom delivery schedules</p>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Select Product Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2" />
                  <span className="block text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk Enquiry Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Bulk Enquiry Form</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Quantity *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select quantity range</option>
                  <option value="100-500">100 - 500 pieces</option>
                  <option value="500-1000">500 - 1,000 pieces</option>
                  <option value="1000-5000">1,000 - 5,000 pieces</option>
                  <option value="5000-10000">5,000 - 10,000 pieces</option>
                  <option value="10000-50000">10,000 - 50,000 pieces</option>
                  <option value="over-50000">Over 50,000 pieces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Delivery Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select project type</option>
                  <option value="garment-manufacturing">Garment Manufacturing</option>
                  <option value="fashion-brand">Fashion Brand</option>
                  <option value="textile-industry">Textile Industry</option>
                  <option value="craft-supplies">Craft Supplies</option>
                  <option value="retail-store">Retail Store</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select budget range</option>
                  <option value="under-1000">Under ₹50,000</option>
                  <option value="1000-5000">₹50,000 - ₹2,50,000</option>
                  <option value="5000-10000">₹2,50,000 - ₹5,00,000</option>
                  <option value="10000-50000">₹5,00,000 - ₹25,00,000</option>
                  <option value="over-50000">Over ₹25,00,000</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Requirements
              </label>
              <textarea
                rows={4}
                placeholder="Please specify the products you need, quantities, specifications, and any special requirements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                rows={3}
                placeholder="Any additional information about your project, timeline, or special requirements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center text-sm text-gray-700">
                <Users className="h-4 w-4 mr-2" />
                <span>Our sales team will contact you within 24 hours</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Browse Products
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Bulk Enquiry
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 