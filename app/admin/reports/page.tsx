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
        <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-blue-900 font-semibold">Order Hari Ini</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{todayOrders.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-green-900 font-semibold">Pendapatan Hari Ini</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(dailyRevenue)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-purple-900 font-semibold">Total Order (All Time)</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{orders.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
            <p className="text-sm text-pink-900 font-semibold">Total Revenue (All Time)</p>
            <p className="text-2xl font-bold text-pink-600 mt-2">
              {formatCurrency(orders.reduce((sum, o) => sum + o.totalPrice, 0))}
            </p>
          </Card>
        </div>

        {/* Popular Services */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Layanan Populer</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Layanan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dipesan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {serviceStats.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{service.name}</td>
                    <td className="px-4 py-3 font-bold text-primary">{service.count} order</td>
                    <td className="px-4 py-3 text-gray-800">{service.rating} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Best Seller Products */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Produk Best Seller</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Produk</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Terjual</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Harga</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productStats.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
                    <td className="px-4 py-3 font-bold text-primary">{product.count}</td>
                    <td className="px-4 py-3 text-gray-800">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-gray-800">{product.rating} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Top Employees */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Karyawan Terbaik</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Pekerjaan Selesai</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Komisi</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employeeStats.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{employee.name}</td>
                    <td className="px-4 py-3 font-bold text-primary">{employee.ordersCount}</td>
                    <td className="px-4 py-3 text-gray-800">{formatCurrency(employee.earnings)}</td>
                    <td className="px-4 py-3 text-gray-800">{employee.rating} ⭐</td>
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
