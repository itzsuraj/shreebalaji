'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';

interface OrderTracking {
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping: {
    method: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    location?: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OrderTrackingProps {
  orderNumber: string;
}

export default function CustomerOrderTracking({ orderNumber }: OrderTrackingProps) {
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/track?orderNumber=${orderNumber}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else {
          setError('Order not found');
        }
      } catch {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-5 w-5" />,
      processing: <Package className="h-5 w-5" />,
      shipped: <Truck className="h-5 w-5" />,
      delivered: <CheckCircle className="h-5 w-5" />,
      cancelled: <Clock className="h-5 w-5" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-5 w-5" />;
  };

  const getTimelineIcon = (status: string) => {
    const icons = {
      'Order Placed': <Package className="h-4 w-4" />,
      'Payment Confirmed': <CheckCircle className="h-4 w-4" />,
      'Processing': <Package className="h-4 w-4" />,
      'Shipped': <Truck className="h-4 w-4" />,
      'Out for Delivery': <Truck className="h-4 w-4" />,
      'Delivered': <CheckCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'The order number you entered is not valid.'}
          </p>
          <button
            onClick={() => window.location.href = '/track-order'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {getTimelineIcon(event.status)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{event.status}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {event.location && (
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {event.location}
                        </p>
                      )}
                      {event.note && (
                        <p className="text-sm text-gray-500 mt-1">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{order.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{order.customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{order.customer.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-1" />
                  <span className="text-sm text-gray-600">{order.customer.address}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {order.shipping.trackingNumber && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tracking Number:</span>
                    <p className="text-sm text-gray-900 font-mono">{order.shipping.trackingNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Carrier:</span>
                    <p className="text-sm text-gray-900">{order.shipping.carrier || 'Standard Shipping'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Method:</span>
                    <p className="text-sm text-gray-900">{order.shipping.method}</p>
                  </div>
                  {order.shipping.estimatedDelivery && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Estimated Delivery:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
