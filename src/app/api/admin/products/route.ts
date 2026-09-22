import { NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity';
import { formatSanityProduct } from '@/lib/api-utils';
import { allProductsQuery } from '@/lib/queries';

export async function GET() {
  try {
    // Admin sees ALL products including inactive ones
    const products = await client.fetch(
      `*[_type == "product"] | order(_createdAt desc) {
        _id, name, slug, description, price, comparePrice, stock, rating,
        image, gallery, isActive, isNew, _createdAt, _updatedAt,
        category->{ _id, name, slug }
      }`
    );
    return NextResponse.json(products.map(formatSanityProduct));
  } catch (error) {
    console.error('[GET /api/admin/products]', error);
    return NextResponse.json({ detail: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const doc: any = {
      _type: 'product',
      name: body.name,
      slug: body.slug
        ? { _type: 'slug', current: body.slug }
        : { _type: 'slug', current: body.name?.toLowerCase().replace(/\s+/g, '-') },
      description: body.description ?? '',
      price: Number(body.price ?? 0),
      comparePrice: Number(body.compare_price ?? body.comparePrice ?? 0) || undefined,
      stock: Number(body.stock ?? 0),
      rating: Number(body.rating ?? 5),
      isActive: body.is_active ?? body.isActive ?? true,
      isNew: body.is_new ?? body.isNew ?? false,
      createdAt: new Date().toISOString(),
    };

    // Category reference
    if (body.category_id) {
      doc.category = { _type: 'reference', _ref: body.category_id };
    }

    // Image asset reference
    if (body.imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: body.imageAssetId } };
    }

    const created = await writeClient.create(doc);
    return NextResponse.json(formatSanityProduct(created), { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/products]', error);
    return NextResponse.json({ detail: 'Failed to create product' }, { status: 400 });
  }
}
