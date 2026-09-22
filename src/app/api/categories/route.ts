import { NextResponse } from 'next/server';
import { categories, products } from '@/lib/data';
import { formatCategory } from '@/lib/api-utils';

export async function GET() {
  const mappedCategories = categories.map(cat => {
    const productCount = products.filter(p => p.categoryId === cat.id).length;
    return { ...formatCategory(cat), product_count: productCount };
  });
  return NextResponse.json(mappedCategories);
}
