'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  contactedEnquiries: number;
  convertedEnquiries: number;
  totalProducts: number;
  lowStockProducts: number;
  recentEnquiries: Array<{
    _id: string;
    companyName: string;
    contactName: string;
    productName?: string;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEnquiries: 0,
    newEnquiries: 0,
    contactedEnquiries: 0,
    convertedEnquiries: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentEnquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [enquiriesRes, productsRes] = await Promise.all([
          fetch('/api/quote-requests'),
          fetch('/api/admin/products')
        ]);
        
        // Check if responses are ok
        if (!enquiriesRes.ok) {
          throw new Error(`Enquiries API error: ${enquiriesRes.status}`);
        }
        if (!productsRes.ok) {
          throw new Error(`Products API error: ${productsRes.status}`);
        }
        
        const enquiriesData = await enquiriesRes.json();
        const productsData = await productsRes.json();
        
        const enquiries = enquiriesData.quoteRequests || [];
        const products = productsData.products || [];
        
        const newEnquiries = enquiries.filter((e: { status: string }) => e.status === 'new').length;
        const contactedEnquiries = enquiries.filter((e: { status: string }) => e.status === 'contacted').length;
        const convertedEnquiries = enquiries.filter((e: { status: string }) => e.status === 'converted').length;
        
        setStats({
          totalEnquiries: enquiries.length,
          newEnquiries,
          contactedEnquiries,
          convertedEnquiries,
          totalProducts: products.length,
          lowStockProducts: products.filter((product: { inStock: boolean }) => !product.inStock).length,
          recentEnquiries: enquiries.slice(0, 5)
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values on error
        setStats({
          totalEnquiries: 0,
          newEnquiries: 0,
          contactedEnquiries: 0,
          convertedEnquiries: 0,
          totalProducts: 0,
          lowStockProducts: 0,
          recentEnquiries: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your B2B enquiry management panel</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Enquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newEnquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.contactedEnquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.convertedEnquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/quote-requests" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Enquiries</h3>
              <p className="text-gray-600">View and manage quote requests</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
              <p className="text-gray-600">Add, edit, and manage products</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600">View detailed analytics and reports</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Enquiries</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentEnquiries.length > 0 ? (
            stats.recentEnquiries.map((enquiry) => (
              <div key={enquiry._id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {enquiry.companyName?.charAt(0) || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {enquiry.companyName || 'Unknown Company'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {enquiry.contactName} • {enquiry.productName || 'General Inquiry'} • {formatDate(enquiry.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    enquiry.status === 'converted' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {enquiry.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent enquiries found
            </div>
          )}
        </div>
        {stats.recentEnquiries.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <Link href="/admin/quote-requests" className="text-sm text-blue-600 hover:text-blue-800">
              View all enquiries →
            </Link>
          </div>
        )}
      </div>
      </div>
    </>
  );
}








