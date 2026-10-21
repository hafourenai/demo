'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import { Sparkles, ShoppingBag, Eye, X } from 'lucide-react';
import { CleaningOrder, ProductOrder } from '@/lib/types';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'product' ? 'product' : 'cleaning';

  const {
    cleaningOrders,
    productOrders,
    employees,
    updateProductOrderStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'cleaning' | 'product'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCleaning, setSelectedCleaning] = useState<CleaningOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductOrder | null>(null);

  // Ship order modal state
  const [shippingCourier, setShippingCourier] = useState('');
  const [shippingResi, setShippingResi] = useState('');

  // Filtering cleaning orders
  const filteredCleaning = useMemo(() => {
    return cleaningOrders.filter((o) => {
      const matchSearch =
        o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [cleaningOrders, searchQuery]);

  // Filtering product orders
  const filteredProducts = useMemo(() => {
    return productOrders.filter((o) => {
      const matchSearch =
        o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.trackingNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [productOrders, searchQuery]);

  const handleUpdateShipping = (orderId: string) => {
    if (!shippingCourier || !shippingResi) {
      alert('Harap isi nama kurir dan nomor resi pengiriman.');
      return;
    }
    updateProductOrderStatus(orderId, 'shipped', shippingCourier, shippingResi);
    setSelectedProduct(null);
    setShippingCourier('');
    setShippingResi('');
  };

  return (
    <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Manajemen Seluruh Pesanan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola cleaning on-demand dan pesanan e-commerce Nail Art
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cleaning')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'cleaning'
                  ? 'bg-white shadow-sm text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={14} /> Cleaning Orders ({cleaningOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'product'
                  ? 'bg-white shadow-sm text-amber-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag size={14} /> Nail Art Orders ({productOrders.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan No. Invoice, Nama Customer, atau Layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* TAB 1: CLEANING ORDERS */}
        {activeTab === 'cleaning' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Layanan &amp; m²</th>
                    <th className="px-4 py-3">Partner Karyawan</th>
                    <th className="px-4 py-3">Jarak</th>
                    <th className="px-4 py-3">Total Tagihan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCleaning.map((order) => {
                    const emp = employees.find((e) => e.id === order.employeeId);
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-pink-600">
                          {order.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {order.customerName}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {order.customerPhone}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{order.serviceName}</span>
                          <span className="text-[10px] text-slate-500">
                            {order.propertyDetails.buildingSize} m² ({order.propertyDetails.propertyType})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {emp ? (
                            <span className="font-semibold text-slate-800">{emp.name}</span>
                          ) : (
                            <span className="text-amber-600 font-medium italic">Mencari Partner...</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-600">
                          {order.distanceKm} KM
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                          {formatCurrency(order.priceBreakdown.total)}
                          <span className="block text-[9px] uppercase font-semibold text-slate-400">
                            {order.paymentMethod} • {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'on_the_way'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedCleaning(order)}
                            className="p-1.5 bg-slate-100 hover:bg-pink-100 text-slate-700 hover:text-pink-600 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT ORDERS (Nail Art) */}
        {activeTab === 'product' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Rincian Barang</th>
                    <th className="px-4 py-3">Ekspedisi / Resi</th>
                    <th className="px-4 py-3">Total Belanja</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-amber-700">
                        {order.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {order.customerName}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {order.customerPhone}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 block">{order.courierName}</span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {order.trackingNumber || 'Belum ada resi'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase">
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedProduct(order)}
                          className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg transition-colors"
                          title="Kelola Pengiriman"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: DETAIL CLEANING ORDER */}
        {selectedCleaning && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Detail Cleaning Order</h3>
                  <span className="font-mono text-pink-600 font-bold">
                    {selectedCleaning.invoiceNumber}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCleaning(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-800">
                    {selectedCleaning.serviceName} ({selectedCleaning.propertyDetails.buildingSize} m²)
                  </p>
                  <p className="text-slate-600">Alamat: {selectedCleaning.address.detail}</p>
                  <p className="text-slate-500 text-[11px]">
                    Status: <strong className="uppercase">{selectedCleaning.status}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 text-[10px] block">Customer</span>
                    <strong className="text-slate-800">{selectedCleaning.customerName}</strong>
                  </div>
                  <div className="p-2 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 text-[10px] block">Partner Ditugaskan</span>
                    <strong className="text-slate-800">
                      {employees.find((e) => e.id === selectedCleaning.employeeId)?.name || 'Belum Ada'}
                    </strong>
                  </div>
                </div>

                {/* Evidence photos preview */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 block">Foto Dokumentasi (Before &amp; After):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                      {selectedCleaning.beforePhotos.length > 0 ? (
                        <img
                          src={selectedCleaning.beforePhotos[0]}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">Belum ada foto Before</span>
                      )}
                    </div>
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                      {selectedCleaning.afterPhotos.length > 0 ? (
                        <img
                          src={selectedCleaning.afterPhotos[0]}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">Belum ada foto After</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCleaning(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DETAIL / SHIP PRODUCT ORDER */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Kelola Pengiriman Nail Art</h3>
                  <span className="font-mono text-amber-700 font-bold">
                    {selectedProduct.invoiceNumber}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">Penerima: {selectedProduct.customerName}</p>
                  <p className="text-slate-600 mt-0.5">{selectedProduct.address.detail}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Kurir Pengiriman:</label>
                  <input
                    type="text"
                    defaultValue={selectedProduct.courierName || 'SiCepat BEST Express'}
                    onChange={(e) => setShippingCourier(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Nomor Resi / AWB:</label>
                  <input
                    type="text"
                    placeholder="Contoh: SCP-8291029102"
                    defaultValue={selectedProduct.trackingNumber || ''}
                    onChange={(e) => setShippingResi(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateShipping(selectedProduct.id)}
                  className="flex-1 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700"
                >
                  Simpan &amp; Tandai Dikirim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat orders...</div>}>
        <AdminOrdersContent />
      </Suspense>
    </AdminLayout>
  );
}
