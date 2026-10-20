'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Save, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
import useAppStore from '@/lib/store';

export default function SettingsPage() {
  const { pricingRule } = useAppStore();
  const [businessName, setBusinessName] = useState('Clean & Nail Indonesia');
  const [businessEmail, setBusinessEmail] = useState('contact@cleanandnail.id');
  const [businessPhone, setBusinessPhone] = useState('0812-9988-7766');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Pengaturan Platform</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi identitas bisnis Clean&amp;Nail, model finansial, dan parameter sistem.
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Pengaturan platform berhasil disimpan!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Profile */}
          <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building size={16} className="text-pink-600" />
              Identitas Bisnis &amp; Kontak Operasional
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Platform:</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Resmi:</label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Hotline Operasional / CS:
                </label>
                <input
                  type="text"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </section>

          {/* Business Model Summary */}
          <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              Kebijakan Finansial PRD V2
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">
                  Model Pembayaran Karyawan (100% Gross)
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Hak bruto penuh diserahkan langsung oleh customer kepada karyawan (via QRIS
                  pribadi, transfer bank mitra, atau uang tunai).
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block">
                  Settlement Bulanan Platform ({pricingRule.defaultSettlementRate || 3.0}%)
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Karyawan menyetorkan kewajiban bulanan default 3.0% dari total omzet bruto bulanan
                  ke rekening resmi perusahaan.
                </p>
              </div>
            </div>
          </section>

          {/* System Specs */}
          <section className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Versi Spesifikasi Platform:</span>
              <strong className="text-slate-900 font-mono">PRD V2 Production Ready</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Penyimpanan Demo:</span>
              <strong className="text-slate-900">Zustand LocalStorage Persistence</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Aturan Pricing Versi:</span>
              <strong className="text-slate-900 font-mono">V{pricingRule.version}</strong>
            </div>
          </section>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save size={14} /> Simpan Pengaturan
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
