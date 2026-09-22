"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/checkout') return null;
  return (
    <footer className="bg-[#122711] text-gray-300 pt-5 pb-3 border-t-[6px] border-gold mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="font-playfair text-3xl font-bold text-white mb-2">Booti Natural</h3>
            <p className="text-sm leading-relaxed text-gray-400 pr-4">
              Your premium destination for 100% organic, lab-tested, and sustainably sourced health powders and seeds. Nature&apos;s best, bottled for you.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-dark-green flex items-center justify-center hover:bg-gold hover:text-dark-green transition-all duration-300 hover:scale-125" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-green flex items-center justify-center hover:bg-gold hover:text-dark-green transition-all duration-300 hover:scale-125" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-green flex items-center justify-center hover:bg-gold hover:text-dark-green transition-all duration-300 hover:scale-125" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-poppins">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">About Us</Link></li>
              <li><Link href="/products" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Shop All</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Our Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-poppins">Categories</h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=powders" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Organic Powders</Link></li>
              <li><Link href="/products?category=seeds" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Healthy Seeds</Link></li>
              <li><Link href="/products?category=teas" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Herbal Teas</Link></li>
              <li><Link href="/products?category=skin-care" className="hover:text-gold transition-colors hover:translate-x-1 inline-block transform duration-300">Skin Care</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-poppins">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Natural Avenue, Wellness District, Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-gold mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+92 300 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-gold mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@bootinatural.com</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Booti Natural. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </footer>
  );
}
