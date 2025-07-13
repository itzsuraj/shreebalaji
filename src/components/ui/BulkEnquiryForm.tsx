'use client';

import { useState } from 'react';
import { useEnquiry } from '@/context/EnquiryContext';
import { Product } from '@/types/product';
import { MessageSquare, Package, Users } from 'lucide-react';

interface BulkEnquiryFormProps {
  product?: Product;
  onClose?: () => void;
}

export default function BulkEnquiryForm({ product, onClose }: BulkEnquiryFormProps) {
  const { addEnquiry } = useEnquiry();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    quantity: 100,
    deliveryDate: '',
    projectType: '',
    additionalRequirements: '',
    budget: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) {
      addEnquiry(product, formData.quantity, 
        `Bulk enquiry from ${formData.companyName}\nContact: ${formData.contactPerson}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDelivery Date: ${formData.deliveryDate}\nProject Type: ${formData.projectType}\nBudget: ${formData.budget}\nRequirements: ${formData.additionalRequirements}`
      );
    }
    
    // Reset form
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      quantity: 100,
      deliveryDate: '',
      projectType: '',
      additionalRequirements: '',
      budget: '',
    });
    
    if (onClose) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Package className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold">Bulk Enquiry Form</h2>
      </div>
      
      {product && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Product Details</h3>
          <p className="text-gray-600">{product.name}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
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
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Quantity *
            </label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={100}>100+ pieces</option>
              <option value={500}>500+ pieces</option>
              <option value={1000}>1,000+ pieces</option>
              <option value={5000}>5,000+ pieces</option>
              <option value={10000}>10,000+ pieces</option>
              <option value={50000}>50,000+ pieces</option>
              <option value={100000}>100,000+ pieces</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            Additional Requirements & Specifications
          </label>
          <textarea
            name="additionalRequirements"
            value={formData.additionalRequirements}
            onChange={handleChange}
            rows={4}
            placeholder="Please specify any special requirements, customizations, or additional details about your project..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>Our team will contact you within 24 hours</span>
          </div>
          
          <div className="flex space-x-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Enquiry
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 