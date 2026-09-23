import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const orders = await client.fetch(
      `*[_type == "order"] | order(createdAt desc) {
        _id,
        _type,
        customerName,
        customerEmail,
        phone,
        address,
        city,
        postalCode,
        paymentMethod,
        items,
        subtotal,
        shipping,
        total,
        status,
        notes,
        createdAt,
        _createdAt,
        _updatedAt
      }`,
      {},
      { cache: 'no-store' }
    );
    
    console.log(`Fetched ${orders.length} orders from Sanity`);
    
    return NextResponse.json(orders, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}
