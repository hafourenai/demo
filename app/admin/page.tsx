'use client';

import { useMemo } from 'react';
import { Users, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
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
      color: 'blue',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: 'Total Karyawan',
      value: kpis.totalEmployees,
      color: 'purple',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Karyawan Available',
      value: kpis.availableEmployees,
      color: 'green',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Karyawan Busy',
      value: kpis.busyEmployees,
      color: 'orange',
    },
  ];

  const orderStats = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Order Hari Ini',
      value: kpis.todayOrdersCount,
      color: 'indigo',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: 'Order Berlangsung',
      value: kpis.ongoingOrders,
      color: 'red',
    },
    {
      icon: <Package className="w-6 h-6" />,
      label: 'Penjualan Produk',
      value: kpis.productSales,
      color: 'teal',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Pendapatan Hari Ini',
      value: formatCurrency(kpis.todayRevenue),
      color: 'emerald',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Status Sistem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, idx) => (
              <Card key={idx} className="bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Stats */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStats.map((stat, idx) => (
              <Card key={idx} className="bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Terbaru</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">ID Order</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Karyawan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todayOrders.slice(0, 10).map((order) => {
                  const customer = customers.find((c) => c.id === order.customerId);
                  const employee = employees.find((e) => e.id === order.employeeId);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{customer?.name}</td>
                      <td className="px-4 py-3 text-gray-800">{employee?.name || '-'}</td>
                      <td className="px-4 py-3 font-bold text-primary">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Total Layanan</h3>
            <p className="text-3xl font-bold text-blue-600">{services.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Total Produk</h3>
            <p className="text-3xl font-bold text-green-600">{products.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Total Order (Semua)</h3>
            <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

import { ShoppingBag, Package } from 'lucide-react';
