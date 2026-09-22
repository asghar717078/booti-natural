const fs = require('fs');
const path = require('path');

const routes = {
  'src/app/api/products/route.ts': `import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const isNew = searchParams.get('is_new');
  const limit = searchParams.get('limit');
  const search = searchParams.get('search');

  let filtered = [...products];

  if (categorySlug) {
    filtered = filtered.filter(p => p.categoryId === (categorySlug === 'powders' ? 1 : categorySlug === 'seeds' ? 2 : -1));
  }
  if (isNew === 'true') {
    filtered = filtered.filter(p => p.isNew);
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (limit) {
    filtered = filtered.slice(0, parseInt(limit));
  }

  return NextResponse.json(filtered.map(formatProduct));
}
`,

  'src/app/api/products/[id]/route.ts': `import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id));
  if (!product) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  return NextResponse.json(formatProduct(product));
}
`,

  'src/app/api/categories/route.ts': `import { NextResponse } from 'next/server';
import { categories, products } from '@/lib/data';
import { formatCategory } from '@/lib/api-utils';

export async function GET() {
  const mappedCategories = categories.map(cat => {
    const productCount = products.filter(p => p.categoryId === cat.id).length;
    return { ...formatCategory(cat), product_count: productCount };
  });
  return NextResponse.json(mappedCategories);
}
`,

  'src/app/api/orders/route.ts': `import { NextResponse } from 'next/server';
import { orders } from '@/lib/data';
import { formatOrder } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    return NextResponse.json(formatOrder(newOrder), { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
`,

  'src/app/api/admin/products/route.ts': `import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function GET() {
  return NextResponse.json(products.map(formatProduct));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...body
    };
    products.push(newProduct);
    return NextResponse.json(formatProduct(newProduct), { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
`,

  'src/app/api/admin/products/[id]/route.ts': `import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { formatProduct } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    products[index] = { ...products[index], ...body };
    return NextResponse.json(formatProduct(products[index]));
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  products.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
`,

  'src/app/api/admin/categories/route.ts': `import { NextResponse } from 'next/server';
import { categories, products } from '@/lib/data';
import { formatCategory } from '@/lib/api-utils';

export async function GET() {
  const mappedCategories = categories.map(cat => {
    const productCount = products.filter(p => p.categoryId === cat.id).length;
    return { ...formatCategory(cat), product_count: productCount };
  });
  return NextResponse.json(mappedCategories);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCat = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      ...body
    };
    categories.push(newCat);
    return NextResponse.json(formatCategory(newCat), { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
`,

  'src/app/api/admin/categories/[id]/route.ts': `import { NextResponse } from 'next/server';
import { categories } from '@/lib/data';
import { formatCategory } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = categories.findIndex(c => c.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    categories[index] = { ...categories[index], ...body };
    return NextResponse.json(formatCategory(categories[index]));
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = categories.findIndex(c => c.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  categories.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
`,

  'src/app/api/admin/orders/route.ts': `import { NextResponse } from 'next/server';
import { orders } from '@/lib/data';
import { formatOrder } from '@/lib/api-utils';

export async function GET() {
  return NextResponse.json(orders.map(formatOrder));
}
`,

  'src/app/api/admin/orders/[id]/route.ts': `import { NextResponse } from 'next/server';
import { orders } from '@/lib/data';
import { formatOrder } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const index = orders.findIndex(o => o.id === parseInt(params.id));
  if (index === -1) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  
  try {
    const body = await request.json();
    if (body.status) {
      orders[index].status = body.status;
      orders[index].updatedAt = new Date().toISOString();
    }
    return NextResponse.json(formatOrder(orders[index]));
  } catch (error) {
    return NextResponse.json({ detail: 'Invalid data' }, { status: 400 });
  }
}
`
};

for (const [routePath, content] of Object.entries(routes)) {
  const fullPath = path.join(__dirname, routePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`Created ${routePath}`);
}
