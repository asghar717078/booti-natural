'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    setDeletingId(id);
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B3B1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D5A2A] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Tag size={48} className="mb-4 opacity-30" />
            <p className="text-base font-medium">No categories yet</p>
            <Link href="/admin/categories/new" className="mt-4 text-[#D4A017] text-sm font-medium hover:underline">Create your first category →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Slug</th>
                  <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Description</th>
                  <th className="text-left px-6 py-3 font-medium">Products</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{cat.name}</td>
                    <td className="px-6 py-4 hidden sm:table-cell font-mono text-xs text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[#1B3B1A]/10 text-[#1B3B1A] text-xs font-semibold rounded-full">
                        {cat.product_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#1B3B1A] hover:bg-[#1B3B1A]/5 transition-all"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
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
      </div>
    </div>
  );
}
