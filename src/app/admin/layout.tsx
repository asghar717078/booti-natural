'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, ShoppingCart,
  Settings, Menu, X, LogOut, Leaf, ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#1B3B1A] text-white">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-[#D4A017] flex items-center justify-center shrink-0">
          <Leaf size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-[15px] leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Booti Natural
          </p>
          <p className="text-[11px] text-white/50 font-inter">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-[#D4A017] text-white shadow-lg shadow-[#D4A017]/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-white/60 group-hover:text-white'} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} className="text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  const isLoginPage = pathname === '/admin/login';
  
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] font-inter">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFAF7] overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex w-[240px] shrink-0 flex-col h-screen fixed left-0 top-0 z-30">
        <Sidebar />
      </div>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <div className={`fixed top-0 left-0 h-screen w-[240px] z-50 lg:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) */}
            <button
              className="lg:hidden text-gray-500 hover:text-[#1B3B1A] transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Breadcrumb / Page title */}
            <div>
              <h1 className="text-[15px] font-semibold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label ?? 'Admin'}
              </h1>
            </div>
          </div>

          {/* Right: admin badge + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#1B3B1A]/5 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-[#D4A017] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">A</span>
              </div>
              <span className="text-[13px] font-medium text-[#1B3B1A]">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
