import { NextResponse } from 'next/server';
import { writeClient, client } from '@/lib/sanity';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const patch: Record<string, any> = {};

    // Fetch existing order to compare status
    const existing = await client.fetch(`*[_type == "order" && _id == $id][0]{ status, items }`, { id: params.id });
    
    if (body.status) patch.status = body.status;
    if (body.notes !== undefined) patch.notes = body.notes;

    await writeClient.patch(params.id).set(patch).commit();
    
    // If transitioning to cancelled, restore stock
    if (body.status === 'cancelled' && existing?.status !== 'cancelled' && existing?.items?.length > 0) {
      const transaction = writeClient.transaction();
      existing.items.forEach((item: any) => {
        if (item.productId) {
          transaction.patch(item.productId, (p) => p.setIfMissing({ stock: 0 }).inc({ stock: item.quantity }));
        }
      });
      await transaction.commit().catch(console.error);
    }

    const updated = await client.fetch(
      `*[_type == "order" && _id == $id][0]{
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
      { id: params.id }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PUT /api/admin/orders/[id]]', error);
    return NextResponse.json({ detail: 'Failed to update order' }, { status: 400 });
  }
}
