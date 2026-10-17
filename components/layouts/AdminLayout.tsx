'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  ShoppingBag,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
    { icon: <Users size={20} />, label: 'Customer', href: '/admin/customers' },
    { icon: <Briefcase size={20} />, label: 'Karyawan', href: '/admin/employees' },
    { icon: <ShoppingBag size={20} />, label: 'Layanan', href: '/admin/services' },
    { icon: <Package size={20} />, label: 'Produk', href: '/admin/products' },
    { icon: <Ticket size={20} />, label: 'Promo', href: '/admin/promos' },
    { icon: <BarChart3 size={20} />, label: 'Order', href: '/admin/orders' },
    { icon: <BarChart3 size={20} />, label: 'Laporan', href: '/admin/reports' },
    { icon: <Settings size={20} />, label: 'Pengaturan', href: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg">Salon Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition rounded-lg mx-2 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-600 rounded-lg transition text-sm font-medium"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Dashboard Administrator</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};
