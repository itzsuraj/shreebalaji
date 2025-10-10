'use client';

import { useState } from 'react';
import { MessageCircle, Phone, X, Send } from 'lucide-react';

export default function CustomerSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // Create WhatsApp message with customer query
    const whatsappMessage = `Hi! I need help with: ${message}`;
    const whatsappUrl = `https://wa.me/919372268410?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Customer Support"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Support Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl border">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Need Help?</h3>
              <p className="text-sm opacity-90">We&apos;re here to assist you</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+919372268410"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
              <a
                href="https://wa.me/919372268410"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            {/* Quick Message Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Question
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about products, pricing, or technical specs..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send via WhatsApp
              </button>
            </form>

            {/* Contact Info */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 space-y-1">
                <p>📞 +91 9372268410</p>
                <p>⏰ Mon-Sat: 9AM-6PM</p>
                <p>💬 WhatsApp: 24/7</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
