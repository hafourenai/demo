'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Edit,
  Star,
  Search,
  X,
} from 'lucide-react';
import { NailArtProduct } from '@/lib/types';

export default function AdminProductsPage() {
  const { nailArtProducts, saveProduct } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<NailArtProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredProducts = nailArtProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingProduct({
      id: `nail-prod-${Date.now()}`,
      name: '',
      description: '',
      sku: `NAIL-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Press-On Nails',
      price: 75000,
      image: '/images/products/prod1.jpg',
      rating: 5.0,
      isBestSeller: false,
      stock: 30,
      variants: [
        { id: `var-s-${Date.now()}`, size: 'S', sku: 'S-01', price: 75000, stock: 10 },
        { id: `var-m-${Date.now()}`, size: 'M', sku: 'M-01', price: 75000, stock: 10 },
        { id: `var-l-${Date.now()}`, size: 'L', sku: 'L-01', price: 75000, stock: 10 },
      ],
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    saveProduct(editingProduct);
    setEditingProduct(null);
    setIsCreating(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Katalog Produk Nail Art &amp; Varian
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola produk press-on nails, cat kuku, stiker 3D dengan SKU, ukuran, dan stok varian.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Tambah Produk Baru
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama produk, SKU, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Harga Normal / Promo</th>
                  <th className="px-4 py-3">Varian Tersedia</th>
                  <th className="px-4 py-3">Total Stok</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                              <Star size={11} className="fill-amber-500" /> {prod.rating}
                            </span>
                            {prod.isBestSeller && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                Best Seller
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-600">{prod.category}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">{prod.sku}</td>

                    <td className="px-4 py-3 font-sans">
                      {prod.promoPrice ? (
                        <>
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatCurrency(prod.price)}
                          </span>
                          <span className="font-bold text-pink-600">
                            {formatCurrency(prod.promoPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-slate-900">
                          {formatCurrency(prod.price)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {prod.variants && prod.variants.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {prod.variants.map((v) => (
                            <span
                              key={v.id}
                              className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono"
                            >
                              {v.size || v.color || v.design} ({v.stock})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Tanpa Varian</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`font-bold font-sans ${
                          prod.stock <= 15 ? 'text-amber-600' : 'text-slate-900'
                        }`}
                      >
                        {prod.stock} Pcs
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setEditingProduct({ ...prod });
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Edit Produk"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL EDIT / CREATE PRODUCT */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  {isCreating ? 'Tambah Produk Nail Art' : 'Edit Produk Nail Art'}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Produk:</label>
                  <input
                    required
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori:</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                    >
                      <option value="Press-On Nails">Press-On Nails</option>
                      <option value="Fake Nails">Fake Nails</option>
                      <option value="Nail Sticker">Nail Sticker</option>
                      <option value="Gel Nail">Gel Nail</option>
                      <option value="Nail Care">Nail Care</option>
                      <option value="Starter Kit">Starter Kit</option>
                      <option value="Nail Accessories">Nail Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">SKU Induk:</label>
                    <input
                      required
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, sku: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Harga Normal (Rp):
                    </label>
                    <input
                      required
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Harga Promo (Opsional):
                    </label>
                    <input
                      type="number"
                      value={editingProduct.promoPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          promoPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Kosongkan jika tidak ada"
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Deskripsi Lengkap:
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    checked={editingProduct.isBestSeller}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })
                    }
                    className="rounded text-pink-600"
                  />
                  <label htmlFor="isBestSeller" className="font-semibold text-slate-700">
                    Tandai sebagai Produk Best Seller
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black"
                  >
                    Simpan Produk
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
