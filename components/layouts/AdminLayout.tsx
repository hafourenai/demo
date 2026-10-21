'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Users,
  Briefcase,
  DollarSign,
  Calculator,
  Package,
  Layers,
  Ticket,
  FileText,
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

  const menuSections = [
    {
      title: 'OPERASIONAL',
      items: [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard & Live Map', href: '/admin' },
        { icon: <Sparkles size={18} />, label: 'Cleaning Orders', href: '/admin/orders?type=cleaning' },
        { icon: <ShoppingBag size={18} />, label: 'Product Orders', href: '/admin/orders?type=product' },
      ],
    },
    {
      title: 'KEMITRAAN & USER',
      items: [
        { icon: <Briefcase size={18} />, label: 'Employees', href: '/admin/employees' },
        { icon: <DollarSign size={18} />, label: 'Settlement Karyawan', href: '/admin/settlements' },
        { icon: <Users size={18} />, label: 'Customers', href: '/admin/customers' },
      ],
    },
    {
      title: 'KATALOG & PRICING',
      items: [
        { icon: <Sparkles size={18} />, label: 'Cleaning Services', href: '/admin/services' },
        { icon: <Calculator size={18} />, label: 'Pricing Rules (m² & Jarak)', href: '/admin/pricing-rules' },
        { icon: <Package size={18} />, label: 'Nail Art Products', href: '/admin/products' },
        { icon: <Layers size={18} />, label: 'Inventory & Stok', href: '/admin/inventory' },
        { icon: <Ticket size={18} />, label: 'Promotions', href: '/admin/promos' },
      ],
    },
    {
      title: 'FINANCE & LAPORAN',
      items: [
        { icon: <FileText size={18} />, label: 'Invoices & Payments', href: '/admin/invoices' },
        { icon: <BarChart3 size={18} />, label: 'Laporan Analitik', href: '/admin/reports' },
        { icon: <Settings size={18} />, label: 'Settings', href: '/admin/settings' },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#1e293b] text-white shadow-xl transition-all duration-300 flex flex-col flex-shrink-0 z-20`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen ? (
            <div>
              <h1 className="font-bold text-base tracking-wide flex items-center gap-1.5 text-white">
                Clean<span className="text-pink-400">&amp;</span>Nail <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded">Admin V2</span>
              </h1>
              <p className="text-[11px] text-slate-400">Management Dashboard</p>
            </div>
          ) : (
            <span className="font-bold text-pink-400 text-lg">CN</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-300"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider mb-1.5">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href.split('?')[0];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-pink-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-rose-300 hover:bg-rose-500/20 rounded-lg text-xs font-medium transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Keluar / Switch Role</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-6 w-full">{children}</div>
      </main>
    </div>
  );
};
