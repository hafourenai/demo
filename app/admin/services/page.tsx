'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency } from '@/lib/utils';
import { Clock, Star, Search } from 'lucide-react';

export default function AdminServicesPage() {
  const { cleaningServices, cleaningAddons } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'services' | 'addons'>('services');

  const filteredServices = cleaningServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Katalog Layanan Home Cleaning
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola jenis layanan pembersihan, checklist operasional standar, dan pilihan add-on.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedTab('services')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === 'services'
                  ? 'bg-white shadow-sm text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Layanan Utama ({cleaningServices.length})
            </button>
            <button
              onClick={() => setSelectedTab('addons')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === 'addons'
                  ? 'bg-white shadow-sm text-pink-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Add-on Tambahan ({cleaningAddons.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari layanan cleaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* TAB 1: CLEANING SERVICES */}
        {selectedTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.popularityBadge && (
                      <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {service.popularityBadge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {service.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {service.rating}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{service.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{service.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock size={13} /> {service.duration} Menit
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {service.isAvailable ? '✓ Aktif Ditawarkan' : 'Nonaktif'}
                      </span>
                    </div>

                    {/* Checklist preview */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <span className="font-bold text-slate-700 block">
                        Template Checklist ({service.checklistTemplate?.length || 0} item):
                      </span>
                      <ul className="text-slate-500 space-y-0.5">
                        {service.checklistTemplate?.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="truncate">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="p-2 bg-pink-50 text-pink-700 rounded-xl text-center text-xs font-semibold">
                    Tarif dihitung dinamis via m² Pricing Rules
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CLEANING ADDONS (PRD Section 19) */}
        {selectedTab === 'addons' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cleaningAddons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{addon.name}</h3>
                    <span className="text-xs font-bold text-pink-600 font-sans">
                      +{formatCurrency(addon.price)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{addon.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  ID: <span className="font-mono">{addon.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
