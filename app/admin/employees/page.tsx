'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Button, Badge } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Karyawan</h1>
            <p className="text-gray-600 mt-1">Total: {employees.length} karyawan</p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Table */}
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Pekerjaan</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Aktif</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Komisi</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => {
                const stats = getEmployeeStats(employee.id);
                return (
                  <tr key={employee.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">{employee.name}</td>
                    <td className="px-4 py-3 text-gray-600">{employee.role}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-800">{employee.rating} ⭐</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <p className="text-gray-800">Total: {stats.total}</p>
                        <p className="text-green-600">Selesai: {stats.completed}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={employee.isActive ? 'success' : 'warning'}>
                        {employee.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">{formatCurrency(stats.commission)}</td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:underline font-semibold text-sm">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada karyawan ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
