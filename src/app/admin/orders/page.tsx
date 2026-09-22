'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Filter } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then(setOrders).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
    setUpdatingId(null);
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === s
                ? 'bg-[#1B3B1A] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1B3B1A]/30'
            }`}
          >
            {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <ShoppingCart size={48} className="mb-4 opacity-30" />
            <p className="text-base font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Total</th>
                  <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Payment</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right px-6 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-8)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#1B3B1A]">Rs. {order.total?.toLocaleString()}</td>
                    <td className="px-6 py-4 hidden sm:table-cell text-gray-500 capitalize text-xs">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#D4A017] text-xs font-semibold hover:underline"
                      >
                        View →
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
  );
}
