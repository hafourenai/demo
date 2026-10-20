'use client';

import { useState } from 'react';
import {
  Star,
  Percent,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PaymentGatewayModal } from '@/components/payment/PaymentGatewayModal';

export default function EmployeeIncomePage() {
  const { currentUser, cleaningOrders, employees, settlements, recordSettlementPayment } =
    useAppStore();

  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0];

  const employeeCompletedOrders = cleaningOrders.filter(
    (o) => o.employeeId === employee?.id && o.status === 'completed'
  );

  const mySettlement = settlements.find((s) => s.employeeId === employee?.id) || {
    id: `stl-${employee?.id}-202610`,
    employeeId: employee?.id,
    employeeName: employee?.name,
    month: '2026-10',
    grossRevenue: employee?.grossRevenueMonth || 10000000,
    settlementRate: employee?.settlementRate || 3.0,
    settlementDue: Math.round((employee?.grossRevenueMonth || 10000000) * 0.03),
    paidAmount: 0,
    remainingAmount: Math.round((employee?.grossRevenueMonth || 10000000) * 0.03),
    status: 'pending' as const,
    adjustments: [],
    paymentRecords: [],
  };

  const grossToday = employee?.grossRevenueToday || 350000;
  const grossMonth = mySettlement.grossRevenue;
  const settlementDue = mySettlement.settlementDue;
  const remainingDue = mySettlement.remainingAmount;
  const estimatedNet = grossMonth - settlementDue;

  const [payingAmount, setPayingAmount] = useState<number>(remainingDue);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handleOpenGateway = () => {
    setShowPayModal(false);
    setShowGateway(true);
  };

  const handleGatewaySuccess = (paymentInfo: { channel: string; reference: string }) => {
    setShowGateway(false);
    recordSettlementPayment(mySettlement.id, payingAmount, paymentInfo.channel);
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 3500);
  };

  return (
    <EmployeeLayout currentPage="history">
      <div className="customer-page space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-text-primary">
              Pendapatan &amp; Setoran
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              100% Gross Revenue &amp; Kewajiban Settlement Bulanan (PRD V2)
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
            Bulan: {mySettlement.month}
          </span>
        </div>

        {paySuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Pembayaran setoran berhasil dicatat dan diajukan verifikasi.
          </div>
        )}

        {/* 4 Pillars Finansial (PRD Section 58) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white border border-border space-y-1 shadow-sm">
            <span className="text-[10px] text-text-muted uppercase font-semibold">
              Gross Hari Ini
            </span>
            <p className="text-lg font-bold text-text-primary font-sans">
              {formatCurrency(grossToday)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">
              100% Hak Anda
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-border space-y-1 shadow-sm">
            <span className="text-[10px] text-text-muted uppercase font-semibold">
              Gross Bulan Ini
            </span>
            <p className="text-lg font-bold text-text-primary font-sans">
              {formatCurrency(grossMonth)}
            </p>
            <span className="text-[10px] text-text-muted font-medium">
              Dari {employeeCompletedOrders.length} order
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-900 uppercase font-bold">
                Setoran ({mySettlement.settlementRate}%)
              </span>
              <Percent size={13} className="text-amber-700" />
            </div>
            <p className="text-lg font-bold text-amber-900 font-sans">
              {formatCurrency(settlementDue)}
            </p>
            <span className="text-[10px] text-amber-800 font-semibold block">
              Sisa: {formatCurrency(remainingDue)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] text-emerald-900 uppercase font-bold">
              Estimasi Bersih
            </span>
            <p className="text-lg font-bold text-emerald-900 font-sans">
              {formatCurrency(estimatedNet)}
            </p>
            <span className="text-[10px] text-emerald-700 font-medium">
              Setelah setoran
            </span>
          </div>
        </div>

        {/* Settlement Payment Card (PRD Section 60) */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Status Setoran Bulanan ke Perusahaan
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                mySettlement.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : mySettlement.status === 'partially_paid'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {mySettlement.status}
            </span>
          </div>

          <div className="p-3 bg-canvas-alt rounded-xl border border-border text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Total Kewajiban Setoran:</span>
              <strong className="text-text-primary">{formatCurrency(settlementDue)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Sudah Dibayarkan:</span>
              <strong className="text-emerald-700">{formatCurrency(mySettlement.paidAmount)}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-text-muted">Sisa Belum Disetor:</span>
              <strong className="text-primary font-bold">{formatCurrency(remainingDue)}</strong>
            </div>
          </div>

          {remainingDue > 0 && (
            <button
              type="button"
              onClick={() => {
                setPayingAmount(remainingDue);
                setShowPayModal(true);
              }}
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Upload size={14} /> Bayar / Kirim Bukti Setoran
            </button>
          )}
        </div>

        {/* Riwayat Pekerjaan Selesai */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Riwayat Pekerjaan Selesai ({employeeCompletedOrders.length})
          </h3>

          {employeeCompletedOrders.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-6">
              Belum ada pekerjaan selesai bulan ini.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {employeeCompletedOrders.map((order) => (
                <div key={order.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-text-muted block">
                      {order.invoiceNumber}
                    </span>
                    <h4 className="font-bold text-text-primary mt-0.5">{order.serviceName}</h4>
                    <p className="text-[11px] text-text-secondary">
                      {order.propertyDetails.buildingSize} m² • {formatDate(order.completedAt || order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">
                      +{formatCurrency(order.priceBreakdown.total)}
                    </span>
                    {order.rating && (
                      <span className="text-[10px] text-warning font-semibold flex items-center gap-0.5 justify-end">
                        <Star size={10} className="fill-warning" /> {order.rating}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settlement Payment Modal */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-sm text-text-primary">
                Setor Kewajiban Bulanan ({mySettlement.settlementRate}%)
              </h3>

              <div className="p-3 bg-canvas-alt rounded-xl border border-border text-xs space-y-1">
                <span className="text-[10px] text-text-muted block">Rekening Perusahaan:</span>
                <p className="font-bold text-text-primary">BCA: 8001-9281-0021</p>
                <p className="text-[11px] text-text-secondary">a/n PT Clean and Nail Indonesia</p>
              </div>

              <div>
                <label className="text-xs text-text-secondary font-medium block mb-1">
                  Nominal Setoran (Rp):
                </label>
                <input
                  type="number"
                  value={payingAmount}
                  onChange={(e) => setPayingAmount(Number(e.target.value))}
                  className="w-full bg-canvas-alt p-2 rounded-lg border border-border text-xs font-bold text-text-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-border"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleOpenGateway}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-black transition-colors"
                >
                  Buka Payment Gateway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Gateway Modal (Settlement to PT) */}
        <PaymentGatewayModal
          isOpen={showGateway}
          onClose={() => setShowGateway(false)}
          onSuccess={handleGatewaySuccess}
          amount={payingAmount}
          invoiceNumber={`STL-${mySettlement.month.replace('-', '')}-${employee.id.slice(0, 4)}`}
          orderTitle={`Setoran Bulanan (${mySettlement.month})`}
          context="employee_settlement"
          recipientName="PT Clean &amp; Nail Operasional"
          recipientBank="BCA"
          recipientAccount="0192837465"
          qrisMerchantName="PT CLEAN &amp; NAIL INDONESIA"
        />
      </div>
    </EmployeeLayout>
  );
}
