'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle Enter key
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-[100px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 animate-in slide-in-from-top-4 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <svg 
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full h-14 pl-14 pr-14 text-base outline-none border-b border-gray-200 placeholder-gray-400 font-inter"
          />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto font-inter">
          {!query.trim() ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Start typing to search...
            </div>
          ) : loading ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              No products found for "{query}"
            </div>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product.id || product._id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-[#FAFAF7] transition group"
                  >
                    <div className="w-14 h-14 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#1B3B1A] truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {product.category?.name}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#D4A017]">
                      Rs. {Number(product.price).toLocaleString()}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
