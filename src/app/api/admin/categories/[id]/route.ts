import { NextResponse } from 'next/server';
import { categories } from '@/lib/data';
import { formatCategory } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = categories.findIndex(c => c.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    categories[index] = { ...categories[index], ...body };
    return NextResponse.json(formatCategory(categories[index]));
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = categories.findIndex(c => c.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  categories.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
