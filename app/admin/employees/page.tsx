'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Button, Badge } from '@/components/common';
import { formatCurrency } from '@/lib/utils';
import { Star } from 'lucide-react';

export default function EmployeesPage() {
  const { employees, orders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery)
  );

  const getEmployeeStats = (employeeId: string) => {
    const employeeOrders = orders.filter((o) => o.employeeId === employeeId);
    const completedOrders = employeeOrders.filter((o) => o.status === 'completed');
    const activeOrders = employeeOrders.filter(
      (o) =>
        o.status === 'accepted' ||
        o.status === 'going_to_location' ||
        o.status === 'arrived' ||
        o.status === 'in_progress'
    );

    const commission = completedOrders.reduce((sum, order) => sum + order.totalPrice * 0.2, 0);

    return {
      total: employeeOrders.length,
      completed: completedOrders.length,
      active: activeOrders.length,
      commission,
    };
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-text-primary">Manajemen Karyawan</h1>
            <p className="text-text-secondary mt-1">Total: {employees.length} karyawan</p>
          </div>
          <Button>+ Tambah Karyawan</Button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Table */}
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas-alt border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Rating</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Pekerjaan</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Aktif</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Komisi</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((employee) => {
                const stats = getEmployeeStats(employee.id);
                return (
                  <tr key={employee.id} className="hover:bg-canvas-alt transition-colors duration-base">
                    <td className="px-4 py-3 font-semibold text-text-primary">{employee.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{employee.role}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-text-primary inline-flex items-center gap-1">
                        {employee.rating}
                        <Star size={14} className="text-warning fill-warning" />
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <p className="text-text-primary">Total: {stats.total}</p>
                        <p className="text-success">Selesai: {stats.completed}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={employee.isActive ? 'success' : 'warning'}>
                        {employee.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-success">{formatCurrency(stats.commission)}</td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-dark transition-colors duration-base font-semibold text-sm">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada karyawan ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
