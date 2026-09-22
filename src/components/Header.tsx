"use client";

import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [imageError, setImageError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pathname = usePathname();
  if (pathname === '/checkout') return null;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md border-b border-gray-100' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              {!imageError ? (
                <img 
                  src="/logo.png" 
                  alt="Booti Natural" 
                  className="h-[60px] w-auto object-contain" 
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="font-playfair font-bold text-2xl text-dark-green">Booti Natural</span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['Home', 'All Products', 'New Arrivals', 'Powders', 'Seeds', 'Contact'].map((item) => {
              const href = item === 'Home' ? '/' : 
                           item === 'All Products' ? '/products' : 
                           item === 'Contact' ? '/contact' : 
                           `/products?category=${item.toLowerCase().replace(' ', '-')}`;
              
              return (
                <Link 
                  key={item} 
                  href={href} 
                  className={`text-[15px] font-medium hover:text-gold relative group transition-colors ${scrolled ? 'text-gray-700' : 'text-dark-green'}`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>

          {/* Icons */}
          <div className={`flex items-center space-x-6 ${scrolled ? 'text-gray-700' : 'text-dark-green'}`}>
            <button className="hover:text-gold transition-all hover:scale-110" aria-label="Search">
              <Search size={22} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="hover:text-gold transition-all relative hover:scale-110" 
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hover:text-gold transition-all hover:scale-110" aria-label="User Profile">
              <User size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
