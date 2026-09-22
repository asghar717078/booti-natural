import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  price: string | number;
  image?: string;
  [key: string]: unknown;
}

import { client } from '@/lib/sanity';
import { formatSanityProduct } from '@/lib/api-utils';
import { allProductsQuery, newArrivalsQuery, productsByCategoryQuery } from '@/lib/queries';

async function getProducts(category?: string, isNew?: string) {
  try {
    let products = [];
    if (isNew === 'true') {
      products = await client.fetch(newArrivalsQuery);
    } else if (category) {
      products = await client.fetch(productsByCategoryQuery, { categorySlug: category });
    } else {
      products = await client.fetch(allProductsQuery);
    }
    return products.map(formatSanityProduct);
  } catch (error) {
    console.error("Failed to fetch products from Sanity:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; is_new?: string };
}) {
  const category = searchParams.category;
  const isNew = searchParams.is_new;
  const products = await getProducts(category, isNew);

  let pageTitle = 'All Products';
  if (category) {
    pageTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  } else if (isNew === 'true') {
    pageTitle = 'New Arrivals';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-poppins font-bold text-dark-green mb-4">
          {pageTitle}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our collection of 100% organic and natural health products. 
          Carefully sourced to bring you the best of nature.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
