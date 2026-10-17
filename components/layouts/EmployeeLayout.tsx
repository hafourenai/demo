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
    <div className="flex justify-center min-h-screen bg-gray-100">
      <MobileFrame>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">Salon & Beauty</h1>
            <p className="text-xs text-gray-500">Employee • {currentUser?.name}</p>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="bg-white border-b border-gray-200 p-4 space-y-2">
            <Link
              href="/employee/account"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
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
