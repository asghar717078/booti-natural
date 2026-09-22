import { NextResponse } from 'next/server';
import { writeClient, client } from '@/lib/sanity';
import { formatSanityProduct } from '@/lib/api-utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0]{
        _id, name, slug, description, price, comparePrice, stock, rating,
        image, gallery, isActive, isNew, _createdAt, _updatedAt,
        category->{ _id, name, slug }
      }`,
      { id: params.id }
    );

    if (!product) {
      return NextResponse.json({ detail: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(formatSanityProduct(product));
  } catch (error) {
    console.error('[GET /api/admin/products/[id]]', error);
    return NextResponse.json({ detail: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const patch: Record<string, any> = {};

    if (body.name !== undefined) patch.name = body.name;
    if (body.description !== undefined) patch.description = body.description;
    if (body.price !== undefined) patch.price = Number(body.price);
    if (body.compare_price !== undefined) patch.comparePrice = Number(body.compare_price);
    if (body.stock !== undefined) patch.stock = Number(body.stock);
    if (body.rating !== undefined) patch.rating = Number(body.rating);
    if (body.is_active !== undefined) patch.isActive = Boolean(body.is_active);
    if (body.is_new !== undefined) patch.isNew = Boolean(body.is_new);
    if (body.slug !== undefined) patch.slug = { _type: 'slug', current: body.slug };
    if (body.category_id !== undefined) {
      patch.category = { _type: 'reference', _ref: body.category_id };
    }
    if (body.imageAssetId) {
      patch.image = { _type: 'image', asset: { _type: 'reference', _ref: body.imageAssetId } };
    }

    const updated = await writeClient.patch(params.id).set(patch).commit();
    // Re-fetch with relations expanded
    const full = await client.fetch(
      `*[_type == "product" && _id == $id][0]{
        _id, name, slug, description, price, comparePrice, stock, rating,
        image, gallery, isActive, isNew, _createdAt, _updatedAt,
        category->{ _id, name, slug }
      }`,
      { id: params.id }
    );
    return NextResponse.json(formatSanityProduct(full ?? updated));
  } catch (error) {
    console.error('[PUT /api/admin/products/[id]]', error);
    return NextResponse.json({ detail: 'Failed to update product' }, { status: 400 });
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
    console.error('[DELETE /api/admin/products/[id]]', error);
    return NextResponse.json({ detail: 'Failed to delete product' }, { status: 500 });
  }
}
