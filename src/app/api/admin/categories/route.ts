import { NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity';
import { formatSanityCategory } from '@/lib/api-utils';
import { allCategoriesQuery } from '@/lib/queries';

export async function GET() {
  try {
    const categories = await client.fetch(allCategoriesQuery);
    return NextResponse.json(categories.map(formatSanityCategory));
  } catch (error) {
    console.error('[GET /api/admin/categories]', error);
    return NextResponse.json({ detail: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const doc = {
      _type: 'category',
      name: body.name,
      slug: body.slug
        ? { _type: 'slug', current: body.slug }
        : { _type: 'slug', current: body.name?.toLowerCase().replace(/\s+/g, '-') },
      description: body.description ?? '',
    };

    const created = await writeClient.create(doc);
    return NextResponse.json(formatSanityCategory(created), { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/categories]', error);
    return NextResponse.json({ detail: 'Failed to create category' }, { status: 400 });
  }
}
