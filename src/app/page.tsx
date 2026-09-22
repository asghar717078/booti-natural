import ProductCard from '@/components/ProductCard';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Heart, Beaker, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string | number;
  [key: string]: unknown;
}

import { client } from '@/lib/sanity';
import { formatSanityProduct } from '@/lib/api-utils';
import { allProductsQuery, newArrivalsQuery } from '@/lib/queries';

export const revalidate = 60;

export default async function Home() {
  let newArrivals = [];
  let allProducts = [];

  try {
    const [newArrivalsRaw, allProductsRaw] = await Promise.all([
      client.fetch(newArrivalsQuery),
      client.fetch(allProductsQuery),
    ]);
    
    newArrivals = newArrivalsRaw.map(formatSanityProduct).slice(0, 3);
    allProducts = allProductsRaw.map(formatSanityProduct).slice(0, 8);
  } catch (error) {
    console.error("Failed to fetch products from Sanity:", error);
  }

  return (
    <div className="bg-cream">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[600px] bg-cream overflow-hidden">
        {/* Subtle decorative leaf pattern in the corner */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-light-green rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center relative z-10 py-20 md:py-10">

          {/* Left Side */}
          <div className="w-full md:w-1/2 pr-0 md:pr-12 text-center md:text-left">
            <FadeIn>
              <div className="inline-block bg-gold/10 border border-gold/20 rounded-full px-5 py-2 mb-8 shadow-sm">
                <span className="text-dark-green font-bold text-sm tracking-widest uppercase flex items-center">
                  <span className="mr-2">🌿</span> 100% Organic & Natural
                </span>
              </div>
              <h1 className="text-5xl md:text-[56px] font-playfair font-bold text-dark-green leading-[1.1] mb-6">
                Nature&apos;s Best,<br />Bottled for You
              </h1>
              <p className="text-lg text-text-grey mb-10 max-w-lg mx-auto md:mx-0 font-inter">
                Discover premium organic powders and seeds sourced directly from nature.
                No chemicals. No additives. Just pure goodness.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                <Link href="/products" className="w-full sm:w-auto px-10 py-4 bg-gold text-dark-green font-bold rounded-full hover:scale-105 hover:shadow-lg hover:bg-[#c99515] transition-all duration-300">
                  Shop Now
                </Link>
                <Link href="/about" className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-dark-green text-dark-green font-bold rounded-full hover:bg-dark-green hover:text-white transition-colors duration-300">
                  Our Story
                </Link>
              </div>
              <p className="text-sm text-text-grey font-medium flex items-center justify-center md:justify-start">
                <span className="text-gold mr-1">⭐</span> 10,000+ Happy Customers <span className="mx-2 text-gray-300">|</span> 🚚 Free Shipping
              </p>
            </FadeIn>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 mt-16 md:mt-0 relative h-full flex items-center justify-center">
            <FadeIn delay={0.2}>
              {/* Hero Image Container */}
              <div className="relative w-full max-w-[550px] mx-auto">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-[#FAFAF7]">
                  <img 
                    src="/hero-image.jpg" 
                    alt="Booti Natural - Organic Powders and Seeds" 
                    className="w-full h-full object-contain animate-float"
                  />
                </div>
                
                {/* Decorative blur circles behind */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#D4A017]/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#1B3B1A]/10 rounded-full blur-3xl -z-10" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CSS for custom float animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}} />

      {/* 2. TRUST BADGES BAR */}
      <section className="bg-white py-10 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
            {[
              { icon: '🌿', title: '100% Organic', desc: 'Pure natural ingredients' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above Rs. 2,000' },
              { icon: '💰', title: 'Cash on Delivery', desc: 'Pay when you receive' },
              { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
            ].map((badge, idx) => (
              <div key={idx} className={`flex items-center gap-4 group cursor-default transition-transform duration-300 hover:-translate-y-1 ${idx !== 0 ? 'sm:pl-6 lg:pl-10 pt-6 sm:pt-0' : ''}`}>
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center text-2xl group-hover:bg-gold/20 transition-colors">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-dark-green text-sm uppercase tracking-wide">{badge.title}</h4>
                  <p className="text-text-grey text-sm mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-4xl font-playfair font-bold text-dark-green mb-3">New Arrivals</h2>
                <div className="w-[60px] h-[3px] bg-gold mb-4 rounded-full"></div>
                <p className="text-text-grey text-lg">Freshly sourced from the heart of nature.</p>
              </div>
              <Link href="/products?category=new-arrivals" className="hidden sm:flex items-center text-gold font-bold hover:text-[#c99515] hover:underline underline-offset-4 transition-all">
                View All <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>

            {newArrivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newArrivals.map((product: Product, idx: number) => (
                  <FadeIn key={product.id} delay={idx * 0.15}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image as string | undefined}
                    />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <p className="text-text-grey italic text-center py-10 bg-white rounded-xl shadow-sm">Loading fresh arrivals...</p>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-dark-green mb-3">Shop by Category</h2>
              <div className="w-[60px] h-[3px] bg-gold mx-auto mb-4 rounded-full"></div>
              <p className="text-text-grey text-lg">Find exactly what your body needs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Powders', icon: <Beaker size={28} />, items: '12 Products', slug: 'powders' },
                { name: 'Seeds', icon: <Leaf size={28} />, items: '8 Products', slug: 'seeds' },
                { name: 'Teas', icon: <Heart size={28} />, items: '5 Products', slug: 'teas' },
                { name: 'Skin Care', icon: <ShieldCheck size={28} />, items: '9 Products', slug: 'skin-care' },
              ].map((cat, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <Link href={`/products?category=${cat.slug}`} className="block group">
                    <div className="bg-light-green p-8 rounded-[24px] text-center transition-all duration-300 group-hover:bg-dark-green group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(27,59,26,0.15)] cursor-pointer">
                      <div className="w-16 h-16 mx-auto bg-gold text-white rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                        {cat.icon}
                      </div>
                      <h3 className="text-xl font-bold text-dark-green mb-2 group-hover:text-white transition-colors">{cat.name}</h3>
                      <p className="text-text-grey group-hover:text-gray-300 transition-colors font-medium">{cat.items}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. ALL PRODUCTS */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-4xl font-playfair font-bold text-dark-green mb-3">Bestsellers</h2>
                <div className="w-[60px] h-[3px] bg-gold mb-4 rounded-full"></div>
                <p className="text-text-grey text-lg">Our community&apos;s favorite wellness picks.</p>
              </div>
              <Link href="/products" className="hidden sm:flex items-center text-gold font-bold hover:text-[#c99515] hover:underline underline-offset-4 transition-all">
                View All <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>

            {allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts.map((product: Product, idx: number) => (
                  <FadeIn key={product.id} delay={idx * 0.05}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image as string | undefined}
                    />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <p className="text-text-grey italic text-center py-10">Loading products...</p>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="bg-dark-green py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-white mb-4">Why Choose Booti Natural?</h2>
              <div className="w-[60px] h-[3px] bg-gold mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
              {[
                { icon: '🌱', title: 'Sourced from Nature', desc: 'Directly from certified organic farms around the globe to ensure maximum purity.' },
                { icon: '🔬', title: 'Lab Tested', desc: 'Every batch undergoes rigorous quality checking to meet international safety standards.' },
                { icon: '❤️', title: 'Made with Care', desc: 'No chemicals, no hidden additives, and no artificial preservatives. Just pure love.' }
              ].map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.15} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-gold mb-6 backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-poppins mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{item.desc}</p>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-dark-green mb-3">What Our Customers Say</h2>
              <div className="w-[60px] h-[3px] bg-gold mx-auto mb-4 rounded-full"></div>
              <p className="text-text-grey text-lg">Join thousands of happy people living healthier lives.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Ayesha K.", city: "Lahore", review: "The Ashwagandha powder has completely changed my morning routine. I feel more energetic and focused throughout the day!" },
                { name: "Bilal M.", city: "Islamabad", review: "Absolutely love the packaging and quality. You can tell these are premium organic seeds just by looking at them." },
                { name: "Zainab R.", city: "Karachi", review: "I've tried many brands for Moringa, but Booti Natural is by far the most authentic. Will definitely order again." },
              ].map((testimonial, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="bg-cream p-8 rounded-[24px] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative h-full flex flex-col">
                    <div className="text-gold text-5xl font-serif absolute top-4 right-6 opacity-20">&quot;</div>
                    <div className="flex text-gold mb-6">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={18} fill="currentColor" className="mr-1" />)}
                    </div>
                    <p className="text-gray-600 text-lg italic mb-8 flex-grow leading-relaxed">&quot;{testimonial.review}&quot;</p>
                    <div className="flex items-center mt-auto">
                      <img
                        src={`https://ui-avatars.com/api/?name=${testimonial.name}&background=1B3B1A&color=fff&size=48`}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-dark-green">{testimonial.name}</h4>
                        <p className="text-sm text-text-grey">{testimonial.city}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-gradient-to-br from-[#D4A017] to-[#F0C75E] rounded-[32px] p-10 md:p-16 text-center shadow-[0_20px_40px_rgba(212,160,23,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-dark-green/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10">
                <h2 className="text-4xl font-playfair font-bold text-dark-green mb-4">Get 10% Off Your First Order</h2>
                <p className="text-dark-green/80 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Subscribe to our newsletter for exclusive deals, wellness tips, and early access to new products.
                </p>

                <form className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow px-6 py-4 rounded-full border-none focus:ring-4 focus:ring-white/50 outline-none text-gray-800 shadow-inner"
                    required
                  />
                  <button
                    type="submit"
                    className="px-10 py-4 bg-dark-green text-white font-bold rounded-full hover:bg-[#122711] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-sm text-dark-green/70 mt-6 font-medium">*We care about your privacy. No spam.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
