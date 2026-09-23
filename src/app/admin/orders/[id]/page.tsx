'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, User, MapPin, CreditCard, Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then((orders: any[]) => {
      const found = orders.find(o => o._id === id);
      if (found) { setOrder(found); setStatus(found.status); }
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleStatusUpdate() {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setOrder((prev: any) => ({ ...prev, status }));
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#1B3B1A] transition-all"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Order #{order._id.slice(-8)}</h1>
          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString('en-PK')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#D4A017]" />
            <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Customer</h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">{order.customerName || 'Unknown Customer'}</span></p>
            <p>{order.customerEmail}</p>
            <p>{order.phone}</p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[#D4A017]" />
            <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Shipping Address</h2>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{order.address}</p>
            <p>{order.city} {order.postalCode}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-[#D4A017]" />
            <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Payment</h2>
          </div>
          <p className="text-sm text-gray-600">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
          <p className="text-xl font-bold text-[#1B3B1A] mt-2">Rs. {order.total?.toLocaleString()}</p>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-[#1B3B1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Update Status</h2>
          <div className="flex gap-3">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 bg-white capitalize"
            >
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={saving || status === order.status}
              className="px-4 py-2 bg-[#1B3B1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D5A2A] disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {saving && <Loader2 size={13} className="animate-spin" />} Save
            </button>
          </div>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
              Current: {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Package size={16} className="text-[#D4A017]" />
          <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Order Items</h2>
        </div>
        {(order.items ?? []).length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No items recorded.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-gray-300 m-auto mt-3" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1B3B1A] text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">@ Rs. {item.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 space-y-2">
          <div className="flex justify-end gap-10 text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium text-gray-800">Rs. {order.subtotal?.toLocaleString() || order.total?.toLocaleString()}</span>
          </div>
          <div className="flex justify-end gap-10 text-sm text-gray-500">
            <span>Shipping</span>
            <span className="font-medium text-gray-800">Rs. {order.shipping?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-end gap-10 pt-2 mt-1 border-t border-gray-200">
            <span className="text-sm text-gray-500 font-medium">Total</span>
            <span className="text-xl font-bold text-[#1B3B1A]">Rs. {order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm font-medium text-amber-800 mb-1">Order Notes</p>
          <p className="text-sm text-amber-700">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
