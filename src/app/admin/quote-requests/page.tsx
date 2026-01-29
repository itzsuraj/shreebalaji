'use client';

import { useEffect, useState } from 'react';
import { FileText, Mail, Phone, Building2, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface QuoteRequest {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  quantity?: string;
  message?: string;
  productId?: string;
  productName?: string;
  productCategory?: string;
  productSize?: string;
  productColor?: string;
  productPack?: string;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'closed';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export default function QuoteRequestsPage() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchQuoteRequests();
  }, [filter]);

  const fetchQuoteRequests = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/quote-requests'
        : `/api/quote-requests?status=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setQuoteRequests(data.quoteRequests || []);
      }
    } catch (error) {
      console.error('Error fetching quote requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'converted':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Requests</h1>
          <p className="text-gray-600">Manage and track all quote requests from customers</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'new', 'contacted', 'quoted', 'converted', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Quote Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quote requests...</p>
          </div>
        ) : quoteRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quote Requests</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No quote requests found yet.'
                : `No ${filter} quote requests found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quoteRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.companyName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Contact: {request.contactName}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a
                          href={`mailto:${request.email}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {request.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a
                          href={`tel:${request.phone}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {request.phone}
                        </a>
                      </div>
                    </div>

                    {request.productName && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Product: {request.productName}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                          {request.productCategory && (
                            <span>Category: {request.productCategory}</span>
                          )}
                          {request.productSize && <span>Size: {request.productSize}</span>}
                          {request.productColor && <span>Color: {request.productColor}</span>}
                          {request.productPack && <span>Pack: {request.productPack}</span>}
                        </div>
                      </div>
                    )}

                    {request.quantity && (
                      <div className="mb-2 text-sm text-gray-700">
                        <span className="font-semibold">Quantity:</span> {request.quantity}
                      </div>
                    )}

                    {request.message && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Message:</span> {request.message}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Submitted: {formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    <a
                      href={`https://wa.me/${request.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold text-center"
                    >
                      Contact via WhatsApp
                    </a>
                    <a
                      href={`mailto:${request.email}?subject=Re: Quote Request for ${request.productName || 'Products'}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold text-center"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
