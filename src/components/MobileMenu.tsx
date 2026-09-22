'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const links = ['Home', 'All Products', 'New Arrivals', 'Powders', 'Seeds', 'Contact'];

  return (
    <div className="fixed inset-0 z-[100] flex md:hidden font-inter">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-[85%] max-w-[320px] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="font-playfair text-xl font-bold text-[#1B3B1A]">Booti Natural</span>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-[#1B3B1A] transition-colors bg-gray-50 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {links.map((item) => {
            const href = item === 'Home' ? '/' : 
                         item === 'All Products' ? '/products' : 
                         item === 'Contact' ? '/contact' : 
                         item === 'New Arrivals' ? '/products?is_new=true' :
                         `/products?category=${item.toLowerCase().replace(' ', '-')}`;
            
            return (
              <Link 
                key={item} 
                href={href} 
                onClick={onClose}
                className="block px-4 py-3 rounded-xl text-[16px] font-medium text-[#1B3B1A] hover:bg-[#FAFAF7] hover:text-[#D4A017] transition-all"
              >
                {item}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <p className="text-center text-[#9CA3AF] text-[12px]">© 2025 Booti Natural</p>
        </div>
      </div>
    </div>
  );
}
