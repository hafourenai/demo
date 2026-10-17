'use client';

import React, { useState } from 'react';
import { Home, CheckCircle, History, User, LogOut, Menu, X } from 'lucide-react';
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
  const { currentUser, logout } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', href: '/employee', page: 'home' as const },
    { icon: <CheckCircle size={24} />, label: 'Available', href: '/employee/available', page: 'available' as const },
    { icon: <CheckCircle size={24} />, label: 'Active', href: '/employee/active', page: 'active' as const },
    { icon: <History size={24} />, label: 'History', href: '/employee/history', page: 'history' as const },
    { icon: <User size={24} />, label: 'Account', href: '/employee/account', page: 'account' as const },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-bg-primary">
      <MobileFrame>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-text-primary font-serif">Salon & Beauty</h1>
            <p className="text-xs text-text-muted">Employee • {currentUser?.name}</p>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-bg-alt rounded-md transition-colors duration-base"
            aria-label="Toggle menu"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="bg-card border-b border-border p-4 space-y-2">
            <Link
              href="/employee/account"
              className="block px-4 py-2 text-text-primary hover:bg-bg-alt rounded-md transition-colors duration-base"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-danger hover:bg-danger/10 rounded-md transition-colors duration-base flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}

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
