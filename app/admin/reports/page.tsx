'use client';

import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const { orders, services, products, employees } = useAppStore();

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);

  // Daily revenue
  const dailyRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Popular services
  const serviceStats = services
    .map((service) => ({
      ...service,
      count: orders.filter((o) =>
        o.items.some((item) => item.itemId === service.id && item.type === 'service')
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Best seller products
  const productStats = products
    .map((product) => ({
      ...product,
      count: orders.filter((o) =>
        o.items.some((item) => item.itemId === product.id && item.type === 'product')
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top employees
  const employeeStats = employees
    .map((employee) => {
      const completedOrders = orders.filter((o) => o.employeeId === employee.id && o.status === 'completed');
      return {
        ...employee,
        ordersCount: completedOrders.length,
        earnings: completedOrders.reduce((sum, o) => sum + o.totalPrice * 0.2, 0),
      };
    })
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-serif font-semibold text-text-primary">Laporan</h1>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary font-semibold">Order Hari Ini</p>
            <p className="text-3xl font-bold text-primary mt-2">{todayOrders.length}</p>
          </Card>
          <Card className="bg-success/5 border border-success/20">
            <p className="text-sm text-success font-semibold">Pendapatan Hari Ini</p>
            <p className="text-2xl font-bold text-success mt-2">{formatCurrency(dailyRevenue)}</p>
          </Card>
          <Card className="bg-accent/5 border border-accent/20">
            <p className="text-sm text-accent font-semibold">Total Order (All Time)</p>
            <p className="text-3xl font-bold text-accent mt-2">{orders.length}</p>
          </Card>
          <Card className="bg-bg-alt border border-border">
            <p className="text-sm text-text-primary font-semibold">Total Revenue (All Time)</p>
            <p className="text-2xl font-bold text-text-primary mt-2">
              {formatCurrency(orders.reduce((sum, o) => sum + o.totalPrice, 0))}
            </p>
          </Card>
        </div>

        {/* Popular Services */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">Layanan Populer</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Layanan</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Dipesan</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {serviceStats.map((service) => (
                  <tr key={service.id} className="hover:bg-bg-alt transition-colors duration-base">
                    <td className="px-4 py-3 font-semibold text-text-primary">{service.name}</td>
                    <td className="px-4 py-3 font-bold text-primary">{service.count} order</td>
                    <td className="px-4 py-3 text-text-primary">{service.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Best Seller Products */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">Produk Best Seller</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Produk</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Terjual</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Harga</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productStats.map((product) => (
                  <tr key={product.id} className="hover:bg-bg-alt transition-colors duration-base">
                    <td className="px-4 py-3 font-semibold text-text-primary">{product.name}</td>
                    <td className="px-4 py-3 font-bold text-primary">{product.count}</td>
                    <td className="px-4 py-3 text-text-primary">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-text-primary">{product.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Top Employees */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-text-primary mb-4">Karyawan Terbaik</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Pekerjaan Selesai</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Komisi</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employeeStats.map((employee) => (
                  <tr key={employee.id} className="hover:bg-bg-alt transition-colors duration-base">
                    <td className="px-4 py-3 font-semibold text-text-primary">{employee.name}</td>
                    <td className="px-4 py-3 font-bold text-primary">{employee.ordersCount}</td>
                    <td className="px-4 py-3 text-text-primary">{formatCurrency(employee.earnings)}</td>
                    <td className="px-4 py-3 text-text-primary">{employee.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
