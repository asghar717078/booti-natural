import { NextResponse } from 'next/server';
import { orders } from '@/lib/data';
import { formatOrder } from '@/lib/api-utils';

export async function GET() {
  return NextResponse.json(orders.map(formatOrder));
}
