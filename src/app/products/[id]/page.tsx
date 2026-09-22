"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, Droplets, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string | number;
  description: string;
  image?: string;
}

const getUnsplashImage = (name: string) => {
  const nameLower = name?.toLowerCase() || '';
  if (nameLower.includes('sea buckthorn')) return 'https://images.unsplash.com/photo-1627725227702-861f6c4063c1?w=800&q=80';
  if (nameLower.includes('chia')) return 'https://images.unsplash.com/photo-1599388837335-e51c8b321a44?w=800&q=80';
  if (nameLower.includes('sunflower')) return 'https://images.unsplash.com/photo-1596700812423-93664d662b66?w=800&q=80';
  if (nameLower.includes('pumpkin')) return 'https://images.unsplash.com/photo-1603598797746-976cc13e5f2c?w=800&q=80';
  if (nameLower.includes('moringa')) return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80';
  if (nameLower.includes('beetroot')) return 'https://images.unsplash.com/photo-1605342416194-e8400ff50dc0?w=800&q=80';
  if (nameLower.includes('ashwagandha')) return 'https://images.unsplash.com/photo-1613940173873-ce96bd7f3a97?w=800&q=80';
  return 'https://images.unsplash.com/photo-1610631070566-6f7ab5a297e6?w=800&q=80';
};

const placeholderThumbnails = [
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
  'https://images.unsplash.com/photo-1596700812423-93664d662b66?w=400&q=80',
  'https://images.unsplash.com/photo-1613940173873-ce96bd7f3a97?w=400&q=80'
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/products/${id}/`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setMainImage(data.image || getUnsplashImage(data.name));
        }
        
        const allRes = await fetch(`/api/products/`);
        if (allRes.ok) {
          const allData = await allRes.json();
          const related = allData.filter((p: Product) => p.id !== Number(id)).slice(0, 2);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-dark-green font-bold text-xl">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-dark-green font-bold text-xl">Product not found.</div>;
  }

  const numericPrice = typeof product.price === 'string'
    ? parseFloat(product.price.replace(/,/g, ''))
    : product.price;

  const currentPrice = numericPrice;
  const originalPrice = numericPrice + 300;

  const handleAddToCart = () => {
    addToCart({
      id: Number(product.id),
      name: product.name,
      price: currentPrice,
      image: product.image || getUnsplashImage(product.name),
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const allImages: string[] = [
    product.image || getUnsplashImage(product.name),
    ...(product.images || []).map((img: any) => img.image)
  ].filter(Boolean);

  return (
    <div className="bg-cream min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* LEFT SIDE - Images (50%) */}
          <div className="w-full lg:w-1/2 sticky top-28 h-fit">

            <div className="relative mb-6">
              {/* Decorative circular backgrounds mimicking Virsapure */}
              <div className="absolute inset-0 bg-[#F2F6DC] rounded-full blur-2xl opacity-60 transform scale-110 -translate-y-4"></div>

              <div className="relative bg-[#FAFAF7] rounded-[24px] overflow-hidden aspect-square flex items-center justify-center z-10 p-6">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.png';
                  }}
                />
              </div>
            </div>

            {/* Thumbnails with Arrows */}
            {allImages.length > 1 && (
            <div className="flex items-center gap-2 mt-4">
              <button className="p-2 text-gray-400 hover:text-dark-green transition-colors"><ChevronLeft size={24} /></button>
              <div className="flex gap-4 overflow-x-hidden flex-grow justify-center">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 flex-shrink-0 rounded-[12px] overflow-hidden border-2 transition-all duration-300 p-1 bg-white ${mainImage === img ? 'border-gold shadow-sm scale-105' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img 
                      src={img} 
                      alt={`thumbnail ${idx}`} 
                      className="w-full h-full object-cover rounded-md" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
              <button className="p-2 text-gray-400 hover:text-dark-green transition-colors"><ChevronRight size={24} /></button>
            </div>
            )}
          </div>

          {/* RIGHT SIDE - Details (50%) */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <h1 className="text-3xl md:text-[32px] font-playfair font-bold text-dark-green mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-gray-500 text-sm font-medium">({(Number(id) * 17) % 150 + 45} reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-2">
              <span className="text-gray-400 text-lg line-through decoration-gray-300">Rs. {originalPrice.toLocaleString()}.00 PKR</span>
              <span className="text-[26px] font-bold text-dark-green">Rs. {currentPrice.toLocaleString()}.00 PKR</span>
              <span className="bg-gold text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm mb-2">
                Sale
              </span>
            </div>

            <p className="text-gray-500 text-xs mb-8">
              <span className="underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-dark-green transition-colors">Shipping</span> calculated at checkout.
            </p>

            {/* Trust Badges */}
            <div className="bg-[#F5F5F5] rounded-[16px] p-6 mb-8">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="text-dark-green mb-2"><Droplets size={24} /></div>
                  <span className="text-[10px] font-bold text-dark-green uppercase tracking-wide">100% PURE</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-dark-green mb-2"><Truck size={24} /></div>
                  <span className="text-[10px] font-bold text-dark-green uppercase tracking-wide">FAST DELIVERY</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-dark-green mb-2"><ShieldCheck size={24} /></div>
                  <span className="text-[10px] font-bold text-dark-green uppercase tracking-wide">LAB TESTED</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 mb-8">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-sm font-bold text-dark-green">Trusted by 50,000+ Families</span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center border border-gray-300 rounded-full">
                <button 
                  onClick={decreaseQty}
                  className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 rounded-l-full transition"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="w-16 text-center text-base font-medium">
                  {quantity}
                </span>
                <button 
                  onClick={increaseQty}
                  className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-100 rounded-r-full transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-white border border-dark-green text-dark-green font-bold text-lg rounded-full shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-dark-green text-white font-bold text-lg rounded-full shadow-md hover:bg-[#122711] transition-all active:scale-[0.98]"
              >
                Buy it now
              </button>
            </div>

            {/* Frequently Bought Together */}
            {relatedProducts.length > 0 && (
            <div className="border border-gray-200 rounded-[16px] p-6 mb-8 bg-white shadow-sm">
              <h3 className="font-bold text-dark-green text-lg mb-4">Frequently bought together</h3>

              <div className="space-y-4">
                {relatedProducts.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-dark-green rounded text-dark-green focus:ring-dark-green" />
                    <img 
                      src={item.image || getUnsplashImage(item.name)} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover bg-gray-50 rounded-lg border border-gray-200" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.png';
                      }}
                    />
                    <div className="flex-grow">
                      <h4 className="font-bold text-dark-green text-sm line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-xs line-through">Rs. {(Number(item.price) + 300).toLocaleString()}</span>
                        <span className="font-bold text-green-700 text-sm">Rs. {Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                    {/* Tiny quantity selector for cross-sell */}
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                      <button className="px-2 py-1 text-gray-500 hover:bg-gray-100"><Minus size={12} /></button>
                      <span className="w-6 text-center text-xs font-bold">1</span>
                      <button className="px-2 py-1 text-gray-500 hover:bg-gray-100"><Plus size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 bg-dark-green text-white font-bold text-sm rounded-full shadow-sm hover:bg-[#122711] transition-all">
                Add selected to cart
              </button>
            </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
