import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const isNew = searchParams.get('is_new');
  const limit = searchParams.get('limit');
  const search = searchParams.get('search');

  let filtered = [...products];

  if (categorySlug) {
    filtered = filtered.filter(p => p.categoryId === (categorySlug === 'powders' ? 1 : categorySlug === 'seeds' ? 2 : -1));
  }
  if (isNew === 'true') {
    filtered = filtered.filter(p => p.isNew);
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (limit) {
    filtered = filtered.slice(0, parseInt(limit));
  }

  return NextResponse.json(filtered.map(formatProduct));
}
