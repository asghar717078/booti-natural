import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  
  if (!q.trim()) {
    return NextResponse.json([]);
  }
  
  const query = `*[_type == "product" && isActive == true && (
    name match $searchTerm + "*" ||
    description match $searchTerm + "*"
  )] | order(createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    comparePrice,
    stock,
    rating,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    "category": category->{ _id, name, "slug": slug.current }
  }`;
  
  try {
    const products = await client.fetch(query, { 
      searchTerm: q.toLowerCase() 
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
