'use client';

import { useState } from 'react';
import { Clock, CheckCircle2, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import { CleaningOrder, ProductOrder } from '@/lib/types';

export default function OrdersPage() {
  const { currentUser, customers, cleaningOrders, productOrders } = useAppStore();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [filterType, setFilterType] = useState<'all' | 'cleaning' | 'product'>('all');

  const activeUserId = currentUser?.id || customers[0]?.id || 'cust1';
  const myCleaning = cleaningOrders.filter((o) => o.customerId === activeUserId || !o.customerId);
  const myProduct = productOrders.filter((o) => o.customerId === activeUserId || !o.customerId);

  const allOrders = [...myCleaning, ...myProduct].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const activeOrders = allOrders.filter((o) => {
    if (o.orderType === 'cleaning') {
      return !['completed', 'cancelled_customer', 'cancelled_admin'].includes(o.status);
    }
    return !['completed', 'cancelled'].includes(o.status);
  });

  const completedOrders = allOrders.filter((o) => {
    if (o.orderType === 'cleaning') {
      return ['completed', 'cancelled_customer', 'cancelled_admin'].includes(o.status);
    }
    return ['completed', 'cancelled'].includes(o.status);
  });

  let displayedOrders = tab === 'active' ? activeOrders : completedOrders;

  if (filterType !== 'all') {
    displayedOrders = displayedOrders.filter((o) => o.orderType === filterType);
  }

  return (
    <CustomerLayout currentPage="orders">
      <div className="customer-page space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-text-primary">
            Pesanan Saya
          </h1>
          <span className="text-xs text-text-muted">
            {allOrders.length} Total Riwayat
          </span>
        </div>

        {/* Active vs Completed Tabs (PRD Section 78) */}
        <div className="flex rounded-xl bg-canvas-alt p-1 border border-border">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'active'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Clock size={14} /> Berjalan ({activeOrders.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'completed'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <CheckCircle2 size={14} /> Selesai ({completedOrders.length})
          </button>
        </div>

        {/* Filter Pill: All, Cleaning, Product */}
        <div className="flex gap-2">
          {(
            [
              { id: 'all', label: 'Semua' },
              { id: 'cleaning', label: '🧹 Cleaning' },
              { id: 'product', label: '💅 Nail Art' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                filterType === filter.id
                  ? 'bg-text-primary text-white font-semibold'
                  : 'bg-white text-text-secondary border border-border hover:bg-canvas-alt'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border p-6 space-y-3">
            <p className="text-sm font-semibold text-text-primary">
              {tab === 'active' ? 'Tidak ada pesanan berjalan' : 'Belum ada riwayat pesanan selesai'}
            </p>
            <p className="text-xs text-text-secondary">
              Pesan layanan pembersihan rumah atau belanja produk Nail Art sekarang.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Link
                href="/customer/services"
                className="text-xs px-4 py-2 bg-primary text-white rounded-xl font-semibold"
              >
                Pesan Cleaning
              </Link>
              <Link
                href="/customer/products"
                className="text-xs px-4 py-2 bg-accent text-white rounded-xl font-semibold"
              >
                Belanja Nail Art
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedOrders.map((order) => {
              const isCleaning = order.orderType === 'cleaning';
              const cleanOrder = isCleaning ? (order as CleaningOrder) : null;
              const prodOrder = !isCleaning ? (order as ProductOrder) : null;

              return (
                <Link
                  key={order.id}
                  href={`/customer/orders/${order.id}`}
                  className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-all block space-y-3 group"
                >
                  {/* Top line: Label & Invoice Number */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCleaning
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isCleaning ? 'CLEANING' : 'PRODUK'}
                      </span>
                      <span className="font-mono text-[11px] text-text-muted">
                        {order.invoiceNumber}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'on_the_way'
                          ? 'bg-blue-50 text-blue-700 animate-pulse'
                          : 'bg-canvas-alt text-text-primary'
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-canvas-alt flex items-center justify-center flex-shrink-0 text-text-primary border border-border">
                      {isCleaning ? (
                        <Sparkles size={22} className="text-primary" />
                      ) : (
                        <ShoppingBag size={22} className="text-accent" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-text-primary truncate">
                        {isCleaning
                          ? cleanOrder?.serviceName
                          : `${prodOrder?.items[0]?.productName || 'Produk Nail Art'}${
                              (prodOrder?.items.length || 0) > 1
                                ? ` (+${(prodOrder?.items.length || 0) - 1} lainnya)`
                                : ''
                            }`}
                      </h4>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {isCleaning
                          ? `${cleanOrder?.propertyDetails.buildingSize} m² • ${cleanOrder?.address.detail}`
                          : `Kurir: ${prodOrder?.courierName || 'Ekspedisi'}`}
                      </p>
                      <span className="text-[10px] text-text-muted mt-0.5 block">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-text-muted block">Total Biaya</span>
                      <span className="text-xs font-bold text-primary">
                        {formatCurrency(
                          isCleaning
                            ? cleanOrder?.priceBreakdown.total || 0
                            : prodOrder?.total || 0
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Footer hint */}
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                    <span>
                      {isCleaning && cleanOrder?.status === 'on_the_way' ? (
                        <strong className="text-blue-600">🛵 Live tracking posisi partner aktif</strong>
                      ) : (
                        `Metode: ${order.paymentMethod.toUpperCase()}`
                      )}
                    </span>
                    <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Lihat Rincian <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
