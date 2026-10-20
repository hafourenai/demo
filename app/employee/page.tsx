'use client';

import { useMemo } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function EmployeeDashboard() {
  const { currentUser, cleaningOrders, employees } = useAppStore();

  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0];

  // Available orders for employee based on skill & searching status
  const availableOrders = useMemo(() => {
    return cleaningOrders.filter(
      (o) =>
        o.status === 'searching_employee' &&
        (!employee?.skills || employee.skills.length === 0 || employee.skills.includes(o.serviceName))
    );
  }, [cleaningOrders, employee]);

  // Current active job for this employee
  const activeOrder = useMemo(() => {
    return cleaningOrders.find(
      (o) =>
        o.employeeId === employee?.id &&
        ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
    );
  }, [cleaningOrders, employee]);

  const grossToday = employee?.grossRevenueToday || 350000;
  const grossMonth = employee?.grossRevenueMonth || 10000000;
  const settlementRate = employee?.settlementRate || 3.0;
  const settlementDue = Math.round(grossMonth * (settlementRate / 100));
  const estimatedNet = grossMonth - settlementDue;

  return (
    <EmployeeLayout currentPage="home">
      <div className="customer-page space-y-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Partner Cleaning Terverifikasi
            </span>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
              ★ {employee?.rating || 4.9}
            </span>
          </div>
          <h1 className="text-xl font-serif font-bold">
            Halo, {employee?.name} 👋
          </h1>
          <p className="text-xs text-white/85 mt-0.5">
            {employee?.specialization || 'Home Cleaning Specialist'} • 100% Gross Revenue
          </p>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <span>Status Kemitraan:</span>
            <span className="font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">
              Aktif Bekerja
            </span>
          </div>
        </div>

        {/* Active Job Alert Card */}
        {activeOrder ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-4 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                PEKERJAAN AKTIF
              </span>
              <span className="font-mono text-xs font-bold text-blue-900">
                {activeOrder.invoiceNumber}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-text-primary">
                {activeOrder.serviceName} ({activeOrder.propertyDetails.buildingSize} m²)
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Alamat: {activeOrder.address.detail}
              </p>
              <div className="mt-2 text-xs font-semibold text-blue-700">
                Status saat ini: {activeOrder.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <Link
              href="/employee/active"
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
            >
              Lanjutkan Pekerjaan Ini <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="bg-white p-3.5 rounded-2xl border border-border flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-text-primary">Tidak Ada Pekerjaan Berjalan</p>
              <p className="text-[11px] text-text-secondary">
                {availableOrders.length} order baru sedang mencari partner.
              </p>
            </div>
            {availableOrders.length > 0 && (
              <Link
                href="/employee/available"
                className="py-1.5 px-3 bg-primary text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Ambil Order
              </Link>
            )}
          </div>
        )}

        {/* Financial Summary Card (PRD Section 58) */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Ringkasan Finansial &amp; Setoran (Settlement)
            </h2>
            <Link href="/employee/history" className="text-xs font-semibold text-emerald-700 hover:underline">
              Detail &gt;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-canvas border border-border">
              <span className="text-[10px] text-text-muted block">Gross Hari Ini</span>
              <p className="font-bold text-sm text-text-primary mt-0.5">
                {formatCurrency(grossToday)}
              </p>
              <span className="text-[9px] text-emerald-600 font-semibold block mt-1">
                100% Masuk ke Anda
              </span>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-border">
              <span className="text-[10px] text-text-muted block">Gross Bulan Ini</span>
              <p className="font-bold text-sm text-text-primary mt-0.5">
                {formatCurrency(grossMonth)}
              </p>
              <span className="text-[9px] text-text-muted block mt-1">
                Total bruto berjalan
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-900 font-semibold block">Kewajiban Setoran ({settlementRate}%)</span>
                <Percent size={12} className="text-amber-700" />
              </div>
              <p className="font-bold text-sm text-amber-900 mt-0.5">
                {formatCurrency(settlementDue)}
              </p>
              <span className="text-[9px] text-amber-700 block mt-1">
                Disetor ke perusahaan
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-900 font-semibold block">Estimasi Net Bersih</span>
              <p className="font-bold text-sm text-emerald-900 mt-0.5">
                {formatCurrency(estimatedNet)}
              </p>
              <span className="text-[9px] text-emerald-700 block mt-1">
                Setelah setoran 3%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/employee/available"
            className="p-4 rounded-2xl bg-white border border-border shadow-sm hover:border-primary transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                {availableOrders.length}
              </div>
              <h3 className="font-bold text-xs text-text-primary">Order Tersedia</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Ambil order secepatnya
              </p>
            </div>
            <span className="text-xs font-semibold text-primary mt-3 flex items-center gap-1">
              Buka Order <ArrowRight size={13} />
            </span>
          </Link>

          <Link
            href="/employee/account"
            className="p-4 rounded-2xl bg-white border border-border shadow-sm hover:border-emerald-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 font-bold">
                💳
              </div>
              <h3 className="font-bold text-xs text-text-primary">Rekening &amp; QRIS</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {employee?.paymentProfile?.bankName} ({employee?.paymentProfile?.bankAccountNumber})
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 mt-3 flex items-center gap-1">
              Kelola <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </div>
    </EmployeeLayout>
  );
}
