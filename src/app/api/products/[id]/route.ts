import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { formatSanityProduct } from '@/lib/api-utils';
import { productByIdQuery } from '@/lib/queries';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Sanity document IDs are strings (e.g. "drafts.abc" or "abc123")
    const product = await client.fetch(productByIdQuery, { id: params.id });
    if (!product) {
      return NextResponse.json({ detail: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(formatSanityProduct(product));
  } catch (error) {
    console.error('[GET /api/products/[id]]', error);
    return NextResponse.json({ detail: 'Failed to fetch product' }, { status: 500 });
  }
}
