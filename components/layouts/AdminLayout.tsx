'use client';

import React, { Suspense } from 'react';
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
  ChevronRight,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar';

function AdminNavigationLink({ item }: { item: { icon: React.ReactNode; label: string; href: string } }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const { setOpenMobile } = useSidebar();
  const [path, query] = item.href.split('?');
  const active = pathname === path && (!query || (params.get('type') || 'cleaning') === new URLSearchParams(query).get('type'));
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-10 gap-3 text-[13px] data-[active=true]:bg-rose-50 data-[active=true]:text-rose-900">
        <Link href={item.href} onClick={() => setOpenMobile(false)} aria-current={active ? 'page' : undefined}>
          {item.icon}<span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAppStore();

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
    <SidebarProvider className="admin-shell bg-slate-50 text-slate-900" style={{ '--sidebar-width': '17rem' } as React.CSSProperties}>
      <Sidebar collapsible="icon" className="admin-sidebar border-r border-slate-200">
        <SidebarHeader className="h-20 justify-center border-b border-slate-200">
          <SidebarMenu><SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="gap-3 hover:bg-transparent">
              <Link href="/admin">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-900 text-xs font-bold text-white">CN</span>
                <span className="flex flex-col"><span className="text-base font-semibold">Clean &amp; Nail</span><span className="text-xs text-slate-500">Administration</span></span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem></SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="gap-1 py-3">
          <Suspense fallback={null}>
            {menuSections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="text-[10px] tracking-widest text-slate-400">{section.title}</SidebarGroupLabel>
                <SidebarGroupContent><SidebarMenu>
                  {section.items.map((item) => <AdminNavigationLink key={item.href} item={item} />)}
                </SidebarMenu></SidebarGroupContent>
              </SidebarGroup>
            ))}
          </Suspense>
        </SidebarContent>
        <SidebarFooter className="border-t border-slate-200">
          <SidebarMenu><SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Keluar / Switch Role" className="h-10 gap-3 text-rose-800">
              <LogOut size={18} /><span>Keluar / Switch Role</span>
            </SidebarMenuButton>
          </SidebarMenuItem></SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-slate-50">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-8">
          <SidebarTrigger className="size-9 rounded-lg" aria-label="Buka atau tutup sidebar" />
          <span className="h-5 border-l border-slate-200" />
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span>Workspace</span><ChevronRight size={12} /><span className="truncate font-medium text-slate-900">{menuSections.flatMap(s => s.items).find(i => i.href === pathname)?.label || 'Admin'}</span>
          </div>
          <span className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold" aria-label="Administrator">AD</span>
        </header>
        <div className="w-full min-w-0 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
