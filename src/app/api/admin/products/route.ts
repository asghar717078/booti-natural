import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function GET() {
  return NextResponse.json(products.map(formatProduct));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...body
    };
    products.push(newProduct);
    return NextResponse.json(formatProduct(newProduct), { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
