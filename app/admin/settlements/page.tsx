'use client';

import { useState, useMemo } from 'react';
import useAppStore from '@/lib/store';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  History,
  Search,
  X,
} from 'lucide-react';
import { EmployeeSettlement } from '@/lib/types';

export default function AdminSettlementsPage() {
  const {
    settlements,
    auditLogs,
    recordSettlementPayment,
    addSettlementAdjustment,
    updateSettlementRate,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState<EmployeeSettlement | null>(null);

  // Payment Recording Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('Transfer BCA');

  // Adjustment Modal
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjAmount, setAdjAmount] = useState<number>(0);
  const [adjReason, setAdjReason] = useState('');

  // Global Rate Configuration
  const [globalRate, setGlobalRate] = useState<number>(3.0);
  const [rateToast, setRateToast] = useState('');

  const filteredSettlements = useMemo(() => {
    return settlements.filter(
      (s) =>
        s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.month.includes(searchQuery)
    );
  }, [settlements, searchQuery]);

  const totalGross = settlements.reduce((sum, s) => sum + s.grossRevenue, 0);
  const totalDue = settlements.reduce((sum, s) => sum + s.settlementDue, 0);
  const totalPaid = settlements.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalRemaining = settlements.reduce((sum, s) => sum + s.remainingAmount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSettlement || payAmount <= 0) return;

    recordSettlementPayment(selectedSettlement.id, payAmount, payMethod);
    setShowPayModal(false);
    setSelectedSettlement(null);
  };

  const handleAddAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSettlement || !adjReason) return;

    addSettlementAdjustment(selectedSettlement.id, adjAmount, adjReason, 'admin');
    setShowAdjModal(false);
    setSelectedSettlement(null);
  };

  const handleUpdateGlobalRate = () => {
    updateSettlementRate('all', globalRate, 'admin');
    setRateToast(`Rate global berhasil diupdate menjadi ${globalRate}%.`);
    setTimeout(() => setRateToast(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Settlement &amp; Setoran Partner (3%)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring kewajiban setoran bulanan karyawan dari 100% gross revenue langsung.
            </p>
          </div>

          {/* Global Rate Widget */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
            <span className="font-semibold text-slate-700">Rate Default Platform:</span>
            <input
              type="number"
              step="0.1"
              value={globalRate}
              onChange={(e) => setGlobalRate(Number(e.target.value))}
              className="w-14 bg-slate-100 px-2 py-1 rounded border border-slate-200 font-bold text-center"
            />
            <span className="font-bold">%</span>
            <button
              onClick={handleUpdateGlobalRate}
              className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-colors"
            >
              Update Semua
            </button>
          </div>
        </div>

        {rateToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> {rateToast}
          </div>
        )}

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Total Gross Revenue
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1 font-sans">
              {formatCurrency(totalGross)}
            </p>
            <span className="text-[10px] text-slate-500">100% diterima karyawan</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Total Kewajiban Setoran
            </span>
            <p className="text-xl font-bold text-amber-700 mt-1 font-sans">
              {formatCurrency(totalDue)}
            </p>
            <span className="text-[10px] text-slate-500">Porsi hak platform (3%)</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Sudah Disetor (Paid)
            </span>
            <p className="text-xl font-bold text-emerald-700 mt-1 font-sans">
              {formatCurrency(totalPaid)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">Masuk rekening PT</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Sisa Piutang (Due)
            </span>
            <p className="text-xl font-bold text-rose-700 mt-1 font-sans">
              {formatCurrency(totalRemaining)}
            </p>
            <span className="text-[10px] text-rose-600 font-medium">Belum disetor partner</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama karyawan atau bulan (e.g. 2026-10)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Bulan</th>
                  <th className="px-4 py-3">Nama Karyawan</th>
                  <th className="px-4 py-3">Gross Revenue (100%)</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Kewajiban Setor</th>
                  <th className="px-4 py-3">Sudah Dibayar</th>
                  <th className="px-4 py-3">Sisa Setoran</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSettlements.map((stl) => (
                  <tr key={stl.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-600">{stl.month}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{stl.employeeName}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                      {formatCurrency(stl.grossRevenue)}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-600">{stl.settlementRate}%</td>
                    <td className="px-4 py-3 font-bold text-amber-900 font-sans">
                      {formatCurrency(stl.settlementDue)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-700 font-sans">
                      {formatCurrency(stl.paidAmount)}
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-700 font-sans">
                      {formatCurrency(stl.remainingAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          stl.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : stl.status === 'partially_paid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {stl.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedSettlement(stl);
                            setPayAmount(stl.remainingAmount);
                            setShowPayModal(true);
                          }}
                          className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded font-semibold text-[11px]"
                          title="Catat Pembayaran"
                        >
                          Catat Bayar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSettlement(stl);
                            setAdjAmount(0);
                            setAdjReason('');
                            setShowAdjModal(true);
                          }}
                          className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold text-[11px]"
                          title="Penyesuaian Manual"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Table (PRD Section 62: Immutability & Audit Trail) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <History size={14} /> Settlement &amp; Rate Audit Trail
            </h3>
            <span className="text-[10px] text-slate-400">Tercatat permanen</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-2">
                Belum ada penyesuaian audit log manual bulan ini.
              </p>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block font-mono text-[11px]">
                      {log.action}
                    </span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDate(log.timestamp)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL: RECORD PAYMENT */}
        {showPayModal && selectedSettlement && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Catat Setoran {selectedSettlement.employeeName}
                </h3>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Sisa Kewajiban:</span>
                  <strong className="text-sm font-bold text-slate-900 font-sans">
                    {formatCurrency(selectedSettlement.remainingAmount)}
                  </strong>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nominal Pembayaran (Rp):
                  </label>
                  <input
                    required
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold font-sans text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Metode Setoran:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                  >
                    <option value="Transfer BCA">Transfer BCA Perusahaan</option>
                    <option value="Transfer Mandiri">Transfer Mandiri</option>
                    <option value="Tunai ke Kantor">Tunai ke Kantor Kasir</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 py-2 bg-slate-100 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                  >
                    Simpan Setoran
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: MANUAL ADJUSTMENT */}
        {showAdjModal && selectedSettlement && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Adjustment Setoran (Audit Trail)
                </h3>
                <button
                  onClick={() => setShowAdjModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleAddAdjustment} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nominal Penyesuaian (+ Tambah / - Kurang):
                  </label>
                  <input
                    required
                    type="number"
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(Number(e.target.value))}
                    placeholder="-20000 atau 50000"
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Gunakan tanda minus (-) untuk insentif potongan setoran
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Alasan Penyesuaian (Wajib Audit):
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Contoh: Reward bonus penyelesaian 10 pekerjaan tanpa komplain..."
                    value={adjReason}
                    onChange={(e) => setAdjReason(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdjModal(false)}
                    className="flex-1 py-2 bg-slate-100 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black"
                  >
                    Simpan Log Penyesuaian
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
