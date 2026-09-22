"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string | number;
  name: string;
  price: string | number;
  quantity: number;
  image?: string;
  variant?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('bootinatural_cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        console.error('Failed to parse cart data');
      }
    }
  }, []);

  // Save to local storage when cart changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bootinatural_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.variant === item.variant);
      if (existing) {
        return prev.map(i => 
          (i.id === item.id && i.variant === item.variant) 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto open drawer on add
  };

  const removeFromCart = (id: string | number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const cartCount = cartItems.length;
  
  const cartTotal = cartItems.reduce((total, item) => {
    // Handle price if it comes as a string formatted with commas
    const numericPrice = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/,/g, '')) 
      : item.price;
    return total + (numericPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartCount, 
      cartTotal,
      isCartOpen,
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
