import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { formatSanityProduct } from '@/lib/api-utils';
import {
  allProductsQuery,
  newArrivalsQuery,
  productsByCategoryQuery,
} from '@/lib/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const isNew = searchParams.get('is_new');
  const limit = searchParams.get('limit');
  const search = searchParams.get('search');

  try {
    let products: any[];

    if (isNew === 'true') {
      products = await client.fetch(newArrivalsQuery);
    } else if (categorySlug) {
      products = await client.fetch(productsByCategoryQuery, { categorySlug });
    } else {
      products = await client.fetch(allProductsQuery);
    }

    // Client-side search filter (GROQ contains() could also be used)
    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p: any) =>
        p.name?.toLowerCase().includes(q)
      );
    }

    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    return NextResponse.json(products.map(formatSanityProduct));
  } catch (error) {
    console.error('[GET /api/products]', error);
    return NextResponse.json({ detail: 'Failed to fetch products' }, { status: 500 });
  }
}
