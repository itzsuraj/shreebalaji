'use client';

import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import DeleteModal from '@/components/ui/DeleteModal';
import ShopifyOrderDetail from '@/components/admin/ShopifyOrderDetail';
// import OrderManagementDashboard from '@/components/admin/OrderManagementDashboard';

interface AdminOrderItem {
  _id: string;
  orderNumber?: string;
  status: string;
  totalInPaise: number;
  subtotalInPaise: number;
  shippingInPaise: number;
  gstInPaise: number;
  payment: { status: string; method: string; razorpayOrderId?: string; razorpayPaymentId?: string };
  customer: { 
    fullName: string; 
    phone: string; 
    city: string; 
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    gstin?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    size?: string;
    color?: string;
    pack?: string;
    category?: string;
    sku?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  fulfillment?: {
    status: string;
    trackingNumber?: string;
    carrier?: string;
    trackingUrl?: string;
    shippedAt?: string;
    deliveredAt?: string;
    estimatedDelivery?: string;
    items?: Array<{
      itemIndex: number;
      quantity: number;
      fulfilledAt?: string;
    }>;
  };
  timeline?: Array<{
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }>;
  internalNotes?: string;
  customerNotes?: string;
  notes?: string;
  tags?: string[];
}

interface OrderStats {
  total: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    isBulk: boolean;
    count: number;
  }>({
    isOpen: false,
    orderId: null,
    isBulk: false,
    count: 0
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    setOrders(data.orders || []);
    calculateStats(data.orders || []);
    setLoading(false);
  }, []);

  const calculateStats = (ordersList: AdminOrderItem[]) => {
    const newStats = {
      total: ordersList.length,
      processing: ordersList.filter(o => o.status === 'processing').length,
      shipped: ordersList.filter(o => o.status === 'shipped').length,
      delivered: ordersList.filter(o => o.status === 'delivered').length,
      cancelled: ordersList.filter(o => o.status === 'cancelled').length,
      totalRevenue: ordersList.reduce((sum, o) => sum + o.totalInPaise, 0) / 100
    };
    setStats(newStats);
  };

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ status }) 
    });
    if (res.ok) load();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({
      isOpen: true,
      orderId: id,
      isBulk: false,
      count: 1
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedOrders.length === 0) return;
    setDeleteModal({
      isOpen: true,
      orderId: null,
      isBulk: true,
      count: selectedOrders.length
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.isBulk && selectedOrders.length > 0) {
        const res = await fetch('/api/admin/orders/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedOrders })
        });
        if (res.ok) {
          setSelectedOrders([]);
          load();
        }
      } else if (deleteModal.orderId) {
        const res = await fetch(`/api/admin/orders/${deleteModal.orderId}`, { method: 'DELETE' });
    if (res.ok) load();
      }
      setDeleteModal({ isOpen: false, orderId: null, isBulk: false, count: 0 });
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    
    const promises = selectedOrders.map(orderId => 
      fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: bulkAction })
      })
    );
    
    await Promise.all(promises);
    setSelectedOrders([]);
    setBulkAction('');
    load();
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer Name', 'Phone', 'City', 'Total', 'Status', 'Payment Method', 'Payment Status', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order._id,
        `"${order.customer?.fullName || ''}"`,
        order.customer?.phone || '',
        `"${order.customer?.city || ''}"`,
        (order.totalInPaise / 100).toFixed(2),
        order.status,
        order.payment?.method || '',
        order.payment?.status || '',
        formatDate(order.createdAt)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.phone?.includes(searchTerm) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Order Management - Admin Panel</title>
      </Head>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
          <button 
            onClick={load}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-primary-600">{stats.shipped}</div>
          <div className="text-sm text-gray-600">Shipped</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by customer name, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedOrders.length} order(s) selected
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select action...</option>
                <option value="processing">Mark as Processing</option>
                <option value="shipped">Mark as Shipped</option>
                <option value="delivered">Mark as Delivered</option>
                <option value="cancelled">Mark as Cancelled</option>
              </select>
              <button
                onClick={executeBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={handleBulkDeleteClick}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={(e) => handleSelectOrder(order._id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber || `#${order._id.slice(-8)}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {order._id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer?.fullName}</div>
                      <div className="text-sm text-gray-500">{order.customer?.phone}</div>
                      <div className="text-sm text-gray-500">{order.customer?.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} item(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.[0]?.name}
                        {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{(order.totalInPaise / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{order.payment?.method}</div>
                      <div className={`text-sm ${
                        order.payment?.status === 'paid' || order.payment?.status === 'captured' ? 'text-green-600' : 
                        order.payment?.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {order.payment?.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteClick(order._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shopify-style Order Details Modal */}
      {selectedOrder && (
        <ShopifyOrderDetail
          order={{
            ...selectedOrder,
            items: selectedOrder.items.map(item => ({
              productId: item.productId || '',
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
              size: item.size,
              color: item.color,
              pack: item.pack,
              category: item.category,
              sku: item.sku,
            })),
            customer: {
              ...selectedOrder.customer,
              addressLine1: selectedOrder.customer.addressLine1 || '',
              state: selectedOrder.customer.state || '',
              postalCode: selectedOrder.customer.postalCode || '',
            },
            payment: {
              ...selectedOrder.payment,
            },
          }}
          onClose={() => setSelectedOrder(null)}
          onUpdate={load}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, orderId: null, isBulk: false, count: 0 })}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.isBulk ? "Delete Multiple Orders" : "Delete Order"}
        message={deleteModal.isBulk 
          ? "Are you sure you want to delete the selected orders?"
          : "Are you sure you want to delete this order?"
        }
        isDeleting={isDeleting}
        isBulk={deleteModal.isBulk}
        count={deleteModal.count}
      />
      </div>
    </>
  );
}




