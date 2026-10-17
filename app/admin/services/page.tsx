'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Button, Badge } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

export default function ServicesPage() {
  const { services } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-text-primary">Manajemen Layanan</h1>
            <p className="text-text-secondary mt-1">Total: {services.length} layanan</p>
          </div>
          <Button>+ Tambah Layanan</Button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Categories */}
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">Kategori</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge key={cat} variant="primary">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas-alt border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Nama</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Kategori</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Harga</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Durasi</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Rating</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Status</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-canvas-alt transition-colors duration-base">
                  <td className="px-4 py-3 font-semibold text-text-primary">{service.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{service.category}</td>
                  <td className="px-4 py-3 font-bold text-primary">{formatCurrency(service.price)}</td>
                  <td className="px-4 py-3 text-text-secondary">{service.duration} menit</td>
                  <td className="px-4 py-3 text-text-primary">{service.rating}</td>
                  <td className="px-4 py-3">
                    <Badge variant="success">{service.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-dark transition-colors duration-base font-semibold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada layanan ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
