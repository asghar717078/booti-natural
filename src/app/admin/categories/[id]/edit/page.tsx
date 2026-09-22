'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  useEffect(() => {
    fetch(`/api/admin/categories`).then(r => r.json()).then((cats: any[]) => {
      const cat = cats.find(c => c.id === id);
      if (cat) { setName(cat.name); setDescription(cat.description ?? ''); }
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),
      });
      if (!res.ok) throw new Error((await res.json()).detail ?? 'Failed');
      router.push('/admin/categories'); router.refresh();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm('Delete this category?')) return;
    setSaving(true);
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    router.push('/admin/categories'); router.refresh();
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/categories" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#1B3B1A] transition-all"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
          <input required type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
          <input readOnly value={slug} className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A] resize-none" />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button type="submit" disabled={saving} className="px-8 py-3 bg-[#1B3B1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D5A2A] transition-colors disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 size={15} className="animate-spin" />} Save Changes
          </button>
          <button type="button" onClick={() => router.push('/admin/categories')} className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" onClick={handleDelete} className="ml-auto px-6 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors">Delete</button>
        </div>
      </form>
    </div>
  );
}
