'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '../ProductForm';

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#1B3B1A] transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Add New Product</h1>
          <p className="text-gray-500 text-sm">Fill in the details to add a new product</p>
        </div>
      </div>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
