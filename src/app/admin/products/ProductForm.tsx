'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';

interface Category { id: string; name: string; }

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  compare_price: string;
  stock: string;
  rating: string;
  category_id: string;
  is_active: boolean;
  is_new: boolean;
  image: string | null;        // Sanity image URL (resolved)
  imageAssetId: string | null; // Sanity asset _ref
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData & { id: string }>;
  categories: Category[];
  mode: 'create' | 'edit';
}

async function uploadImage(file: File): Promise<{ url: string; assetId: string } | null> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  if (!res.ok) return null;
  return res.json();
}

export default function ProductForm({ initialData, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: String(initialData?.price ?? ''),
    compare_price: String(initialData?.compare_price ?? ''),
    stock: String(initialData?.stock ?? '0'),
    rating: String(initialData?.rating ?? '5'),
    category_id: initialData?.category_id ?? '',
    is_active: initialData?.is_active ?? true,
    is_new: initialData?.is_new ?? false,
    image: initialData?.image ?? null,
    imageAssetId: initialData?.imageAssetId ?? null,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof ProductFormData, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      if (result) {
        set('image', result.url);
        set('imageAssetId', result.assetId);
      } else {
        setError('Image upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        compare_price: parseFloat(form.compare_price) || 0,
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 5,
        category_id: form.category_id || undefined,
        is_active: form.is_active,
        is_new: form.is_new,
        imageAssetId: form.imageAssetId,
      };

      const url = mode === 'create'
        ? '/api/admin/products'
        : `/api/admin/products/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail ?? 'Save failed');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setSaving(true);
    await fetch(`/api/admin/products/${initialData.id}`, { method: 'DELETE' });
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Main Image Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-[#1B3B1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Product Image</h2>
        <div
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-[#1B3B1A]/40 hover:bg-[#1B3B1A]/2 ${form.image ? 'border-[#1B3B1A]/30' : 'border-gray-200'}`}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#1B3B1A]" />
              <span className="text-sm">Uploading to Sanity...</span>
            </div>
          ) : form.image ? (
            <div className="relative">
              <img src={form.image} alt="Product" className="w-full max-h-[300px] object-contain rounded-xl p-2" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); set('image', null); set('imageAssetId', null); }}
                className="absolute top-3 right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
              >
                <X size={14} />
              </button>
              <p className="text-center text-xs text-gray-400 pb-3">Click to change image</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ImagePlus size={24} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Ashwagandha Powder"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            placeholder="Product description..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select
            value={form.category_id}
            onChange={e => set('category_id', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A] bg-white"
          >
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Pricing & Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (PKR) *</label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare Price (PKR)</label>
            <input
              type="number"
              min="0"
              value={form.compare_price}
              onChange={e => set('compare_price', e.target.value)}
              placeholder="Original price"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={e => set('stock', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (0–5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={e => set('rating', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B1A]/20 focus:border-[#1B3B1A]"
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Visibility</h2>
        {[
          { key: 'is_active' as const, label: 'Active', desc: 'Show this product on the storefront' },
          { key: 'is_new' as const, label: 'New Arrival', desc: 'Show "New" badge on product' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <button
              type="button"
              onClick={() => set(key, !form[key])}
              className={`relative w-11 h-6 rounded-full transition-colors ${form[key] ? 'bg-[#1B3B1A]' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[key] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-3 bg-[#1B3B1A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D5A2A] transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto px-6 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
