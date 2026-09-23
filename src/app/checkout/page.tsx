"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingCart, ChevronRight, Lock, Truck, Undo2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Specific Unsplash Mapping from user request
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

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartCount, setIsCartOpen, clearCart } = useCart();
  const [shippingMethod] = useState(250);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [billingAddress, setBillingAddress] = useState('same');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const finalTotal = cartTotal + shippingMethod;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Your cart is empty');
    
    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: cartTotal,
        shipping: shippingMethod,
        total: finalTotal,
      };

      console.log('Sending order:', orderData);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', res.status);
      const responseText = await res.text();
      console.log('Response body:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || data.detail || `Server error: ${res.status}`);
      }

      console.log('Order created:', data._id || data.orderId || data.id);
      clearCart();
      router.push(`/order-success/${data._id || data.orderId || data.id}`);

    } catch (error: any) {
      console.error('Order failed:', error);
      alert(`Order failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      
      {/* 1. HEADER */}
      <header className="bg-white sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-5 flex items-center justify-center relative">
          
          <div className="hidden md:flex absolute left-10 items-center gap-1.5 text-gray-500 text-[13px] font-medium">
            <Lock size={14} />
            <span>Secure Checkout</span>
          </div>

          <Link href="/">
            <h1 className="font-playfair font-bold text-2xl md:text-3xl text-dark-green tracking-tight text-center">
              Booti Natural
            </h1>
          </Link>

          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} className="text-dark-green" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#E5E7EB]"></div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-[#E5E7EB] hidden md:block">
        <div className="max-w-[1200px] mx-auto px-10 py-[16px] flex justify-center">
          <div className="flex items-center gap-3 text-[14px] font-medium text-[#6B7280]">
            <span className="text-gold font-bold">Information</span>
            <ChevronRight size={14} className="text-[#6B7280]" />
            <span>Shipping</span>
            <ChevronRight size={14} className="text-[#6B7280]" />
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row bg-[#F9FAFB]">
        
        {/* MOBILE ORDER SUMMARY ACCORDION */}
        <div className="md:hidden w-full bg-[#FAFAF7] border-b border-[#E5E7EB]">
          <button 
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            className="w-full flex items-center justify-between p-6 bg-[#F0F7F0]/50 text-dark-green font-medium"
          >
            <span className="flex items-center gap-2 text-[15px]">
              <ShoppingCart size={18} />
              {isSummaryOpen ? 'Hide order summary' : 'Show order summary'}
              {isSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
            <span className="text-lg font-bold font-playfair">Rs. {finalTotal.toLocaleString()}</span>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isSummaryOpen ? 'max-h-[1000px] border-t border-[#E5E7EB]' : 'max-h-0'}`}>
            <OrderSummaryContent items={cartItems} cartTotal={cartTotal} shipping={shippingMethod} finalTotal={finalTotal} />
          </div>
        </div>

        {/* 2. LEFT COLUMN - FORMS (55%) */}
        <div className="w-full md:w-[55%] p-6 md:p-10 md:pr-12 bg-white md:bg-transparent">
          
          <form className="max-w-2xl mx-auto md:ml-auto md:mr-0" onSubmit={handleSubmit}>
            
            {/* Section 1 — Contact */}
            <section className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[18px] font-bold text-dark-green font-playfair tracking-wide">Contact</h2>
                <Link href="#" className="text-[14px] text-gold hover:underline font-medium">Log in</Link>
              </div>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address" 
                className="w-full h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none transition-all placeholder:text-[#9CA3AF]"
              />
              <div className="flex items-center gap-3 mt-4">
                <input type="checkbox" id="emailOffers" className="w-[18px] h-[18px] text-gold rounded border-gray-300 focus:ring-gold accent-gold" />
                <label htmlFor="emailOffers" className="text-[14px] font-medium text-dark-green">Email me with news and offers</label>
              </div>
            </section>

            {/* Section 2 — Delivery */}
            <section className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <h2 className="text-[18px] font-bold text-dark-green font-playfair tracking-wide mb-4">Delivery</h2>
              <div className="space-y-4">
                
                <div className="relative">
                  <select className="w-full h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] appearance-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none bg-white">
                    <option>Pakistan</option>
                    <option>United Arab Emirates</option>
                    <option>United Kingdom</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="First name" className="w-1/2 h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Last name" className="w-1/2 h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                </div>

                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="Address" className="w-full h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, etc. (optional)" className="w-full h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                
                <div className="flex gap-4">
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="City" className="w-1/2 h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal code (optional)" className="w-1/2 h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                </div>

                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone" className="w-full h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none placeholder:text-[#9CA3AF]" />
                
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="saveInfo" className="w-[18px] h-[18px] text-gold rounded border-gray-300 focus:ring-gold accent-gold" />
                  <label htmlFor="saveInfo" className="text-[14px] font-medium text-dark-green">Save this information for next time</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="smsOffers" className="w-[18px] h-[18px] text-gold rounded border-gray-300 focus:ring-gold accent-gold" />
                  <label htmlFor="smsOffers" className="text-[14px] font-medium text-dark-green">Text me with news and offers</label>
                </div>
              </div>
            </section>

            {/* Section 3 — Shipping Method */}
            <section className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <h2 className="text-[18px] font-bold text-dark-green font-playfair tracking-wide mb-4">Shipping method</h2>
              <div className="border-2 border-gold rounded-lg p-4 bg-[#F0F7F0] flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-[5px] border-gold bg-gold flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  </div>
                  <span className="font-medium text-[14px] text-dark-green">Standard Shipping</span>
                </div>
                <span className="font-bold text-[14px] text-dark-green">Rs. 250.00</span>
              </div>
            </section>

            {/* Section 4 — Payment */}
            <section className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 mb-5 shadow-sm">
              <h2 className="text-[18px] font-bold text-dark-green font-playfair tracking-wide mb-1">Payment</h2>
              <p className="text-[13px] text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                
                {/* Option 1: PAYFAST */}
                <div className={`transition-colors ${paymentMethod === 'payfast' ? 'bg-[#F0F7F0] border-2 border-gold -mb-[1px] relative z-10 rounded-t-lg' : 'bg-white hover:bg-gray-50 border-b border-[#E5E7EB]'}`}>
                  <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setPaymentMethod('payfast')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'payfast'} readOnly className="w-[18px] h-[18px] accent-gold" />
                    <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-medium text-[14px] text-dark-green">PAYFAST (Debit/Credit/Wallet)</span>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-900 text-white text-[8px] font-bold flex items-center justify-center rounded uppercase">Visa</div>
                        <div className="w-8 h-5 bg-orange-500 text-white text-[8px] font-bold flex items-center justify-center rounded uppercase">MC</div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Option 2: COD */}
                <div className={`transition-colors ${paymentMethod === 'cod' ? 'bg-[#F0F7F0] border-2 border-gold -mt-[1px] relative z-10 rounded-b-lg' : 'bg-white hover:bg-gray-50'}`}>
                  <label className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setPaymentMethod('cod')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} readOnly className="w-[18px] h-[18px] accent-gold" />
                    <span className="font-medium text-[14px] text-dark-green">Cash on Delivery (COD)</span>
                  </label>
                  {paymentMethod === 'cod' && (
                    <div className="px-10 pb-4 pt-1 text-[13px] text-gray-600 bg-[#F0F7F0]">
                      Pay with cash upon delivery.
                    </div>
                  )}
                </div>

              </div>
            </section>

            {/* Section 5 — Billing Address */}
            <section className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 mb-6 shadow-sm">
              <h2 className="text-[18px] font-bold text-dark-green font-playfair tracking-wide mb-4">Billing address</h2>
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                
                <label 
                  className={`flex items-center gap-3 p-4 border-b border-[#E5E7EB] cursor-pointer transition-colors ${billingAddress === 'same' ? 'bg-[#F0F7F0] border-2 border-gold relative z-10 -mb-[1px]' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => setBillingAddress('same')}
                >
                  <input type="radio" name="billing" checked={billingAddress === 'same'} readOnly className="w-[18px] h-[18px] accent-gold" />
                  <span className="font-medium text-[14px] text-dark-green">Same as shipping address</span>
                </label>
                
                <label 
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${billingAddress === 'diff' ? 'bg-[#F0F7F0] border-2 border-gold relative z-10' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => setBillingAddress('diff')}
                >
                  <input type="radio" name="billing" checked={billingAddress === 'diff'} readOnly className="w-[18px] h-[18px] accent-gold" />
                  <span className="font-medium text-[14px] text-dark-green">Use a different billing address</span>
                </label>
              </div>
            </section>

            <div className="pb-16">
              <button disabled={isSubmitting} type="submit" className="w-full h-14 bg-[#1B3B1A] text-white font-bold rounded-full hover:bg-[#2D5A2A] transition-all duration-300 text-base flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70 disabled:pointer-events-none">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                {isSubmitting ? 'Processing...' : (paymentMethod === 'cod' ? 'Complete Order' : 'Pay Now')}
              </button>
            </div>

          </form>
        </div>

        {/* 3. RIGHT COLUMN - ORDER SUMMARY (45%) */}
        <div className="hidden md:block w-[45%] bg-[#FAFAF7] border-l border-[#E5E7EB] relative">
          <div className="sticky top-[89px] p-10 h-[calc(100vh-89px)] overflow-y-auto">
            <OrderSummaryContent items={cartItems} cartTotal={cartTotal} shipping={shippingMethod} finalTotal={finalTotal} />
          </div>
        </div>
        
      </div>
    </div>
  );
}

function OrderSummaryContent({ items, cartTotal, shipping, finalTotal }: { items: { id: string|number, name: string, price: string|number, quantity: number, image?: string, variant?: string }[], cartTotal: number, shipping: number, finalTotal: number }) {
  return (
    <div className="p-6 md:p-0">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-[20px] font-bold text-dark-green font-playfair tracking-wide">Order Summary</h2>
        <span className="bg-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {items.length}
        </span>
      </div>
      
      <div className="h-[1px] w-full bg-[#E5E7EB] mb-6"></div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const numericPrice = typeof item.price === 'string' 
            ? parseFloat(item.price.replace(/,/g, '')) 
            : item.price;
            
          // Get proper fallback image
          const finalImage = item.image || getFallbackImage(item.name);
            
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-[80px] h-[80px] rounded-lg border border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                    <img src={finalImage} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[11px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm z-10">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-dark-green leading-tight mb-1">{item.name}</span>
                  {item.variant && <span className="text-[12px] text-gray-500">Variants: {item.variant}</span>}
                  <span className="text-[12px] text-gray-500 mt-0.5">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="text-[14px] font-medium text-dark-green">
                Rs. {(numericPrice * item.quantity).toLocaleString()}.00
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="h-[1px] w-full bg-[#E5E7EB] mb-6"></div>

      {/* Discount Code */}
      <div className="flex gap-3 mb-8">
        <input 
          type="text" 
          placeholder="Discount code" 
          className="flex-grow h-[48px] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] focus:border-gold focus:ring-[3px] focus:ring-gold/10 outline-none bg-white placeholder:text-[#9CA3AF]"
        />
        <button className="px-6 h-[48px] bg-gold text-white font-bold text-[14px] rounded-lg hover:bg-[#b8860b] transition-colors shadow-sm">
          Apply
        </button>
      </div>

      <div className="h-[1px] w-full bg-[#E5E7EB] mb-6"></div>

      {/* Totals */}
      <div className="space-y-3 text-[14px] text-gray-600 mb-6 font-medium">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-dark-green font-bold">Rs. {cartTotal.toLocaleString()}.00</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-dark-green font-bold">Rs. {shipping.toLocaleString()}.00</span>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#E5E7EB] mb-6"></div>

      <div className="flex justify-between items-end mb-2">
        <span className="text-[18px] text-dark-green font-bold font-playfair tracking-wide">Total</span>
        <div className="flex items-end gap-1.5">
          <span className="text-gray-500 text-[13px] mb-1">PKR</span>
          <span className="text-[22px] font-bold text-dark-green font-playfair">Rs. {finalTotal.toLocaleString()}.00</span>
        </div>
      </div>
      
      <p className="text-[12px] text-gray-500 mb-10 text-right">
        Taxes included. Shipping calculated at checkout.
      </p>

      {/* Trust Badges */}
      <div className="bg-[#F3F4F6] rounded-[12px] p-4 flex justify-between items-center mt-auto border border-[#E5E7EB]">
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-dark-green"><Lock size={18} /></div>
          <span className="text-[10px] font-bold text-dark-green uppercase">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-dark-green"><Truck size={18} /></div>
          <span className="text-[10px] font-bold text-dark-green uppercase">Fast Delivery</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-dark-green"><Undo2 size={18} /></div>
          <span className="text-[10px] font-bold text-dark-green uppercase">Easy Returns</span>
        </div>
      </div>
      
    </div>
  );
}
