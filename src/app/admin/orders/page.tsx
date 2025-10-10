'use client';

import { useEffect, useState } from 'react';

interface AdminOrderItem {
  _id: string;
  status: string;
  totalInPaise: number;
  payment: { status: string; method: string };
  customer: { fullName: string; phone: string; city: string };
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Payment</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td className="p-2 border font-mono text-xs">{o._id}</td>
                  <td className="p-2 border">{o.customer?.fullName} ({o.customer?.city})</td>
                  <td className="p-2 border">₹{(o.totalInPaise/100).toFixed(2)}</td>
                  <td className="p-2 border">{o.payment?.method} / {o.payment?.status}</td>
                  <td className="p-2 border">{o.status}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      {['processing','shipped','delivered','cancelled'].map(s => (
                        <button key={s} className="px-2 py-1 border rounded text-sm" onClick={() => updateStatus(o._id, s)}>{s}</button>
                      ))}
                      <button className="px-2 py-1 border rounded text-sm text-red-600" onClick={() => remove(o._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}




