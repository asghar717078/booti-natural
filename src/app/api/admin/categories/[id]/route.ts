import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';
import { formatSanityCategory } from '@/lib/api-utils';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const patch: Record<string, any> = {};
    if (body.name !== undefined) patch.name = body.name;
    if (body.description !== undefined) patch.description = body.description;
    if (body.slug !== undefined) patch.slug = { _type: 'slug', current: body.slug };

    const updated = await writeClient.patch(params.id).set(patch).commit();
    return NextResponse.json(formatSanityCategory(updated));
  } catch (error) {
    console.error('[PUT /api/admin/categories/[id]]', error);
    return NextResponse.json({ detail: 'Failed to update category' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await writeClient.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[DELETE /api/admin/categories/[id]]', error);
    return NextResponse.json({ detail: 'Failed to delete category' }, { status: 500 });
  }
}
