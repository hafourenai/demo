'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import { MobileFrame, BottomNav } from '@/components/common';
import useAppStore from '@/lib/store';
import { seedCustomers } from '@/lib/seed';
import { ProfileSettingsModal } from '@/components/profile/ProfileSettingsModal';

interface CustomerLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'services' | 'products' | 'orders' | 'account';
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, currentPage }) => {
  const { currentUser, customers } = useAppStore();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const customer = customers.find((c) => c.id === currentUser?.id) || customers[0] || seedCustomers[0];
  const photo = customer?.photo || seedCustomers[0].photo;
  const name = customer?.name || 'Clarissa Amanda';

  // Bottom Nav items: Akun removed because profile & settings are accessible via the top-right circular avatar!
  const navItems = [
    { icon: <Home size={22} />, label: 'Home', href: '/customer', page: 'home' as const },
    { icon: <Sparkles size={22} />, label: 'Cleaning', href: '/customer/services', page: 'services' as const },
    { icon: <ShoppingBag size={22} />, label: 'Belanja', href: '/customer/products', page: 'products' as const },
    { icon: <Clock size={22} />, label: 'Pesanan', href: '/customer/orders', page: 'orders' as const },
  ];

  return (
    <div className="customer-shell flex justify-center min-h-screen bg-canvas">
      <MobileFrame>
        <header className="customer-topbar sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all shadow-xs">
          <Link href="/customer" className="font-serif text-xl font-bold text-primary flex items-center gap-1.5">
            Clean<span className="text-accent">&amp;</span>Nail
            <span className="text-xs font-sans font-normal px-1.5 py-0.5 rounded bg-primary/10 text-primary">V2</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href="/demo"
              className="text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors hidden sm:flex items-center gap-1"
            >
              Demo Switcher ⇄
            </Link>

            {/* Circular Profile Avatar Button */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="relative p-0.5 rounded-full ring-2 ring-primary/25 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all group shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
              title="Profil & Pengaturan"
              aria-label="Profil & Pengaturan"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-pink-100 flex items-center justify-center">
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform" />
            </button>
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

        {/* Profile & Settings Modal */}
        <ProfileSettingsModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      </MobileFrame>
    </div>
  );
};
