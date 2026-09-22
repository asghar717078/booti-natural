'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string | number;
  name: string;
  price: string | number;
  compare_price: string | number | null;
  image?: string;
  is_new?: boolean;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (!query.trim()) {
          setProducts([]);
          return;
        }
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          // API returns sanity format, map to ProductCard format
          const formatted = data.map((p: any) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            compare_price: p.comparePrice || null,
            image: p.image,
            is_new: p.isNew || false,
          }));
          setProducts(formatted);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-dark-green mb-4">Search Results</h1>
          {query ? (
            <p className="text-gray-600 text-lg">
              {loading ? (
                <span>Searching for "{query}"...</span>
              ) : (
                <span>{products.length} {products.length === 1 ? 'result' : 'results'} for "{query}"</span>
              )}
            </p>
          ) : (
            <p className="text-gray-600 text-lg">Enter a search term to find products.</p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-dark-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-dark-green mb-4">No products found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find anything matching "{query}". Try searching for something else like "Ashwagandha" or "Chia".
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex justify-center items-center"><div className="w-10 h-10 border-4 border-dark-green border-t-transparent rounded-full animate-spin"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
