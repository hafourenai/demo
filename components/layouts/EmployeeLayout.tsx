'use client';

import React, { useState } from 'react';
import { Home, BellRing, Briefcase, Wallet } from 'lucide-react';
import useAppStore from '@/lib/store';
import { MobileFrame, BottomNav } from '@/components/common';
import Link from 'next/link';
import { seedEmployees } from '@/lib/seed';
import { ProfileSettingsModal } from '@/components/profile/ProfileSettingsModal';

interface EmployeeLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'available' | 'active' | 'history' | 'account';
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children, currentPage }) => {
  const { currentUser, employees, cleaningOrders } = useAppStore();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0] || seedEmployees[0];
  const photo = employee?.photo || seedEmployees[0].photo;
  const name = employee?.name || 'Budi Santoso';

  const availableCount = cleaningOrders.filter((o) => o.status === 'searching_employee').length;
  const activeCount = cleaningOrders.filter(
    (o) =>
      o.employeeId === (currentUser?.id || employee.id) &&
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
              {name} • Home Cleaning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors hidden sm:inline-block"
            >
              Role ⇄
            </Link>

            {/* Circular Profile Avatar Button */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="relative p-0.5 rounded-full ring-2 ring-primary/25 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all group shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
              title="Profil & Pengaturan Mitra"
              aria-label="Profil & Pengaturan Mitra"
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

        {/* Bottom Navigation (PRD Section 6: Home | Order | Pekerjaan | Pendapatan | Akun) */}
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
