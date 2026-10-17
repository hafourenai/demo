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
          <h1 className="text-2xl font-serif font-semibold text-text-primary">Manajemen Customer</h1>
          <p className="text-text-secondary mt-1">Total: {customers.length} customer</p>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari customer..."
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
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">No. HP</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Terdaftar</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-canvas-alt transition-colors duration-base">
                  <td className="px-4 py-3 font-semibold text-text-primary">{customer.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{customer.email}</td>
                  <td className="px-4 py-3 text-text-secondary">{customer.phone}</td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-dark transition-colors duration-base font-semibold text-sm">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada customer ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
