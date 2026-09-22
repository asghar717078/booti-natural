import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id));
  if (!product) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  return NextResponse.json(formatProduct(product));
}
