'use client';

import React, { useState } from 'react';
import { Home, BellRing, Briefcase, Wallet, User, LogOut, Menu, X } from 'lucide-react';
import useAppStore from '@/lib/store';
import { MobileFrame, BottomNav } from '@/components/common';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EmployeeLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'available' | 'active' | 'history' | 'account';
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children, currentPage }) => {
  const router = useRouter();
  const { currentUser, logout, cleaningOrders } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const availableCount = cleaningOrders.filter((o) => o.status === 'searching_employee').length;
  const activeCount = cleaningOrders.filter(
    (o) =>
      o.employeeId === currentUser?.id &&
      ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
  ).length;

  const navItems = [
    { icon: <Home size={22} />, label: 'Home', href: '/employee', page: 'home' as const },
    {
      icon: (
        <div className="relative">
          <BellRing size={22} />
          {availableCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {availableCount}
            </span>
          )}
        </div>
      ),
      label: 'Order',
      href: '/employee/available',
      page: 'available' as const,
    },
    {
      icon: (
        <div className="relative">
          <Briefcase size={22} />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
      ),
      label: 'Pekerjaan',
      href: '/employee/active',
      page: 'active' as const,
    },
    { icon: <Wallet size={22} />, label: 'Pendapatan', href: '/employee/history', page: 'history' as const },
    { icon: <User size={22} />, label: 'Akun', href: '/employee/account', page: 'account' as const },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-canvas">
      <MobileFrame>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex-1">
            <h1 className="text-base font-bold text-text-primary flex items-center gap-1.5 font-sans">
              Clean&amp;Nail <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">Employee</span>
            </h1>
            <p className="text-xs text-text-secondary truncate">
              {currentUser?.name || 'Budi Santoso'} • Home Cleaning
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href="/demo"
              className="text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors"
            >
              Role ⇄
            </Link>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-canvas-alt rounded-md transition-colors duration-base"
              aria-label="Toggle menu"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {showMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="bg-card border-b border-border p-4 space-y-2">
            <Link
              href="/employee/account"
              className="block px-4 py-2 text-text-primary hover:bg-canvas-alt rounded-md text-sm transition-colors duration-base"
            >
              Profil &amp; Rekening Pembayaran
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-danger hover:bg-danger/10 rounded-md transition-colors duration-base flex items-center gap-2 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 pb-16">{children}</main>

        {/* Bottom Navigation (PRD Section 6: Home | Order | Pekerjaan | Pendapatan | Akun) */}
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
