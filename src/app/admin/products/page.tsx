'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Package, Filter } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  compare_price: number;
  stock: number;
  is_active: boolean;
  is_new: boolean;
  image: string | null;
  category: { id: string; name: string; slug: string } | null;
}

interface Category { id: string; name: string; }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
    }).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? p.category?.id === filterCat : true;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B3B1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D5A2A] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterCat}
            onChange={e => { setFilterCat(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A] bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Package size={48} className="mb-4 opacity-30" />
            <p className="text-base font-medium">No products found</p>
            <Link href="/admin/products/new" className="mt-4 text-[#D4A017] text-sm font-medium hover:underline">Add your first product →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Stock</th>
                  <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Product name + image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          {product.is_new && <span className="text-[10px] font-bold text-[#D4A017] uppercase">New</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                      {product.category?.name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#1B3B1A]">
                      Rs. {product.price?.toLocaleString()}
                      {product.compare_price > product.price && (
                        <span className="ml-1.5 text-xs text-gray-400 line-through font-normal">
                          Rs. {product.compare_price?.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-amber-500' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#1B3B1A] hover:bg-[#1B3B1A]/5 transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-[#1B3B1A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
