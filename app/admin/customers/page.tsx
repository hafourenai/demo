'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card } from '@/components/common';
import { formatDate } from '@/lib/utils';

export default function CustomersPage() {
  const { customers } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Customer</h1>
          <p className="text-gray-600 mt-1">Total: {customers.length} customer</p>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari customer..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">No. HP</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Terdaftar</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-800">{customer.name}</td>
                  <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline font-semibold text-sm">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada customer ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
