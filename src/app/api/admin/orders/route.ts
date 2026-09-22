import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { formatSanityOrder } from '@/lib/api-utils';

export async function GET() {
  try {
    const orders = await client.fetch(
      `*[_type == "order"] | order(_createdAt desc) {
        _id, customerName, customerEmail, phone, address, city, postalCode,
        items, total, status, paymentMethod, notes, _createdAt
      }`
    );
    return NextResponse.json(orders.map(formatSanityOrder));
  } catch (error) {
    console.error('[GET /api/admin/orders]', error);
    return NextResponse.json({ detail: 'Failed to fetch orders' }, { status: 500 });
  }
}
