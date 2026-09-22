import { NextResponse } from 'next/server';
import { orders } from '@/lib/data';
import { formatOrder } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = orders.findIndex(o => o.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    if (body.status) {
      orders[index].status = body.status;
      orders[index].updatedAt = new Date().toISOString();
    }
    return NextResponse.json(formatOrder(orders[index]));
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
