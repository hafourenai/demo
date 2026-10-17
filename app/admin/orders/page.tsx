'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Badge } from '@/components/common';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';

export default function OrdersPage() {
  const { orders, customers, employees } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  let filteredOrders = orders;

  if (filterStatus) {
    filteredOrders = filteredOrders.filter((o) => o.status === filterStatus);
  }

  if (searchQuery) {
    filteredOrders = filteredOrders.filter(
      (o) =>
        customers.find((c) => c.id === o.customerId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusOptions = [
    'waiting_employee',
    'accepted',
    'going_to_location',
    'arrived',
    'in_progress',
    'completed',
    'cancelled_customer',
    'cancelled_admin',
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-text-primary">Manajemen Order</h1>
          <p className="text-text-secondary mt-1">Total: {orders.length} order</p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-text-primary">Cari Order</label>
            <input
              type="text"
              placeholder="ID order atau nama customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mt-2 px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-text-primary">Status</label>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-4 py-2 rounded-sm font-semibold text-sm transition-colors duration-base ${
                  filterStatus === null
                    ? 'bg-primary text-white'
                    : 'bg-bg-alt text-text-primary hover:bg-primary/10'
                }`}
              >
                Semua
              </button>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-sm font-semibold text-sm transition-colors duration-base ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-bg-alt text-text-primary hover:bg-primary/10'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
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
              {filteredOrders.map((order) => {
                const customer = customers.find((c) => c.id === order.customerId);
                const employee = employees.find((e) => e.id === order.employeeId);

                return (
                  <tr key={order.id} className="hover:bg-bg-alt transition-colors duration-base">
                    <td className="px-4 py-3 font-mono text-xs text-primary font-bold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-text-primary">{customer?.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{employee?.name || '-'}</td>
                    <td className="px-4 py-3 font-bold text-primary">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'success'
                            : order.status.includes('cancelled')
                            ? 'danger'
                            : 'primary'
                        }
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada order ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
