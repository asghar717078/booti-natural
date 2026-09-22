"use client";

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

// Reusing fallback image logic for the drawer
const getFallbackImage = (name: string) => {
  const nameLower = name?.toLowerCase() || '';
  if (nameLower.includes('sea buckthorn')) return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108';
  if (nameLower.includes('chia')) return 'https://images.unsplash.com/photo-1519996529931-28324d5a630e';
  if (nameLower.includes('sunflower')) return 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a';
  if (nameLower.includes('pumpkin')) return 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46';
  if (nameLower.includes('moringa')) return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7';
  if (nameLower.includes('beetroot')) return 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82';
  if (nameLower.includes('ashwagandha')) return 'https://images.unsplash.com/photo-1611073150024-4b5f8c8f8c8f';
  return 'https://picsum.photos/80/80';
};

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsCartOpen(false);
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[1000] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-[100vh] w-full sm:w-[450px] bg-white z-[1001] shadow-[-4px_0_20px_rgba(0,0,0,0.1)] flex flex-col font-inter"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#E5E7EB] shrink-0">
              <h2 className="text-[20px] font-bold text-dark-green tracking-wide">Your cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-dark-green transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-grow overflow-y-auto flex flex-col">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
                  <div className="text-gray-300 mb-6">
                    <ShoppingCart size={64} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] font-bold text-dark-green mb-2">Your cart is empty</h3>
                  <p className="text-[14px] text-gray-500 mb-8">Add some products to get started</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-10 py-[16px] bg-dark-green text-white font-bold text-[16px] rounded-full hover:bg-[#122711] transition-all hover:scale-[1.02]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Table Header Row */}
                  <div className="flex justify-between px-[24px] py-[16px] border-b border-[#E5E7EB] shrink-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[1px]">PRODUCT</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[1px]">TOTAL</span>
                  </div>
                  
                  {/* Item List */}
                  <div className="flex-grow">
                    {cartItems.map((item) => {
                      const numericPrice = typeof item.price === 'string' 
                        ? parseFloat(item.price.replace(/,/g, '')) 
                        : item.price;
                        
                      const finalImage = item.image || getFallbackImage(item.name);
                        
                      return (
                        <div key={item.id} className="flex gap-4 px-[24px] py-[20px] border-b border-[#F3F4F6] relative">
                          
                          {/* Image */}
                          <div className="shrink-0">
                            <img 
                              src={finalImage} 
                              alt={item.name} 
                              className="w-[80px] h-[80px] object-cover rounded-lg border border-gray-100"
                            />
                          </div>
                          
                          {/* Product Info (Center) */}
                          <div className="flex-grow pr-4">
                            <h3 className="font-bold text-[15px] text-dark-green leading-snug line-clamp-2 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-[14px] text-gray-500 font-medium">Rs. {numericPrice.toLocaleString()}.00</p>
                            {item.variant && (
                              <p className="text-[12px] text-gray-400 mt-0.5">Variants: {item.variant}</p>
                            )}
                          </div>
                          
                          {/* Total & Controls (Far Right) */}
                          <div className="flex flex-col items-end justify-between shrink-0 min-w-[90px]">
                            <span className="font-bold text-[15px] text-dark-green">
                              Rs. {(numericPrice * item.quantity).toLocaleString()}.00
                            </span>
                            
                            <div className="flex items-center gap-3 mt-4">
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                              
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-[32px] w-[72px]">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-1/3 text-gray-500 hover:bg-gray-100 transition-colors h-full flex items-center justify-center"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-1/3 text-center text-[12px] font-bold text-dark-green">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-1/3 text-gray-500 hover:bg-gray-100 transition-colors h-full flex items-center justify-center"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-[24px] py-[20px] bg-white border-t border-[#E5E7EB] shrink-0">
                
                {/* Special Instructions */}
                <div className="mb-4">
                  <label htmlFor="drawer-instructions" className="sr-only">Order special instructions</label>
                  <textarea 
                    id="drawer-instructions" 
                    placeholder="Order special instructions"
                    className="w-full h-[80px] border border-gray-300 rounded-lg p-3 text-[13px] focus:ring-1 focus:ring-dark-green focus:border-dark-green outline-none resize-none placeholder:text-gray-400"
                  ></textarea>
                </div>
                
                <div className="h-[1px] w-full bg-[#E5E7EB] mb-4"></div>

                <div className="flex justify-between items-end mb-1">
                  <span className="text-[16px] font-bold text-gray-900">Estimated total</span>
                  <span className="text-[18px] font-bold text-dark-green">Rs. {cartTotal.toLocaleString()}.00 PKR</span>
                </div>
                
                <p className="text-[12px] text-gray-500 mb-5">
                  Taxes, discounts and <Link href="/checkout" className="text-gold hover:underline">shipping</Link> calculated at checkout.
                </p>
                
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="block w-full">
                  <button className="w-full h-[56px] bg-dark-green text-white font-bold text-[16px] rounded-full hover:bg-[#122711] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex justify-center items-center">
                    Check out
                  </button>
                </Link>
                
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
