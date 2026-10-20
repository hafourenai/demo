'use client';

import { useState } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency, calculateCleaningPrice } from '@/lib/utils';
import {
  Calculator,
  Save,
  CheckCircle2,
  Layers,
  MapPin,
  Percent,
} from 'lucide-react';
import { BasePriceTier } from '@/lib/types';

export default function AdminPricingRulesPage() {
  const { pricingRule, updatePricingRule } = useAppStore();

  const [tiers, setTiers] = useState<BasePriceTier[]>(pricingRule.basePriceTiers);
  const [pricePerM2Above200, setPricePerM2Above200] = useState<number>(
    pricingRule.pricePerM2Above200
  );
  const [freeDistanceKm, setFreeDistanceKm] = useState<number>(pricingRule.freeDistanceKm);
  const [pricePerKm, setPricePerKm] = useState<number>(pricingRule.pricePerKm);
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(pricingRule.maxServiceRadiusKm);
  const [serviceFee, setServiceFee] = useState<number>(pricingRule.serviceFee);
  const [defaultSettlementRate, setDefaultSettlementRate] = useState<number>(
    pricingRule.defaultSettlementRate || 3.0
  );

  const [saveToast, setSaveToast] = useState(false);

  // Interactive Test Calculator
  const [testM2, setTestM2] = useState<number>(85);
  const [testDistance, setTestDistance] = useState<number>(6.5);
  const [testAddons, setTestAddons] = useState<number>(25000);

  const testCalculation = calculateCleaningPrice(
    testM2,
    testDistance,
    [{ price: testAddons, quantity: 1 }],
    {
      ...pricingRule,
      basePriceTiers: tiers,
      pricePerM2Above200,
      freeDistanceKm,
      pricePerKm,
      serviceFee,
    }
  );

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingRule(
      {
        basePriceTiers: tiers,
        pricePerM2Above200,
        freeDistanceKm,
        pricePerKm,
        maxServiceRadiusKm: maxRadiusKm,
        serviceFee,
        defaultSettlementRate,
      },
      'admin'
    );
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleUpdateTierPrice = (index: number, newPrice: number) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], price: newPrice };
    setTiers(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Pricing Engine &amp; Kalkulasi m²
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur formula tarif dinamis berdasarkan luas properti (m²), radius jarak tempuh, dan settlement rate.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 font-mono">
            <span>Versi Aturan:</span>
            <strong className="text-slate-900 font-bold">V{pricingRule.version}</strong>
          </div>
        </div>

        {saveToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Aturan harga berhasil disimpan dan versi baru V
            {pricingRule.version} aktif!
          </div>
        )}

        <form onSubmit={handleSaveRules} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Base Price Tiers (PRD Section 16) */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-pink-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    1. Base Price Range Luas Bangunan (m²)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">PRD Section 16</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">
                        {tier.minM2 === 0 ? '≤ 50 m²' : `${tier.minM2} - ${tier.maxM2} m²`}
                      </span>
                      <span className="text-[10px] text-slate-400">Tier {idx + 1}</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">
                        Harga Dasar (Rp):
                      </label>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => handleUpdateTierPrice(idx, Number(e.target.value))}
                        className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold font-sans text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Above 200 m² */}
              <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Ekstra di Atas 200 m²:</span>
                  <span className="text-[10px] text-pink-700 font-semibold">Formula Dinamis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Tarif per m² tambahan:</span>
                  <input
                    type="number"
                    value={pricePerM2Above200}
                    onChange={(e) => setPricePerM2Above200(Number(e.target.value))}
                    className="w-24 bg-white px-2 py-1 rounded-lg border border-pink-200 font-bold font-sans text-pink-700 text-center"
                  />
                  <span className="font-semibold text-slate-600">Rp / m²</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Formula: Rp 325.000 + (Luas - 200 m²) × Rp {pricePerM2Above200}
                </p>
              </div>
            </section>

            {/* 2. Distance Fee Settings (PRD Section 17 & 18) */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Biaya Jarak Operasional (Distance Engine)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">PRD Section 17</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Free Radius (Gratis)
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={freeDistanceKm}
                      onChange={(e) => setFreeDistanceKm(Number(e.target.value))}
                      className="w-16 bg-white p-1 rounded-lg border border-slate-200 font-bold text-center"
                    />
                    <span className="font-semibold text-slate-700">KM</span>
                  </div>
                  <span className="text-[9px] text-slate-400">0 - {freeDistanceKm} KM bebas biaya</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Biaya per KM
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={pricePerKm}
                      onChange={(e) => setPricePerKm(Number(e.target.value))}
                      className="w-24 bg-white p-1 rounded-lg border border-slate-200 font-bold text-center font-sans"
                    />
                    <span className="font-semibold text-slate-700">Rp/KM</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Dihitung pembulatan ke atas</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Max Radius Layanan
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={maxRadiusKm}
                      onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                      className="w-16 bg-white p-1 rounded-lg border border-slate-200 font-bold text-center"
                    />
                    <span className="font-semibold text-slate-700">KM</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Batas jangkauan order</span>
                </div>
              </div>
            </section>

            {/* 3. System Service Fee & Settlement (PRD Section 16 & 57) */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Percent size={18} className="text-emerald-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Biaya Sistem &amp; Default Settlement Rate
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">PRD Section 57</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Biaya Layanan Aplikasi (Flat):
                  </span>
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(Number(e.target.value))}
                    className="w-full bg-white p-2 rounded-lg border border-slate-200 font-bold font-sans text-slate-900"
                  />
                  <span className="text-[9px] text-slate-400">Dibebankan pada tiap transaksi</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <span className="text-[10px] text-amber-900 font-bold block">
                    Default Settlement Bulanan:
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={defaultSettlementRate}
                      onChange={(e) => setDefaultSettlementRate(Number(e.target.value))}
                      className="w-20 bg-white p-2 rounded-lg border border-amber-200 font-bold text-center text-amber-900"
                    />
                    <span className="font-bold text-amber-900">% Gross</span>
                  </div>
                  <span className="text-[9px] text-amber-700">Setoran mitra ke platform (3%)</span>
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save size={15} /> Simpan &amp; Terapkan Versi Baru
            </button>
          </div>

          {/* Column 3: Live Simulator Testbed */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-pink-400 flex items-center gap-1.5">
                  <Calculator size={16} /> Live Pricing Simulator
                </h3>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  Uji Coba
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                Uji langsung hasil perhitungan biaya cleaning berdasarkan konfigurasi yang Anda ubah di sebelah kiri sebelum menyimpan.
              </p>

              {/* Slider m² */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Luas Bangunan:</span>
                  <span className="font-bold text-white">{testM2} m²</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="350"
                  value={testM2}
                  onChange={(e) => setTestM2(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Slider Jarak */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Estimasi Jarak Radius:</span>
                  <span className="font-bold text-white">{testDistance.toFixed(1)} KM</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={testDistance}
                  onChange={(e) => setTestDistance(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Select Addon for test */}
              <div className="space-y-1">
                <label className="text-slate-300 block">Layanan Tambahan (Add-on):</label>
                <select
                  value={testAddons}
                  onChange={(e) => setTestAddons(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-white text-xs"
                >
                  <option value={0}>Tidak ada add-on (Rp 0)</option>
                  <option value={25000}>Kamar Mandi Ekstra (+Rp 25.000)</option>
                  <option value={35000}>Kulkas Luar Dalam (+Rp 35.000)</option>
                  <option value={60000}>Sofa Vacuum (+Rp 60.000)</option>
                </select>
              </div>

              {/* Live Calculation Output Card */}
              <div className="pt-3 border-t border-white/10 space-y-2 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <div className="flex justify-between text-slate-300">
                  <span>Base Price ({testM2} m²):</span>
                  <span className="font-medium text-white">
                    {formatCurrency(testCalculation.basePrice)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Biaya Jarak ({testDistance} KM):</span>
                  <span className="font-medium text-white">
                    {testCalculation.distanceFee === 0
                      ? 'GRATIS'
                      : formatCurrency(testCalculation.distanceFee)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Add-on:</span>
                  <span className="font-medium text-white">
                    {formatCurrency(testCalculation.addonsTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Biaya Layanan:</span>
                  <span className="font-medium text-white">
                    {formatCurrency(testCalculation.serviceFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-pink-400">
                  <span>Total Tagihan:</span>
                  <span className="text-base text-pink-400 font-sans">
                    {formatCurrency(testCalculation.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
