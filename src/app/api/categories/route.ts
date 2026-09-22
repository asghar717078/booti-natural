import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { formatSanityCategory } from '@/lib/api-utils';
import { allCategoriesQuery } from '@/lib/queries';

export async function GET() {
  try {
    const categories = await client.fetch(allCategoriesQuery);
    return NextResponse.json(categories.map(formatSanityCategory));
  } catch (error) {
    console.error('[GET /api/categories]', error);
    return NextResponse.json({ detail: 'Failed to fetch categories' }, { status: 500 });
  }
}
