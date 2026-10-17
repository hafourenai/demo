'use client';

import React from 'react';
import { Home, ShoppingBag, Package, Clock, User } from 'lucide-react';
import { MobileFrame, BottomNav } from '@/components/common';

interface CustomerLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'services' | 'products' | 'orders' | 'account';
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, currentPage }) => {
  const navItems = [
    { icon: <Home size={24} />, label: 'Home', href: '/customer', page: 'home' as const },
    { icon: <ShoppingBag size={24} />, label: 'Services', href: '/customer/services', page: 'services' as const },
    { icon: <Package size={24} />, label: 'Products', href: '/customer/products', page: 'products' as const },
    { icon: <Clock size={24} />, label: 'Orders', href: '/customer/orders', page: 'orders' as const },
    { icon: <User size={24} />, label: 'Account', href: '/customer/account', page: 'account' as const },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-bg-primary">
      <MobileFrame>
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
