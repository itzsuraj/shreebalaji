'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder: string;
  orders: Array<{
    _id: string;
    status: string;
    totalInPaise: number;
    payment: { status: string; method: string };
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
      size?: string;
      color?: string;
      pack?: string;
    }>;
    createdAt: string;
  }>;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomerDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const phone = params.phone as string;
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(phone)}`);
      const data = await res.json();
      
      if (res.ok) {
        setCustomer(data.customer);
      } else {
        setError(data.error || 'Failed to load customer details');
      }
    } catch (error) {
      console.error('Error loading customer details:', error);
      setError('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  }, [params.phone]);

  useEffect(() => {
    loadCustomerDetails();
  }, [loadCustomerDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadCustomerDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">Customer not found</div>
        <Link href="/admin/customers" className="text-blue-600 hover:text-blue-800">
          ← Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/customers" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Customers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
        </div>
        <button
          onClick={loadCustomerDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-600">
              {customer.fullName?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{customer.fullName}</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{customer.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <p className="text-sm text-gray-900">{customer.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Since</label>
                <p className="text-sm text-gray-900">{formatDate(customer.firstOrder)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-3xl font-bold text-blue-600">{customer.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-3xl font-bold text-green-600">{formatCurrency(customer.totalSpent)}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-3xl font-bold text-purple-600">
            {customer.totalOrders > 0 ? formatCurrency(customer.totalSpent / customer.totalOrders) : '₹0.00'}
          </div>
          <div className="text-sm text-gray-600">Average Order Value</div>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {customer.orders.map((order) => (
            <div key={order._id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h4>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.totalInPaise)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Items:</h5>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        {item.size && <span className="text-gray-500 ml-2">Size: {item.size}</span>}
                        {item.color && <span className="text-gray-500 ml-2">Color: {item.color}</span>}
                        {item.pack && <span className="text-gray-500 ml-2">Pack: {item.pack}</span>}
                      </div>
                      <div className="text-right">
                        <div>Qty: {item.quantity}</div>
                        <div className="font-medium">{formatCurrency(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-medium">Payment:</span> {order.payment?.method} ({order.payment?.status})
                </div>
                <Link
                  href={`/admin/orders`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
