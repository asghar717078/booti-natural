import { NextResponse } from 'next/server';
import { orders } from '@/lib/data';
import { formatOrder } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    return NextResponse.json(formatOrder(newOrder), { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
