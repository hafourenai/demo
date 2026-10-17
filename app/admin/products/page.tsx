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
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
            <p className="text-gray-600 mt-1">Total: {products.length} produk</p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Categories */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Kategori</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="badge badge-primary">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Harga</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Stok</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Best Seller</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-bold text-primary">{formatCurrency(product.price)}</div>
                      {product.promoPrice && (
                        <div className="text-xs text-red-600">{formatCurrency(product.promoPrice)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                      {product.stock} stok
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{product.rating} ⭐</td>
                  <td className="px-4 py-3">
                    {product.isBestSeller && <Badge variant="success">Best Seller</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline font-semibold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
