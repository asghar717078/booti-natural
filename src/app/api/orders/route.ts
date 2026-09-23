import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';
import { formatSanityOrder } from '@/lib/api-utils';
import { sendOrderEmails } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const doc = {
      _type: 'order',
      customerName: body.customer_name ?? body.customerName ?? body.first_name ?? '',
      customerEmail: body.customer_email ?? body.customerEmail ?? body.email ?? '',
      phone: body.phone ?? '',
      address: body.address ?? '',
      city: body.city ?? '',
      postalCode: body.postal_code ?? body.postalCode ?? '',
      items: (body.items ?? []).map((item: any) => ({
        _key: `${item.id ?? item.productId}-${Date.now()}`,
        productId: String(item.id ?? item.productId ?? ''),
        name: item.name ?? '',
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 1),
        image: item.image ?? '',
      })),
      subtotal: Number(body.subtotal ?? body.total ?? 0),
      shipping: Number(body.shipping ?? 0),
      total: Number(body.total ?? body.total_amount ?? 0),
      status: 'pending',
      paymentMethod: body.payment_method ?? body.paymentMethod ?? 'cod',
      notes: body.notes ?? '',
      createdAt: new Date().toISOString(),
    };

    const created = await writeClient.create(doc);
    
    // Decrement stock for all items
    if (doc.items.length > 0) {
      const transaction = writeClient.transaction();
      doc.items.forEach((item: any) => {
        if (item.productId) {
          transaction.patch(item.productId, (p) => p.setIfMissing({ stock: 0 }).dec({ stock: item.quantity }));
        }
      });
      await transaction.commit().catch(console.error); // don't block response if it fails
    }
    
    // Trigger emails in background
    sendOrderEmails(doc).catch(console.error);

    return NextResponse.json(formatSanityOrder(created), { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders]', error);
    return NextResponse.json({ detail: 'Failed to create order' }, { status: 400 });
  }
}
