'use client';

import { useMemo, useState } from 'react';
import {
  Briefcase,
  Sparkles,
  ShoppingBag,
  DollarSign,
  MapPin,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboard() {
  const {
    employees,
    cleaningOrders,
    productOrders,
    settlements,
  } = useAppStore();

  const [mapFilter, setMapFilter] = useState<'all' | 'available' | 'on_the_way' | 'in_service'>('all');

  // KPI Calculations (PRD Section 83)
  const stats = useMemo(() => {
    const totalCleaningToday = cleaningOrders.length;
    const searchingCleaning = cleaningOrders.filter((o) => o.status === 'searching_employee').length;
    const activeCleaning = cleaningOrders.filter((o) =>
      ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
    ).length;

    const totalProductOrders = productOrders.length;

    const busyEmployees = employees.filter((e) =>
      cleaningOrders.some(
        (o) =>
          o.employeeId === e.id &&
          ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
      )
    ).length;
    const availableEmployees = employees.length - busyEmployees;

    const grossVolumeCleaning = cleaningOrders.reduce(
      (sum, o) => sum + o.priceBreakdown.total,
      0
    );
    const volumeProduct = productOrders.reduce((sum, o) => sum + o.total, 0);
    const totalVolume = grossVolumeCleaning + volumeProduct;

    const totalSettlementDue = settlements.reduce((sum, s) => sum + s.settlementDue, 0);
    const totalSettlementPaid = settlements.reduce((sum, s) => sum + s.paidAmount, 0);

    return {
      totalCleaningToday,
      searchingCleaning,
      activeCleaning,
      totalProductOrders,
      availableEmployees,
      busyEmployees,
      totalVolume,
      totalSettlementDue,
      totalSettlementPaid,
    };
  }, [cleaningOrders, productOrders, employees, settlements]);

  // Operational Map Markers Simulation (PRD Section 84)
  const mapMarkers = useMemo(() => {
    const markers: Array<{
      id: string;
      name: string;
      type: 'available_emp' | 'on_the_way' | 'in_service' | 'customer_order';
      label: string;
      x: number; // percentage on map
      y: number; // percentage on map
    }> = [];

    // 1. Employees
    employees.forEach((emp, i) => {
      const activeJob = cleaningOrders.find(
        (o) =>
          o.employeeId === emp.id &&
          ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
      );

      let type: 'available_emp' | 'on_the_way' | 'in_service' = 'available_emp';
      let statusLabel = 'Available';

      if (activeJob) {
        if (activeJob.status === 'on_the_way') {
          type = 'on_the_way';
          statusLabel = 'On The Way';
        } else {
          type = 'in_service';
          statusLabel = 'In Service';
        }
      }

      markers.push({
        id: emp.id,
        name: emp.name,
        type,
        label: `${emp.name} (${statusLabel})`,
        x: 20 + ((i * 24 + 10) % 70),
        y: 25 + ((i * 28 + 15) % 60),
      });
    });

    // 2. Active Customer orders waiting
    cleaningOrders
      .filter((o) => o.status === 'searching_employee')
      .forEach((order, i) => {
        markers.push({
          id: order.id,
          name: order.serviceName,
          type: 'customer_order',
          label: `Order: ${order.serviceName} (${order.address.detail.split(',')[0]})`,
          x: 35 + ((i * 30 + 12) % 55),
          y: 40 + ((i * 20 + 20) % 50),
        });
      });

    return markers;
  }, [employees, cleaningOrders]);

  const filteredMarkers = useMemo(() => {
    if (mapFilter === 'all') return mapMarkers;
    if (mapFilter === 'available') return mapMarkers.filter((m) => m.type === 'available_emp');
    if (mapFilter === 'on_the_way') return mapMarkers.filter((m) => m.type === 'on_the_way');
    return mapMarkers.filter((m) => m.type === 'in_service');
  }, [mapMarkers, mapFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Operational Command Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitoring realtime order cleaning, live map karyawan, setoran settlement, dan penjualan Nail Art.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Sistem Realtime Aktif
            </span>
          </div>
        </div>

        {/* 8 Primary KPI Cards (PRD Section 83) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Cleaning Orders</span>
              <Sparkles size={16} className="text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-sans">
              {stats.totalCleaningToday}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-amber-600 font-bold">{stats.searchingCleaning} Searching</span>
              <span className="text-blue-600 font-bold">{stats.activeCleaning} Aktif</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Product Orders</span>
              <ShoppingBag size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-sans">
              {stats.totalProductOrders}
            </p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              E-Commerce Nail Art
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Partner Karyawan</span>
              <Briefcase size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-sans">
              {employees.length}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-emerald-600 font-bold">{stats.availableEmployees} Siap</span>
              <span className="text-rose-600 font-bold">{stats.busyEmployees} Sedang Tugas</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Total Volume GMV</span>
              <DollarSign size={16} className="text-indigo-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 font-sans">
              {formatCurrency(stats.totalVolume)}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span>Setoran Due:</span>
              <span className="font-bold text-amber-700">{formatCurrency(stats.totalSettlementDue)}</span>
            </div>
          </div>
        </div>

        {/* REALTIME OPERATIONAL MAP (PRD Section 84) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-pink-600" />
                Admin Realtime Operational Map
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring sebaran lokasi karyawan dan order aktif di wilayah operasional Jabodetabek
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setMapFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mapFilter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'
                }`}
              >
                Semua ({mapMarkers.length})
              </button>
              <button
                onClick={() => setMapFilter('available')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mapFilter === 'available' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-600'
                }`}
              >
                Available ({stats.availableEmployees})
              </button>
              <button
                onClick={() => setMapFilter('on_the_way')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mapFilter === 'on_the_way' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600'
                }`}
              >
                On The Way
              </button>
              <button
                onClick={() => setMapFilter('in_service')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mapFilter === 'in_service' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-600'
                }`}
              >
                In Service
              </button>
            </div>
          </div>

          {/* Interactive Map Canvas Container */}
          <div className="relative h-96 w-full rounded-xl bg-slate-900 overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center p-4">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Simulated Road network */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800 stroke-[2] opacity-50">
              <line x1="0" y1="50" x2="1000" y2="400" />
              <line x1="200" y1="0" x2="600" y2="500" />
              <line x1="0" y1="280" x2="1000" y2="220" />
            </svg>

            {/* Markers */}
            {filteredMarkers.map((marker) => {
              const colorClass =
                marker.type === 'available_emp'
                  ? 'bg-emerald-500 ring-emerald-400'
                  : marker.type === 'on_the_way'
                  ? 'bg-blue-500 ring-blue-400 animate-pulse'
                  : marker.type === 'in_service'
                  ? 'bg-purple-500 ring-purple-400'
                  : 'bg-rose-500 ring-rose-400 animate-bounce';

              const icon =
                marker.type === 'customer_order'
                  ? '📍'
                  : marker.type === 'on_the_way'
                  ? '🛵'
                  : '🧹';

              return (
                <div
                  key={marker.id}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center text-xs shadow-lg ring-4 ring-opacity-30 border border-white`}
                  >
                    {icon}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                    {marker.label}
                  </div>
                </div>
              );
            })}

            {/* Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-[11px] text-white space-y-1.5 z-20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Available Employee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span>On The Way (Sedang Jalan)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span>In Service (Sedang Bersih)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Active Customer Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Sub-Sections: Top Performing & Settlement Due Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Cleaners & Nail Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Top Employee &amp; Layanan Terpopuler
            </h3>
            <div className="space-y-2 text-xs">
              {employees.slice(0, 3).map((emp, i) => (
                <div key={emp.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-[11px]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{emp.name}</p>
                      <p className="text-[10px] text-slate-500">★ {emp.rating} • {emp.totalJobs} order</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(emp.grossRevenueMonth || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Monitor Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Kewajiban Setoran Partner (3%)
              </h3>
              <Link href="/admin/settlements" className="text-xs font-semibold text-pink-600 hover:underline">
                Kelola Semua &gt;
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              {settlements.map((stl) => (
                <div key={stl.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{stl.employeeName}</p>
                    <p className="text-[10px] text-slate-500">
                      Gross: {formatCurrency(stl.grossRevenue)} (Rate: {stl.settlementRate}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-900">{formatCurrency(stl.settlementDue)}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      stl.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {stl.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
