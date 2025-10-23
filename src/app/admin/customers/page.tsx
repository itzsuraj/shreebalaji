'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Customer {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder: string;
  orderIds: string[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastOrder');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      case 'totalOrders':
        return b.totalOrders - a.totalOrders;
      case 'totalSpent':
        return b.totalSpent - a.totalSpent;
      case 'lastOrder':
      default:
        return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Customer Management - Admin Panel</title>
      </Head>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage and view customer information</p>
        </div>
        <button
          onClick={loadCustomers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {customers.length > 0 ? formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length) : '₹0.00'}
          </div>
          <div className="text-sm text-gray-600">Avg. Customer Value</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
            <input
              type="text"
              placeholder="Search by name, phone, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lastOrder">Last Order</option>
              <option value="name">Name</option>
              <option value="totalOrders">Total Orders</option>
              <option value="totalSpent">Total Spent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCustomers.map((customer) => (
                  <tr key={customer.phone} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {customer.fullName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                          <div className="text-sm text-gray-500">{customer.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                      <div className="text-sm text-gray-500">{customer.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                      <div className="text-sm text-gray-500">orders</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.lastOrder)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/customers/${encodeURIComponent(customer.phone)}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
