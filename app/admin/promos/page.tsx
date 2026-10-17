'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Button, Badge } from '@/components/common';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PromosPage() {
  const { promos } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPromos = promos.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-text-primary">Manajemen Promo</h1>
            <p className="text-text-secondary mt-1">Total: {promos.length} promo</p>
          </div>
          <Button>+ Tambah Promo</Button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari promo..."
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
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Kode</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Jenis</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Nilai</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Berlaku Hingga</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-text-primary">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPromos.map((promo) => (
                <tr key={promo.id} className="hover:bg-canvas-alt transition-colors duration-base">
                  <td className="px-4 py-3 font-semibold text-text-primary">{promo.name}</td>
                  <td className="px-4 py-3 font-mono text-primary font-bold">{promo.code}</td>
                  <td className="px-4 py-3 text-text-secondary capitalize">
                    {promo.type === 'percentage'
                      ? 'Persentase'
                      : promo.type === 'nominal'
                      ? 'Nominal'
                      : 'Voucher'}
                  </td>
                  <td className="px-4 py-3 font-bold text-text-primary">
                    {promo.type === 'percentage' ? `${promo.value}%` : formatCurrency(promo.value)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(promo.endDate)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={promo.isActive ? 'success' : 'warning'}>
                      {promo.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-dark transition-colors duration-base font-semibold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {filteredPromos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada promo ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
