'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Tag, ShoppingCart, TrendingUp, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

interface Stats {
  products: number;
  categories: number;
  orders: number;
  revenue: number;
}

interface Order {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/orders'),
        ]);

        const products = productsRes.ok ? await productsRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const orders = ordersRes.ok ? await ordersRes.json() : [];

        const revenue = orders.reduce((sum: number, o: any) => sum + (o.total ?? 0), 0);

        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          revenue,
        });

        setRecentOrders(
          orders
            .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );

        setLowStock(
          products
            .filter((p: any) => (p.stock ?? 0) < 10)
            .map((p: any) => ({ id: p.id, name: p.name, stock: p.stock ?? 0 }))
        );
      } catch (e) {
        console.error('Dashboard fetch error', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Total Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border ${border} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#1B3B1A] text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-[#D4A017] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Clock size={36} className="mb-3 opacity-40" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-6 py-3 font-medium">Order ID</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Total</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/orders/${order._id}`}>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-8)}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{order.customerName}</td>
                      <td className="px-6 py-4 font-semibold text-[#1B3B1A]">Rs. {order.total?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="font-semibold text-[#1B3B1A] text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
              Low Stock
            </h2>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package size={32} className="mb-3 opacity-40" />
              <p className="text-sm">All products well-stocked</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  </div>
                  <div className="ml-3 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                      {p.stock} left
                    </span>
                    <Link href={`/admin/products/${p.id}/edit`} className="text-[#D4A017] hover:text-[#b8891f] transition-colors">
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
