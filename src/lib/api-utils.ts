import { urlFor } from './sanity';

// ---- Sanity formatters (keep snake_case response shape) ----

export function formatSanityCategory(cat: any) {
  if (!cat) return null;
  return {
    id: cat._id,
    name: cat.name,
    slug: cat.slug?.current ?? cat.slug ?? '',
    description: cat.description ?? '',
    image: cat.image ? urlFor(cat.image).url() : null,
    product_count: cat.product_count ?? 0,
  };
}

export function formatSanityProduct(product: any) {
  if (!product) return null;
  const category = product.category ? formatSanityCategory(product.category) : null;

  // Build gallery URLs from Sanity image array
  const images = (product.gallery ?? []).map((img: any) => ({
    image: urlFor(img).url(),
  }));

  return {
    id: product._id,
    name: product.name,
    slug: product.slug?.current ?? product.slug ?? '',
    description: product.description ?? '',
    price: product.price ?? 0,
    compare_price: product.comparePrice ?? null,
    stock: product.stock ?? 0,
    rating: product.rating ?? 5,
    image: product.image ? urlFor(product.image).url() : null,
    images,
    is_active: product.isActive ?? true,
    is_new: product.isNew ?? false,
    category,
    category_id: category?.id ?? null,
    created_at: product._createdAt ?? new Date().toISOString(),
    updated_at: product._updatedAt ?? new Date().toISOString(),
  };
}

export function formatSanityOrder(order: any) {
  if (!order) return null;
  return {
    id: order._id,
    customer_name: order.customerName,
    customer_email: order.customerEmail ?? '',
    phone: order.phone ?? '',
    address: order.address ?? '',
    city: order.city ?? '',
    postal_code: order.postalCode ?? '',
    items: order.items ?? [],
    total: order.total ?? 0,
    status: order.status ?? 'pending',
    payment_method: order.paymentMethod ?? 'cod',
    notes: order.notes ?? '',
    created_at: order._createdAt ?? new Date().toISOString(),
  };
}

// ---- Legacy helpers kept for backward compat ----

export function formatCategory(cat: any) {
  if (!cat) return null;
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
  };
}

export function formatProduct(product: any) {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compare_price: product.comparePrice,
    stock: product.stock,
    rating: product.rating,
    image: product.image,
    images: product.images || [],
    is_active: product.isActive,
    is_new: product.isNew,
    category: null,
    category_id: product.categoryId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function formatOrder(order: any) {
  if (!order) return null;
  return {
    id: order.id,
    first_name: order.firstName,
    last_name: order.lastName,
    email: order.email,
    address: order.address,
    total_amount: order.totalAmount,
    status: order.status || 'pending',
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: order.updatedAt || new Date().toISOString(),
  };
}
