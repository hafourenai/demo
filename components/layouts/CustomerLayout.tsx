'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Sparkles, ShoppingBag, Clock, User } from 'lucide-react';
import { MobileFrame, BottomNav } from '@/components/common';

interface CustomerLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'services' | 'products' | 'orders' | 'account';
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, currentPage }) => {
  const navItems = [
    { icon: <Home size={22} />, label: 'Home', href: '/customer', page: 'home' as const },
    { icon: <Sparkles size={22} />, label: 'Cleaning', href: '/customer/services', page: 'services' as const },
    { icon: <ShoppingBag size={22} />, label: 'Belanja', href: '/customer/products', page: 'products' as const },
    { icon: <Clock size={22} />, label: 'Pesanan', href: '/customer/orders', page: 'orders' as const },
    { icon: <User size={22} />, label: 'Akun', href: '/customer/account', page: 'account' as const },
  ];

  return (
    <div className="customer-shell flex justify-center min-h-screen bg-canvas">
      <MobileFrame>
        <header className="customer-topbar">
          <Link href="/customer" className="font-serif text-xl font-bold text-primary flex items-center gap-1.5">
            Clean<span className="text-accent">&amp;</span>Nail
            <span className="text-xs font-sans font-normal px-1.5 py-0.5 rounded bg-primary/10 text-primary">V2</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
            >
              Demo Switcher ⇄
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-16">{children}</main>

        {/* Bottom Navigation (PRD Section 5: Home | Cleaning | Belanja | Pesanan | Akun) */}
        <BottomNav
          items={navItems.map((item) => ({
            ...item,
            active: item.page === currentPage,
          }))}
        />
      </MobileFrame>
    </div>
  );
};
