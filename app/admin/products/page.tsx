'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, Button, Badge } from '@/components/common';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const { products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-text-primary">Manajemen Produk</h1>
            <p className="text-text-secondary mt-1">Total: {products.length} produk</p>
          </div>
          <Button>+ Tambah Produk</Button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari produk..."
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
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Nama</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Kategori</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Harga</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Stok</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Rating</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Best Seller</th>
                <th className="px-4 py-3 text-left font-serif font-semibold text-text-primary">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-bg-alt transition-colors duration-base">
                  <td className="px-4 py-3 font-semibold text-text-primary">{product.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{product.category}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-bold text-primary">{formatCurrency(product.price)}</div>
                      {product.promoPrice && (
                        <div className="text-xs text-danger">{formatCurrency(product.promoPrice)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-primary">
                    <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                      {product.stock} stok
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-text-primary">{product.rating}</td>
                  <td className="px-4 py-3">
                    {product.isBestSeller && <Badge variant="success">Best Seller</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-dark transition-colors duration-base font-semibold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
