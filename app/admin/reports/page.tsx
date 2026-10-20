'use client';

import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, ShoppingBag, Award, Star } from 'lucide-react';

export default function ReportsPage() {
  const {
    cleaningOrders,
    productOrders,
    cleaningServices,
    nailArtProducts,
    employees,
    settlements,
  } = useAppStore();

  // Revenue analytics
  const cleaningGross = cleaningOrders.reduce((sum, o) => sum + o.priceBreakdown.total, 0);
  const productGross = productOrders.reduce((sum, o) => sum + o.total, 0);
  const totalGross = cleaningGross + productGross;

  const totalSettlementDue = settlements.reduce((sum, s) => sum + s.settlementDue, 0);
  const totalSettlementPaid = settlements.reduce((sum, s) => sum + s.paidAmount, 0);

  // Popular Cleaning Services
  const popularServices = cleaningServices
    .map((svc) => ({
      ...svc,
      orderCount: cleaningOrders.filter((o) => o.serviceId === svc.id).length,
    }))
    .sort((a, b) => b.orderCount - a.orderCount);

  // Top Products
  const popularProducts = nailArtProducts
    .map((prod) => ({
      ...prod,
      soldCount: productOrders.reduce((sum, o) => {
        const item = o.items.find((i) => i.productId === prod.id);
        return sum + (item ? item.quantity : 0);
      }, 0),
    }))
    .sort((a, b) => b.soldCount - a.soldCount);

  // Top Employees
  const employeePerformance = employees
    .map((emp) => {
      const completed = cleaningOrders.filter(
        (o) => o.employeeId === emp.id && o.status === 'completed'
      );
      return {
        ...emp,
        completedCount: completed.length,
        grossGenerated: completed.reduce((sum, o) => sum + o.priceBreakdown.total, 0),
      };
    })
    .sort((a, b) => b.completedCount - a.completedCount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Laporan Analitik &amp; Finansial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ikhtisar performa bisnis Home Cleaning on-demand dan penjualan produk Nail Art.
          </p>
        </div>

        {/* 4 Financial Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Gross Volume Total
            </span>
            <p className="text-xl font-bold text-slate-900 font-sans">
              {formatCurrency(totalGross)}
            </p>
            <span className="text-[10px] text-slate-500">Cleaning &amp; Nail Art GMV</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Gross Cleaning (100% Mitra)
            </span>
            <p className="text-xl font-bold text-pink-600 font-sans">
              {formatCurrency(cleaningGross)}
            </p>
            <span className="text-[10px] text-slate-500">{cleaningOrders.length} order jasa</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Nail Art E-Commerce
            </span>
            <p className="text-xl font-bold text-amber-700 font-sans">
              {formatCurrency(productGross)}
            </p>
            <span className="text-[10px] text-slate-500">{productOrders.length} order toko</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Setoran Platform (3%)
            </span>
            <p className="text-xl font-bold text-emerald-700 font-sans">
              {formatCurrency(totalSettlementDue)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">
              Terbayar: {formatCurrency(totalSettlementPaid)}
            </span>
          </div>
        </div>

        {/* 2 Breakdown Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Cleaning Services */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles size={14} className="text-pink-600" />
              Layanan Home Cleaning Terlaris
            </h2>
            <div className="divide-y divide-slate-100 text-xs">
              {popularServices.map((svc, i) => (
                <div key={svc.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{svc.name}</span>
                  </div>
                  <span className="font-bold text-pink-600">{svc.orderCount} Pesanan</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-amber-700" />
              Produk Nail Art Terlaris
            </h2>
            <div className="divide-y divide-slate-100 text-xs">
              {popularProducts.map((prod, i) => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 max-w-xs truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{prod.name}</span>
                  </div>
                  <span className="font-bold text-amber-700 flex-shrink-0">{prod.soldCount} Terjual</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Partner Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Award size={15} className="text-emerald-600" />
            Performa Cleaning Partners
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Partner</th>
                  <th className="px-4 py-2.5">Rating</th>
                  <th className="px-4 py-2.5">Order Selesai</th>
                  <th className="px-4 py-2.5">Total Gross Dihasilkan</th>
                  <th className="px-4 py-2.5">Kewajiban Setoran (3%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeePerformance.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-bold text-slate-800">{emp.name}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-0.5 font-semibold text-amber-600">
                        <Star size={11} className="fill-amber-500" /> {emp.rating}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-700">
                      {emp.completedCount} Order
                    </td>
                    <td className="px-4 py-2.5 font-bold text-emerald-700 font-sans">
                      {formatCurrency(emp.grossGenerated)}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-amber-800 font-sans">
                      {formatCurrency(Math.round(emp.grossGenerated * (emp.settlementRate / 100)))}
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
