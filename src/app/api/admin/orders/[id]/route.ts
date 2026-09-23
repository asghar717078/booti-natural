import { NextResponse } from 'next/server';
import { writeClient, client } from '@/lib/sanity';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const patch: Record<string, any> = {};

    if (body.status) patch.status = body.status;
    if (body.notes !== undefined) patch.notes = body.notes;

    await writeClient.patch(params.id).set(patch).commit();

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
