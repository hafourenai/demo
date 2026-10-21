'use client';

import { useState, useMemo } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import {
  Package,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminInventoryPage() {
  const { nailArtProducts, updateProductStock } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [adjustingModal, setAdjustingModal] = useState<{
    productId: string;
    productName: string;
    variantId?: string;
    variantName?: string;
    currentStock: number;
  } | null>(null);

  const [deltaQty, setDeltaQty] = useState<number>(10);

  // Flatten products and variants for granular inventory tracking
  const inventoryItems = useMemo(() => {
    const list: Array<{
      productId: string;
      productName: string;
      category: string;
      sku: string;
      variantId?: string;
      variantName?: string;
      stock: number;
      price: number;
      image: string;
    }> = [];

    nailArtProducts.forEach((prod) => {
      if (prod.variants && prod.variants.length > 0) {
        prod.variants.forEach((v) => {
          list.push({
            productId: prod.id,
            productName: prod.name,
            category: prod.category,
            sku: v.sku || prod.sku,
            variantId: v.id,
            variantName: `${v.size ? `Size ${v.size}` : ''} ${v.color || ''} ${v.design || ''}`.trim(),
            stock: v.stock,
            price: v.price,
            image: prod.image,
          });
        });
      } else {
        list.push({
          productId: prod.id,
          productName: prod.name,
          category: prod.category,
          sku: prod.sku,
          stock: prod.stock,
          price: prod.price,
          image: prod.image,
        });
      }
    });

    return list;
  }, [nailArtProducts]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchSearch =
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.variantName || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchLowStock = !filterLowStock || item.stock <= 15;
      return matchSearch && matchLowStock;
    });
  }, [inventoryItems, searchQuery, filterLowStock]);

  const totalStockCount = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventoryItems.filter((i) => i.stock <= 15).length;
  const totalValuation = inventoryItems.reduce((sum, item) => sum + item.price * item.stock, 0);

  const handleApplyStockAdjustment = (delta: number) => {
    if (!adjustingModal) return;
    updateProductStock(adjustingModal.productId, adjustingModal.variantId, delta);
    setAdjustingModal(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Inventory &amp; Kontrol Stok Nail Art
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola stok multi-varian per SKU, restock otomatis, dan cegah stok negatif saat checkout.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Package size={14} /> Kelola Katalog Produk
          </Link>
        </div>

        {/* 3 Overview KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Total Unit Tersedia
            </span>
            <p className="text-2xl font-bold text-slate-900 font-sans">
              {totalStockCount} <span className="text-xs font-normal text-slate-500">Pcs</span>
            </p>
            <span className="text-[10px] text-slate-400">Di seluruh varian &amp; produk</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Peringatan Stok Menipis
            </span>
            <p className="text-2xl font-bold text-amber-600 font-sans">{lowStockCount}</p>
            <span className="text-[10px] text-amber-700 font-medium">Stok &le; 15 unit segera restock</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Estimasi Valuasi Inventaris
            </span>
            <p className="text-xl font-bold text-slate-900 font-sans">
              {formatCurrency(totalValuation)}
            </p>
            <span className="text-[10px] text-slate-400">Nilai aset produk aktif</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Cari SKU produk, nama, atau varian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filterLowStock
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle size={14} /> Filter Stok Menipis (&le; 15)
          </button>
        </div>

        {/* Inventory Items Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Produk &amp; Gambar</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Varian &amp; SKU</th>
                  <th className="px-4 py-3">Harga Satuan</th>
                  <th className="px-4 py-3">Sisa Stok</th>
                  <th className="px-4 py-3 text-center">Aksi Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => {
                  const isLow = item.stock <= 15;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                          />
                          <span className="font-bold text-slate-900 max-w-xs truncate">
                            {item.productName}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-500">{item.category}</td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 block">
                          {item.variantName || 'Standar (Tanpa Varian)'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 font-semibold">
                          {item.sku}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900 font-sans">
                        {formatCurrency(item.price)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold font-sans text-sm ${
                              isLow ? 'text-amber-600' : 'text-slate-900'
                            }`}
                          >
                            {item.stock}
                          </span>
                          {isLow && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              LOW
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              updateProductStock(item.productId, item.variantId, 10);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px]"
                            title="Tambah 10 Pcs"
                          >
                            +10
                          </button>
                          <button
                            onClick={() =>
                              setAdjustingModal({
                                productId: item.productId,
                                productName: item.productName,
                                variantId: item.variantId,
                                variantName: item.variantName,
                                currentStock: item.stock,
                              })
                            }
                            className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white font-bold rounded text-[11px]"
                          >
                            Atur Stok
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADJUSTMENT MODAL */}
        {adjustingModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Penyesuaian Stok Produk</h3>
                <p className="text-slate-500 mt-0.5 truncate">{adjustingModal.productName}</p>
                {adjustingModal.variantName && (
                  <span className="text-[10px] text-pink-600 font-semibold">
                    Varian: {adjustingModal.variantName}
                  </span>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Stok Saat Ini:</span>
                <strong className="text-sm font-bold text-slate-900 font-sans">
                  {adjustingModal.currentStock} Pcs
                </strong>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Perubahan Stok (+ Tambah / - Kurang):
                </label>
                <input
                  type="number"
                  value={deltaQty}
                  onChange={(e) => setDeltaQty(Number(e.target.value))}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-bold font-sans text-center text-sm focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1 text-center">
                  Stok baru akan menjadi:{' '}
                  <strong className="text-slate-900 font-sans">
                    {Math.max(0, adjustingModal.currentStock + deltaQty)} Pcs
                  </strong>
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingModal(null)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyStockAdjustment(deltaQty)}
                  className="flex-1 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black"
                >
                  Terapkan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
