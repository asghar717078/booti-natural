import { products, categories } from './data';

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
  const category = categories.find((c) => c.id === product.categoryId);
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
    category: category ? formatCategory(category) : null,
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
