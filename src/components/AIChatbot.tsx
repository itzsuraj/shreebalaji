'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you with product information, orders, shipping, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for the chatbot
  const getKnowledgeBaseResponse = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();

    // Product information
    if (lowerQuery.includes('product') || lowerQuery.includes('item') || lowerQuery.includes('button') || lowerQuery.includes('zipper')) {
      return "We offer a wide range of garment accessories including buttons, zippers, elastic cords, and more. You can browse our products in the Products section. Would you like to know about a specific product?";
    }

    // Pricing
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('expensive') || lowerQuery.includes('cheap')) {
      return "Our prices vary by product and quantity. You can view detailed pricing on each product page. For bulk orders, please contact us for special pricing. Minimum order is 1 gross (144 pieces) for buttons.";
    }

    // Shipping
    if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery') || lowerQuery.includes('ship') || lowerQuery.includes('deliver')) {
      return "We offer shipping across India. Shipping charges are calculated at checkout. Standard delivery takes 3-7 business days. For urgent orders, please contact us directly.";
    }

    // Orders
    if (lowerQuery.includes('order') || lowerQuery.includes('track') || lowerQuery.includes('status') || lowerQuery.includes('placed')) {
      return "You can track your order status in your account dashboard. If you need help with an existing order, please provide your order number and I'll help you track it.";
    }

    // Payment
    if (lowerQuery.includes('payment') || lowerQuery.includes('pay') || lowerQuery.includes('upi') || lowerQuery.includes('razorpay')) {
      return "We accept UPI payments through Razorpay. You can pay securely during checkout. All transactions are encrypted and secure.";
    }

    // Returns/Refunds
    if (lowerQuery.includes('return') || lowerQuery.includes('refund') || lowerQuery.includes('exchange') || lowerQuery.includes('cancel')) {
      return "For returns or refunds, please contact our customer support within 7 days of delivery. We'll be happy to assist you with the process.";
    }

    // Contact
    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('call')) {
      return "You can reach us at:\n📞 Phone: +91 9372268410\n💬 WhatsApp: +91 9372268410\n📧 Email: admin@balajisphere.com\n⏰ Hours: Mon-Sat, 9AM-6PM";
    }

    // Size/Variants
    if (lowerQuery.includes('size') || lowerQuery.includes('variant') || lowerQuery.includes('mm') || lowerQuery.includes('color')) {
      return "We offer various sizes (10mm, 12mm, 15mm, 18mm, 20mm, 22mm) and colors. You can select your preferred size and color on the product page. All sizes are priced the same initially.";
    }

    // GST/Tax
    if (lowerQuery.includes('gst') || lowerQuery.includes('tax') || lowerQuery.includes('vat')) {
      return "An 18% GST is applied to all orders as per Indian tax regulations. The final price shown at checkout includes GST.";
    }

    // Minimum order
    if (lowerQuery.includes('minimum') || lowerQuery.includes('moq') || lowerQuery.includes('gross')) {
      return "For buttons, the minimum order quantity is 1 gross (144 pieces). For other products, please check the product page for MOQ details.";
    }

    // Greetings
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey') || lowerQuery.match(/^h[ie]llo?$/)) {
      return "Hello! Welcome to Shree Balaji Enterprises. I'm here to help you with any questions about our products, orders, or services. What would you like to know?";
    }

    // Help
    if (lowerQuery.includes('help') || lowerQuery.includes('assist')) {
      return "I can help you with:\n• Product information and specifications\n• Order tracking and status\n• Shipping and delivery\n• Payment options\n• Pricing and bulk orders\n• Contact information\n\nWhat would you like to know?";
    }

    return null;
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // First check knowledge base
    const kbResponse = getKnowledgeBaseResponse(userMessage);
    if (kbResponse) {
      return kbResponse;
    }

    // Use Hugging Face Inference API (free, no key needed)
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {
              past_user_inputs: messages.filter(m => m.role === 'user').slice(-3).map(m => m.content),
              generated_responses: messages.filter(m => m.role === 'assistant').slice(-3).map(m => m.content),
              text: userMessage,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.generated_text) {
          return data.generated_text;
        }
      }
    } catch (error) {
      console.error('AI API error:', error);
    }

    // Fallback response
    return "I understand your question. For detailed assistance, please contact our support team at +91 9372268410 or email admin@balajisphere.com. Is there anything specific about our products I can help you with?";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Get AI response
    const aiResponse = await generateAIResponse(userMessage);
    
    const newAssistantMessage: Message = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newAssistantMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="AI Chat Support"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI • Free to use
            </p>
          </form>
        </div>
      )}
    </>
  );
}

