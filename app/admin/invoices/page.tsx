'use client';

import { useState, useMemo } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Search, Eye, X } from 'lucide-react';
import { CleaningOrder, ProductOrder } from '@/lib/types';

export default function AdminInvoicesPage() {
  const { cleaningOrders, productOrders } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cleaning' | 'product'>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<CleaningOrder | ProductOrder | null>(null);

  // Combine invoices
  const allInvoices = useMemo(() => {
    const list: Array<CleaningOrder | ProductOrder> = [...cleaningOrders, ...productOrders];
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [cleaningOrders, productOrders]);

  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = filterType === 'all' || inv.orderType === filterType;
      const matchPayment = filterPayment === 'all' || inv.paymentStatus === filterPayment;

      return matchSearch && matchType && matchPayment;
    });
  }, [allInvoices, searchQuery, filterType, filterPayment]);

  const totalBilled = filteredInvoices.reduce((sum, inv) => {
    if (inv.orderType === 'cleaning') {
      return sum + inv.priceBreakdown.total;
    }
    return sum + inv.total;
  }, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Invoices &amp; Rekap Keuangan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Format faktur resmi: INV-CLN-YYYYMMDD-XXXX (Cleaning) &amp; INV-PRD-YYYYMMDD-XXXX (Nail Art).
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs text-right">
            <span className="text-slate-400 block font-semibold">Total Nilai Tagihan:</span>
            <span className="text-base font-bold text-slate-900 font-sans">
              {formatCurrency(totalBilled)}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nomor invoice resmi atau nama customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 px-4 py-2 pl-9 rounded-xl border border-slate-200 text-xs focus:outline-none"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="all">Semua Jenis Invoice</option>
              <option value="cleaning">🧹 INV-CLN (Cleaning)</option>
              <option value="product">💅 INV-PRD (Nail Art)</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            >
              <option value="all">Semua Status Bayar</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="unpaid">Belum Bayar (Unpaid)</option>
              <option value="waiting_confirmation">Menunggu Konfirmasi</option>
            </select>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">No. Invoice Resmi</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Tanggal Diterbitkan</th>
                  <th className="px-4 py-3">Metode Bayar</th>
                  <th className="px-4 py-3">Total Tagihan</th>
                  <th className="px-4 py-3">Status Bayar</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const isClean = inv.orderType === 'cleaning';
                  const total = isClean
                    ? (inv as CleaningOrder).priceBreakdown.total
                    : (inv as ProductOrder).total;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isClean ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isClean ? 'CLEANING' : 'PRODUCT'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {inv.customerName}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(inv.createdAt)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700 uppercase">
                        {inv.paymentMethod}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                        {formatCurrency(total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inv.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 mx-auto"
                        >
                          <Eye size={13} /> Cetak
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRINTABLE INVOICE MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-base font-serif text-slate-900">
                    Official Invoicing Receipt
                  </h3>
                  <span className="font-mono text-slate-500">{selectedInvoice.invoiceNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Customer:</span>
                    <strong className="text-slate-800">{selectedInvoice.customerName}</strong>
                    <p className="text-slate-500 text-[10px]">{selectedInvoice.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Tanggal Tagihan:</span>
                    <strong className="text-slate-800">{formatDate(selectedInvoice.createdAt)}</strong>
                    <p className="text-slate-500 text-[10px]">
                      Metode: {selectedInvoice.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Items breakdown */}
                {selectedInvoice.orderType === 'cleaning' ? (
                  <div className="border border-slate-200 rounded-xl p-3 space-y-1.5 bg-slate-50">
                    <p className="font-bold text-slate-800 mb-1">
                      {(selectedInvoice as CleaningOrder).serviceName} (
                      {(selectedInvoice as CleaningOrder).propertyDetails.buildingSize} m²)
                    </p>
                    <div className="flex justify-between">
                      <span>Base Price Cleaning:</span>
                      <span>
                        {formatCurrency((selectedInvoice as CleaningOrder).priceBreakdown.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Jarak Operasional:</span>
                      <span>
                        {formatCurrency(
                          (selectedInvoice as CleaningOrder).priceBreakdown.distanceFee
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Layanan Sistem:</span>
                      <span>
                        {formatCurrency(
                          (selectedInvoice as CleaningOrder).priceBreakdown.serviceFee
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Tagihan:</span>
                      <span className="text-pink-600 font-sans">
                        {formatCurrency((selectedInvoice as CleaningOrder).priceBreakdown.total)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl p-3 space-y-1.5 bg-slate-50">
                    <p className="font-bold text-slate-800 mb-1">Rincian Produk Nail Art:</p>
                    {(selectedInvoice as ProductOrder).items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.productName} (x{item.quantity})
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span>Ongkos Kirim Kurir:</span>
                      <span>{formatCurrency((selectedInvoice as ProductOrder).shippingCost)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Tagihan:</span>
                      <span className="text-amber-700 font-sans">
                        {formatCurrency((selectedInvoice as ProductOrder).total)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black flex items-center gap-1.5"
                >
                  <Printer size={14} /> Cetak / Unduh PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
