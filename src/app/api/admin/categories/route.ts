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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCat = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      ...body
    };
    categories.push(newCat);
    return NextResponse.json(formatCategory(newCat), { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
