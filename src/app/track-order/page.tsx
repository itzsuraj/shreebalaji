'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, User, LogIn } from 'lucide-react';
import Link from 'next/link';

interface OrderStatus {
  orderId: string;
  status: 'created' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  totalInPaise: number;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingMethod, setTrackingMethod] = useState<'quick' | 'login'>('quick');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('Please enter both Order ID and Phone Number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/orders/track?orderId=${orderId}&phone=${phone}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order not found');
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <Search className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Choose how you&apos;d like to track your order</p>
        </div>

        {/* Tracking Method Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Tracking Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setTrackingMethod('quick')}
              className={`p-4 rounded-lg border-2 transition-all ${
                trackingMethod === 'quick'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <Search className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Quick Track</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Enter Order ID + Phone Number</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• No account needed</li>
                  <li>• Fast and simple</li>
                  <li>• Track single order</li>
                </ul>
              </div>
            </button>
            
            <button
              onClick={() => setTrackingMethod('login')}
              className={`p-4 rounded-lg border-2 transition-all ${
                trackingMethod === 'login'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Login & Track</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Create account for full features</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• View order history</li>
                  <li>• Reorder easily</li>
                  <li>• Save addresses</li>
                </ul>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Track Form */}
        {trackingMethod === 'quick' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Order Tracking</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Order ID"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>
        )}

        {/* Login Track Option */}
        {trackingMethod === 'login' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Login to Track Orders</h2>
            <div className="text-center py-8">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Account or Login</h3>
              <p className="text-gray-600 mb-6">
                Create an account to view all your orders, reorder easily, and manage your profile.
              </p>
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Create Account
                </Link>
                <div className="text-sm text-gray-500">or</div>
                <Link
                  href="/login"
                  className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login to Existing Account
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2">{getStatusText(order.status)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
                  <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total Amount:</span> ₹{(order.totalInPaise / 100).toLocaleString()}</p>
                  {order.trackingNumber && (
                    <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
                  )}
                  {order.estimatedDelivery && (
                    <p><span className="font-medium">Estimated Delivery:</span> {order.estimatedDelivery}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {order.customer.fullName}</p>
                  <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                  {order.customer.email && (
                    <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {trackingMethod === 'quick' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Want more features?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Create an account to view your order history, reorder easily, and save your addresses.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <User className="h-4 w-4 mr-1" />
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}