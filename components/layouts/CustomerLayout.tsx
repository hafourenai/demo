'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Package, Clock, User } from 'lucide-react';
import { MobileFrame, BottomNav } from '@/components/common';

interface CustomerLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'services' | 'products' | 'orders' | 'account';
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, currentPage }) => {
  const navItems = [
    { icon: <Home size={22} />, label: 'Beranda', href: '/customer', page: 'home' as const },
    { icon: <ShoppingBag size={22} />, label: 'Layanan', href: '/customer/services', page: 'services' as const },
    { icon: <Package size={22} />, label: 'Produk', href: '/customer/products', page: 'products' as const },
    { icon: <Clock size={22} />, label: 'Pesanan', href: '/customer/orders', page: 'orders' as const },
    { icon: <User size={22} />, label: 'Akun Saya', href: '/customer/account', page: 'account' as const },
  ];

  return (
    <div className="customer-shell flex justify-center min-h-screen bg-canvas">
      <MobileFrame>
        <header className="customer-topbar"><Link href="/customer" className="font-serif text-xl font-bold text-primary">Salon<span className="font-normal text-text-secondary"> / at home</span></Link><span className="text-xs text-text-secondary">Perawatan, di tempatmu.</span></header>
        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Bottom Navigation */}
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
