"use client";

import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: string | number;
  image?: string;
}

const getUnsplashImage = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('sea buckthorn')) return 'https://images.unsplash.com/photo-1627725227702-861f6c4063c1?w=800&q=80';
  if (nameLower.includes('chia')) return 'https://images.unsplash.com/photo-1599388837335-e51c8b321a44?w=800&q=80';
  if (nameLower.includes('sunflower')) return 'https://images.unsplash.com/photo-1596700812423-93664d662b66?w=800&q=80';
  if (nameLower.includes('pumpkin')) return 'https://images.unsplash.com/photo-1603598797746-976cc13e5f2c?w=800&q=80';
  if (nameLower.includes('moringa')) return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80';
  if (nameLower.includes('beetroot')) return 'https://images.unsplash.com/photo-1605342416194-e8400ff50dc0?w=800&q=80';
  if (nameLower.includes('ashwagandha')) return 'https://images.unsplash.com/photo-1613940173873-ce96bd7f3a97?w=800&q=80';
  return 'https://images.unsplash.com/photo-1610631070566-6f7ab5a297e6?w=800&q=80';
};

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  const imgSrc = image || getUnsplashImage(name);
  
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/,/g, '')) 
    : price;
    
  const originalPrice = numericPrice + 300;

  return (
    <Link href={`/products/${id}`} className="block group h-full">
      <div className="bg-white rounded-[12px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-gray-100 relative">
        
        {/* Sale Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide">
            Sale
          </span>
        </div>

        {/* Image */}
        <div className="relative w-full h-[280px] bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.png';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-[15px] font-bold font-inter text-dark-green group-hover:text-gold transition-colors line-clamp-2 mb-1.5">
            {name}
          </h3>
          
          <div className="flex items-center mb-3">
            <div className="flex text-gold mr-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={12} fill="currentColor" className="text-gold" />
              ))}
            </div>
            <span className="text-gray-400 text-xs font-medium">({(id * 17) % 150 + 45})</span>
          </div>
          
          <div className="mt-auto flex flex-col">
            <span className="text-gray-400 text-xs font-medium line-through mb-0.5">
              Rs. {originalPrice.toLocaleString()}.00 PKR
            </span>
            <p className="text-[18px] font-bold text-dark-green">
              From Rs. {numericPrice.toLocaleString()}.00 PKR
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
