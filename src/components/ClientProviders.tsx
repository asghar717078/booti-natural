"use client";

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import CartDrawer from '@/components/CartDrawer';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        {children}
        <CartDrawer />
      </ToastProvider>
    </CartProvider>
  );
}
