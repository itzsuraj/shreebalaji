'use client';

import { useState, useEffect } from 'react';
import { 
  X, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, 
  Edit, Save, Tag, MessageSquare, Printer, Mail as MailIcon,
  CreditCard, ExternalLink
} from 'lucide-react';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { getProductImage } from '@/utils/imageUtils';

interface OrderItem {
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
}

interface TimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    gstin?: string;
  };
  payment: {
    method: string;
    status: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  status: string;
  totalInPaise: number;
  subtotalInPaise: number;
  shippingInPaise: number;
  gstInPaise: number;
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
  };
  timeline?: TimelineEvent[];
  internalNotes?: string;
  customerNotes?: string;
  notes?: string;
  tags?: string[];
}

interface ShopifyOrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ShopifyOrderDetail({ order, onClose, onUpdate }: ShopifyOrderDetailProps) {
  const { toast, showToast, hideToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullOrder, setFullOrder] = useState<Order>(order);
  const [editedOrder, setEditedOrder] = useState({
    status: order.status,
    trackingNumber: order.trackingNumber || order.fulfillment?.trackingNumber || '',
    carrier: order.fulfillment?.carrier || '',
    trackingUrl: order.fulfillment?.trackingUrl || '',
    internalNotes: order.internalNotes || '',
    customerNotes: order.customerNotes || '',
    tags: order.tags || [],
    estimatedDelivery: order.estimatedDelivery || order.fulfillment?.estimatedDelivery || '',
  });
  const [newTag, setNewTag] = useState('');

  // Fetch full order data when component mounts
  useEffect(() => {
    const fetchFullOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${order._id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setFullOrder(data.order);
            setEditedOrder({
              status: data.order.status,
              trackingNumber: data.order.trackingNumber || data.order.fulfillment?.trackingNumber || '',
              carrier: data.order.fulfillment?.carrier || '',
              trackingUrl: data.order.fulfillment?.trackingUrl || '',
              internalNotes: data.order.internalNotes || '',
              customerNotes: data.order.customerNotes || '',
              tags: data.order.tags || [],
              estimatedDelivery: data.order.estimatedDelivery || data.order.fulfillment?.estimatedDelivery || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching full order:', error);
      }
    };
    fetchFullOrder();
  }, [order._id]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      created: 'bg-gray-100 text-gray-800',
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatePayload: {
        status: string;
        internalNotes: string;
        customerNotes: string;
        tags: string[];
        timelineNote: string;
        updatedBy: string;
        fulfillment?: {
          status: string;
          trackingNumber: string;
          carrier: string;
          trackingUrl: string;
          shippedAt: string;
          estimatedDelivery?: string;
        };
        trackingNumber?: string;
        estimatedDelivery?: string;
      } = {
        status: editedOrder.status,
        internalNotes: editedOrder.internalNotes,
        customerNotes: editedOrder.customerNotes,
        tags: editedOrder.tags,
        timelineNote: `Order updated by admin`,
        updatedBy: 'admin',
      };

      // Update fulfillment if tracking number is provided
      if (editedOrder.trackingNumber) {
        updatePayload.fulfillment = {
          status: 'fulfilled',
          trackingNumber: editedOrder.trackingNumber,
          carrier: editedOrder.carrier || 'Standard',
          trackingUrl: editedOrder.trackingUrl || '',
          shippedAt: new Date().toISOString(),
        };
        if (editedOrder.estimatedDelivery) {
          updatePayload.fulfillment.estimatedDelivery = editedOrder.estimatedDelivery;
        }
        updatePayload.trackingNumber = editedOrder.trackingNumber;
      }

      if (editedOrder.estimatedDelivery) {
        updatePayload.estimatedDelivery = editedOrder.estimatedDelivery;
      }

      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.order) {
          setFullOrder(data.order);
        }
        showToast('Order updated successfully', 'success');
        setIsEditing(false);
        onUpdate();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to update order', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast('Error updating order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedOrder.tags.includes(newTag.trim())) {
      setEditedOrder({
        ...editedOrder,
        tags: [...editedOrder.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedOrder({
      ...editedOrder,
      tags: editedOrder.tags.filter(t => t !== tag),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order {fullOrder.orderNumber || `#${fullOrder._id.slice(-8)}`}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {formatDate(fullOrder.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(fullOrder.status)}`}>
                    {getStatusIcon(fullOrder.status)}
                    {fullOrder.status.charAt(0).toUpperCase() + fullOrder.status.slice(1)}
                  </span>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Timeline */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Order Timeline
                  </h3>
                  <div className="space-y-4">
                    {((fullOrder.timeline && fullOrder.timeline.length > 0 
                      ? [...fullOrder.timeline].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      : [
                        { status: fullOrder.status, timestamp: fullOrder.createdAt, note: 'Order created', updatedBy: 'system' }
                      ]
                    )).map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 capitalize">{event.status}</h4>
                            <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                          </div>
                          {event.note && (
                            <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                          )}
                          {event.updatedBy && (
                            <p className="text-xs text-gray-400 mt-1">Updated by: {event.updatedBy}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {fullOrder.items.map((item, index) => {
                      const itemImage = item.image || getProductImage({ 
                        image: item.image, 
                        category: item.category || 'buttons' 
                      });
                      return (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img 
                              src={itemImage} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            {item.sku && <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>}
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                              {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                              {item.pack && <p className="text-sm text-gray-600">Pack: {item.pack}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{(item.price * item.quantity / 100).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">₹{(item.price / 100).toFixed(2)} each</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fulfillment Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      Fulfillment
                    </h3>
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={editedOrder.status}
                          onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="created">Created</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                          <input
                            type="text"
                            value={editedOrder.trackingNumber}
                            onChange={(e) => setEditedOrder({ ...editedOrder, trackingNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter tracking number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                          <input
                            type="text"
                            value={editedOrder.carrier}
                            onChange={(e) => setEditedOrder({ ...editedOrder, carrier: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., India Post, BlueDart"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tracking URL (Optional)</label>
                        <input
                          type="url"
                          value={editedOrder.trackingUrl}
                          onChange={(e) => setEditedOrder({ ...editedOrder, trackingUrl: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://tracking.example.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery</label>
                        <input
                          type="date"
                          value={editedOrder.estimatedDelivery ? new Date(editedOrder.estimatedDelivery).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, estimatedDelivery: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg ${
                        fullOrder.fulfillment?.status === 'fulfilled' 
                          ? 'bg-green-50 border border-green-200' 
                          : fullOrder.fulfillment?.status === 'partial'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Fulfillment Status:</span>
                          <span className={`text-sm font-semibold ${
                            fullOrder.fulfillment?.status === 'fulfilled' 
                              ? 'text-green-700' 
                              : fullOrder.fulfillment?.status === 'partial'
                              ? 'text-yellow-700'
                              : 'text-gray-700'
                          }`}>
                            {fullOrder.fulfillment?.status ? fullOrder.fulfillment.status.charAt(0).toUpperCase() + fullOrder.fulfillment.status.slice(1) : 'Unfulfilled'}
                          </span>
                        </div>
                        {fullOrder.fulfillment?.trackingNumber ? (
                          <>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm text-gray-600">Tracking Number:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{fullOrder.fulfillment.trackingNumber}</span>
                                {fullOrder.fulfillment.trackingUrl && (
                                  <a 
                                    href={fullOrder.fulfillment.trackingUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                            {fullOrder.fulfillment.carrier && (
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-600">Carrier:</span>
                                <span className="font-semibold text-gray-900">{fullOrder.fulfillment.carrier}</span>
                              </div>
                            )}
                            {fullOrder.fulfillment.shippedAt && (
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-600">Shipped On:</span>
                                <span className="font-semibold text-gray-900">{formatDate(fullOrder.fulfillment.shippedAt)}</span>
                              </div>
                            )}
                            {fullOrder.fulfillment.estimatedDelivery && (
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-600">Estimated Delivery:</span>
                                <span className="font-semibold text-gray-900">{formatDate(fullOrder.fulfillment.estimatedDelivery)}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 mt-2">No tracking information available</p>
                        )}
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        {fullOrder.fulfillment?.trackingNumber ? 'Update Fulfillment' : 'Add Tracking'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Notes
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes (Admin Only)</label>
                      {isEditing ? (
                        <textarea
                          value={editedOrder.internalNotes}
                          onChange={(e) => setEditedOrder({ ...editedOrder, internalNotes: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Add internal notes..."
                        />
                      ) : (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                          {fullOrder.internalNotes || 'No internal notes'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
                      {isEditing ? (
                        <textarea
                          value={editedOrder.customerNotes}
                          onChange={(e) => setEditedOrder({ ...editedOrder, customerNotes: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Add customer-facing notes..."
                        />
                      ) : (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                          {fullOrder.customerNotes || 'No customer notes'}
                        </p>
                      )}
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Notes
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{fullOrder.customer.fullName}</p>
                        <p className="text-sm text-gray-600">{fullOrder.customer.addressLine1}</p>
                        {fullOrder.customer.addressLine2 && (
                          <p className="text-sm text-gray-600">{fullOrder.customer.addressLine2}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {fullOrder.customer.city}, {fullOrder.customer.state} {fullOrder.customer.postalCode}
                        </p>
                        {fullOrder.customer.country && fullOrder.customer.country !== 'IN' && (
                          <p className="text-sm text-gray-600">{fullOrder.customer.country}</p>
                        )}
                        {fullOrder.customer.gstin && (
                          <p className="text-sm text-gray-500 mt-1">GSTIN: {fullOrder.customer.gstin}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${fullOrder.customer.phone}`} className="text-sm text-blue-600 hover:underline">
                        {fullOrder.customer.phone}
                      </a>
                    </div>
                    {fullOrder.customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${fullOrder.customer.email}`} className="text-sm text-blue-600 hover:underline">
                          {fullOrder.customer.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{(fullOrder.subtotalInPaise / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹{(fullOrder.shippingInPaise / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="text-gray-900">₹{(fullOrder.gstInPaise / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">₹{(fullOrder.totalInPaise / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Payment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Method</span>
                      <span className="text-gray-900 capitalize">{fullOrder.payment.method}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold ${
                        fullOrder.payment.status === 'paid' || fullOrder.payment.status === 'captured' ? 'text-green-600' : 
                        fullOrder.payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {fullOrder.payment.status.charAt(0).toUpperCase() + fullOrder.payment.status.slice(1)}
                      </span>
                    </div>
                    {fullOrder.payment.razorpayOrderId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Razorpay Order ID:</span>
                        <span className="text-gray-900 text-xs">{fullOrder.payment.razorpayOrderId}</span>
                      </div>
                    )}
                    {fullOrder.payment.razorpayPaymentId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="text-gray-900 text-xs">{fullOrder.payment.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-600" />
                    Tags
                  </h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {editedOrder.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add tag"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {fullOrder.tags && fullOrder.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {fullOrder.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No tags</p>
                      )}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Tags
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.print()}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print Order
                    </button>
                    <button
                      onClick={() => {
                        // Email customer functionality
                        showToast('Email functionality coming soon', 'info');
                      }}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <MailIcon className="h-4 w-4" />
                      Email Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
    </>
  );
}

