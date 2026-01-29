'use client';

import { X, Mail, Phone, MessageSquare, Building2, FileText } from 'lucide-react';
import { useState } from 'react';
import { getEmailLink } from '@/utils/emailProtection';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    price?: number;
    category?: string;
    size?: string;
    color?: string;
    pack?: string;
    quantity?: number;
  };
}

export default function RequestQuoteModal({ isOpen, onClose, product }: RequestQuoteModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    quantity: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create WhatsApp message
    const productInfo = product 
      ? `Product: ${product.name}${product.size ? ` (Size: ${product.size})` : ''}${product.color ? ` (Color: ${product.color})` : ''}${product.pack ? ` (Pack: ${product.pack})` : ''}${product.quantity ? ` (Quantity: ${product.quantity})` : ''}`
      : 'General Inquiry';
    
    const message = `Hello! I'm interested in requesting a quote.

Company: ${formData.companyName}
Contact Person: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone}
Quantity: ${formData.quantity || 'Not specified'}

${productInfo}

Message: ${formData.message || 'No additional message'}`;

    const whatsappUrl = `https://wa.me/919372268410?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Also create email link as backup
    const emailSubject = `Quote Request: ${product?.name || 'General Inquiry'}`;
    const emailBody = `Company Name: ${formData.companyName}\nContact Name: ${formData.contactName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nQuantity: ${formData.quantity || 'Not specified'}\n\nProduct Details:\n${productInfo}\n\nMessage:\n${formData.message || 'No additional message'}`;
    
    // Show success message
    setSubmitted(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        quantity: '',
        message: '',
      });
      onClose();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Request Quote</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6">
              {product && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Product:</p>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  {product.size && <p className="text-sm text-gray-600">Size: {product.size}</p>}
                  {product.color && <p className="text-sm text-gray-600">Color: {product.color}</p>}
                  {product.pack && <p className="text-sm text-gray-600">Pack: {product.pack}</p>}
                </div>
              )}

              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Sent!</h4>
                  <p className="text-gray-600">We'll contact you shortly via WhatsApp.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                        <Building2 className="h-4 w-4 inline mr-1" />
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your company name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Quantity
                      </label>
                      <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1000 pieces, 50 rolls"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any specific requirements, customization needs, or questions..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4" />
                          Send via WhatsApp
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-gray-500 text-center">
                    We'll contact you via WhatsApp with pricing and availability details
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
