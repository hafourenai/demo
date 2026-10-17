'use client';

import { useMemo } from 'react';
import { Users, Briefcase, TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const { customers, employees, orders, services, products } = useAppStore();

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);

  const kpis = useMemo(() => {
    const totalCustomers = customers.length;
    const totalEmployees = employees.length;
    const availableEmployees = employees.filter(
      (e) => !orders.some((o) => o.employeeId === e.id && o.status !== 'completed')
    ).length;
    const busyEmployees = totalEmployees - availableEmployees;

    const todayOrdersCount = todayOrders.length;
    const ongoingOrders = orders.filter(
      (o) =>
        !['completed', 'cancelled_customer', 'cancelled_admin'].includes(o.status)
    ).length;

    const productSales = todayOrders.filter((o) => o.items.some((i) => i.type === 'product')).length;
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      totalCustomers,
      totalEmployees,
      availableEmployees,
      busyEmployees,
      todayOrdersCount,
      ongoingOrders,
      productSales,
      todayRevenue,
    };
  }, [customers, employees, orders, todayOrders]);

  const statCards = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Customer',
      value: kpis.totalCustomers,
      bgClass: 'bg-primary/10',
      iconClass: 'text-primary',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: 'Total Karyawan',
      value: kpis.totalEmployees,
      bgClass: 'bg-accent/10',
      iconClass: 'text-accent',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Karyawan Available',
      value: kpis.availableEmployees,
      bgClass: 'bg-success/10',
      iconClass: 'text-success',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Karyawan Busy',
      value: kpis.busyEmployees,
      bgClass: 'bg-warning/10',
      iconClass: 'text-warning',
    },
  ];

  const orderStats = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Order Hari Ini',
      value: kpis.todayOrdersCount,
      bgClass: 'bg-primary/10',
      iconClass: 'text-primary',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: 'Order Berlangsung',
      value: kpis.ongoingOrders,
      bgClass: 'bg-warning/10',
      iconClass: 'text-warning',
    },
    {
      icon: <Package className="w-6 h-6" />,
      label: 'Penjualan Produk',
      value: kpis.productSales,
      bgClass: 'bg-accent/10',
      iconClass: 'text-accent',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Pendapatan Hari Ini',
      value: formatCurrency(kpis.todayRevenue),
      bgClass: 'bg-success/10',
      iconClass: 'text-success',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">Status Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, idx) => (
              <Card key={idx}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-secondary font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2 text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgClass} rounded-md ${stat.iconClass}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Stats */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">Aktivitas Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStats.map((stat, idx) => (
              <Card key={idx}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-secondary font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2 text-text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgClass} rounded-md ${stat.iconClass}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">Order Terbaru</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">ID Order</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Karyawan</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {todayOrders.slice(0, 10).map((order) => {
                  const customer = customers.find((c) => c.id === order.customerId);
                  const employee = employees.find((e) => e.id === order.employeeId);

                  return (
                    <tr key={order.id} className="hover:bg-canvas-alt transition-colors duration-base">
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-text-primary">{customer?.name}</td>
                      <td className="px-4 py-3 text-text-primary">{employee?.name || '-'}</td>
                      <td className="px-4 py-3 font-bold text-primary">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border border-primary/20">
            <h3 className="font-serif font-semibold text-text-primary mb-2">Total Layanan</h3>
            <p className="text-3xl font-bold text-primary">{services.length}</p>
          </Card>
          <Card className="bg-success/5 border border-success/20">
            <h3 className="font-serif font-semibold text-text-primary mb-2">Total Produk</h3>
            <p className="text-3xl font-bold text-success">{products.length}</p>
          </Card>
          <Card className="bg-accent/5 border border-accent/20">
            <h3 className="font-serif font-semibold text-text-primary mb-2">Total Order (Semua)</h3>
            <p className="text-3xl font-bold text-accent">{orders.length}</p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
