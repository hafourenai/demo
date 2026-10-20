'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function PromosPage() {
  const { promos } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPromos = promos.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Manajemen Voucher &amp; Promo
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola voucher diskon khusus Home Cleaning dan belanja Nail Art.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari voucher berdasarkan nama atau kode promo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Promos Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Nama Promo</th>
                  <th className="px-4 py-3">Kode Kupon</th>
                  <th className="px-4 py-3">Berlaku Untuk</th>
                  <th className="px-4 py-3">Tipe &amp; Nilai</th>
                  <th className="px-4 py-3">Min. Transaksi</th>
                  <th className="px-4 py-3">Masa Berlaku</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPromos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{promo.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono bg-pink-50 text-pink-700 px-2 py-0.5 rounded font-bold">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {promo.applicableTo.map((app) => (
                          <span
                            key={app}
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              app === 'cleaning'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app === 'cleaning' ? '🧹 Cleaning' : '💅 Nail Art'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                      {promo.type === 'percentage'
                        ? `${promo.value}% Diskon`
                        : `Potongan ${formatCurrency(promo.value)}`}
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-600">
                      {promo.minTransaction ? formatCurrency(promo.minTransaction) : 'Tanpa Min.'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      s/d {formatDate(promo.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          promo.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {promo.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
