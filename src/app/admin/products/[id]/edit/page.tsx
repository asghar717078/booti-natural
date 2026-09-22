'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '../../ProductForm';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setProduct(p);
      setCategories(c);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B3B1A] border-t-transparent rounded-full" />
    </div>
  );

  if (!product || product.detail) return (
    <div className="text-center py-20 text-gray-500">Product not found.</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#1B3B1A] transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Edit Product</h1>
          <p className="text-gray-500 text-sm">{product.name}</p>
        </div>
      </div>
      <ProductForm
        categories={categories}
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          compare_price: product.compare_price,
          stock: product.stock,
          rating: product.rating,
          category_id: product.category?.id ?? '',
          is_active: product.is_active,
          is_new: product.is_new,
          image: product.image,
          imageAssetId: null,
        }}
      />
    </div>
  );
}
