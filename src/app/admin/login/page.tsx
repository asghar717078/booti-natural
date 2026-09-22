'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Leaf, Eye, EyeOff, Loader2, Check, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen font-inter bg-white overflow-hidden">
      {/* LEFT SIDE: 60% Dark Green */}
      <div className="hidden md:flex md:w-[60%] bg-gradient-to-br from-[#1B3B1A] to-[#2D5A2A] relative flex-col justify-center p-12 lg:p-24 overflow-hidden">
        {/* Decorative blur circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#D4A017] opacity-5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8bc34a] opacity-5 blur-[100px]" />
        
        {/* Large Botanical Leaf SVG */}
        <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c-4-4-8-9-8-14 0-3.3 2.7-6 6-6 1.7 0 3.2.7 4.3 1.8.8-1 2.3-1.8 3.7-1.8 3.3 0 6 2.7 6 6 0 5-4 10-8 14z" />
            <path d="M12 22V10" />
            <path d="M12 16c2-1 4-1 6-3" />
            <path d="M12 14c-2-1-4-1-6-3" />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="w-[60px] h-[60px] rounded-full bg-[#D4A017] flex items-center justify-center mb-6 shadow-lg shadow-[#D4A017]/20">
            <Leaf size={30} className="text-white" />
          </div>
          
          <h1 className="font-playfair text-[42px] font-bold text-white mb-2 leading-tight">
            Booti Natural
          </h1>
          <h2 className="text-[#D4A017] text-[18px] font-medium tracking-[0.15em] uppercase mb-4">
            Admin Panel
          </h2>
          <p className="text-white/70 text-[15px] mb-12 leading-relaxed">
            Manage your store, products, and orders in one place
          </p>

          <ul className="space-y-4">
            {[
              "Manage products and inventory",
              "Track orders and customers",
              "Update prices instantly",
              "Upload product images"
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-white text-[14px]">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-8 left-12 lg:left-24">
          <p className="text-white/50 text-[12px]">© 2025 Booti Natural</p>
        </div>
      </div>

      {/* RIGHT SIDE: 40% Pure White */}
      <div className="w-full md:w-[40%] bg-white flex flex-col justify-center px-6 py-12 lg:px-12 relative h-screen overflow-y-auto">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="w-[40px] h-[40px] rounded-full bg-[#D4A017] flex items-center justify-center shadow-md">
              <Leaf size={20} className="text-white" />
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="font-playfair text-[32px] font-bold text-[#1B3B1A] mb-2">Welcome Back</h2>
            <p className="text-[#6B7280] text-[14px]">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[#374151] text-[13px] font-medium uppercase tracking-[0.5px] mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#D4A017] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bootinatural.com"
                    className="w-full h-[48px] pl-11 pr-4 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4A017] focus:ring-[4px] focus:ring-[#D4A017]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-[#374151] text-[13px] font-medium uppercase tracking-[0.5px] mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#D4A017] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[48px] pl-11 pr-12 bg-white border border-[#E5E7EB] rounded-[8px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D4A017] focus:ring-[4px] focus:ring-[#D4A017]/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-[#D4A017] transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 group-hover:border-[#D4A017] transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer absolute opacity-0 w-full h-full cursor-pointer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    {rememberMe && (
                      <div className="absolute inset-0 bg-[#D4A017] rounded flex items-center justify-center">
                        <Check size={12} className="text-white" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <span className="text-[#374151] text-[13px]">Remember me</span>
                </label>
                <a href="#" className="text-[#D4A017] text-[13px] font-medium hover:underline decoration-[#D4A017]/30 underline-offset-4">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-[8px] px-4 py-3 mt-6">
                <div className="text-red-500 shrink-0">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <p className="text-red-600 text-[13px] font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-6 bg-[#1B3B1A] hover:bg-[#2D5A2A] text-white font-bold text-[15px] rounded-[8px] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_4px_14px_rgba(27,59,26,0.2)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-[#E5E7EB]"></div>
            <span className="px-4 text-[#9CA3AF] text-[12px] uppercase">or</span>
            <div className="flex-grow h-px bg-[#E5E7EB]"></div>
          </div>

          {/* Back to store */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-[#D4A017] text-[14px] font-medium hover:underline decoration-[#D4A017]/30 underline-offset-4">
              <ArrowLeft size={16} />
              Back to Store
            </Link>
          </div>
          
          <div className="mt-12 text-center">
             <p className="text-[#9CA3AF] text-[11px]">© 2025 Booti Natural. Admin access only.</p>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
