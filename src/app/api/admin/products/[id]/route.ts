import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    products[index] = { ...products[index], ...body };
    return NextResponse.json(formatProduct(products[index]));
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  products.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
