'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatDate } from '@/lib/utils';
import { Eye, X } from 'lucide-react';
import { Customer } from '@/lib/types';

export default function CustomersPage() {
  const { customers, cleaningOrders, productOrders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Manajemen Customer</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pelanggan terdaftar, riwayat alamat, dan total pemesanan.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama, email, atau no. HP customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">No. HP &amp; Email</th>
                  <th className="px-4 py-3">Alamat Tersimpan</th>
                  <th className="px-4 py-3">Total Cleaning</th>
                  <th className="px-4 py-3">Total Nail Art</th>
                  <th className="px-4 py-3">Terdaftar Sejak</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const cleanCount = cleaningOrders.filter((o) => o.customerId === cust.id).length;
                  const prodCount = productOrders.filter((o) => o.customerId === cust.id).length;

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={cust.photo || '/images/services/svc1.jpg'}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <span>{cust.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 block">{cust.phone}</span>
                        <span className="text-[10px] text-slate-400">{cust.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800">
                          {cust.addresses?.length || 0} Alamat
                        </span>
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">
                          {cust.addresses?.[0]?.detail || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-bold text-pink-600 font-sans">{cleanCount}</td>
                      <td className="px-4 py-3 font-bold text-amber-700 font-sans">{prodCount}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(cust.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DETAIL CUSTOMER */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Detail Profil Customer</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.photo || '/images/services/svc1.jpg'}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedCustomer.name}</h4>
                  <p className="text-slate-500">{selectedCustomer.email}</p>
                  <p className="text-slate-400 text-[11px]">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">
                  Daftar Alamat ({selectedCustomer.addresses?.length || 0}/3):
                </h4>
                <div className="space-y-1.5">
                  {selectedCustomer.addresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase text-slate-800">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-1">{addr.detail}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">
                        GPS: {addr.latitude}, {addr.longitude}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
