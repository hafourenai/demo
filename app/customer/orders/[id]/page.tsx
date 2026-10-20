'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Star,
  Truck,
  FileText,
  X,
  Upload,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import { CleaningOrderStatus } from '@/lib/types';
import { PaymentGatewayModal } from '@/components/payment/PaymentGatewayModal';

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    cleaningOrders,
    productOrders,
    employees,
    cancelCleaningOrder,
    rateCleaningOrder,
    confirmOrderPayment,
  } = useAppStore();

  const cleaningOrder = cleaningOrders.find((o) => o.id === params.id);
  const productOrder = productOrders.find((o) => o.id === params.id);

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // Payment proof simulation
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  if (!cleaningOrder && !productOrder) {
    return (
      <CustomerLayout currentPage="orders">
        <div className="customer-page py-12 text-center space-y-3">
          <p className="text-sm font-semibold text-text-primary">Pesanan tidak ditemukan</p>
          <Link href="/customer/orders" className="text-xs text-primary font-semibold">
            ← Kembali ke Daftar Pesanan
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  // ==========================================
  // RENDER: CLEANING ORDER DETAIL
  // ==========================================
  if (cleaningOrder) {
    const employee = cleaningOrder.employeeId
      ? employees.find((e) => e.id === cleaningOrder.employeeId)
      : null;

    const cleaningSteps: CleaningOrderStatus[] = [
      'searching_employee',
      'assigned',
      'on_the_way',
      'arrived',
      'in_service',
      'completed',
    ];

    const currentStepIndex = cleaningSteps.indexOf(cleaningOrder.status);

    const handleConfirmCancel = () => {
      if (!cancelReason) {
        alert('Silakan pilih alasan pembatalan.');
        return;
      }
      cancelCleaningOrder(cleaningOrder.id, cancelReason, 'customer');
      setShowCancelModal(false);
    };

    const handleSaveRating = () => {
      rateCleaningOrder(cleaningOrder.id, ratingScore, ratingComment);
      setShowRatingModal(false);
    };

    const handleUploadProof = () => {
      setUploadingProof(true);
      setTimeout(() => {
        setUploadingProof(false);
        setProofUploaded(true);
        confirmOrderPayment(
          cleaningOrder.id,
          'cleaning',
          '/images/services/svc1.jpg'
        );
      }, 1000);
    };

    const canCancel = ['searching_employee', 'assigned', 'on_the_way'].includes(
      cleaningOrder.status
    );

    return (
      <CustomerLayout currentPage="orders">
        <div className="customer-page space-y-4">
          {/* Top header */}
          <div className="flex items-center justify-between">
            <Link
              href="/customer/orders"
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-primary"
            >
              <ArrowLeft size={16} />
            </Link>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase">
              CLEANING ORDER
            </span>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              <FileText size={15} /> Invoice
            </button>
          </div>

          {/* Order Title & Status Banner */}
          <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-text-muted">
                  {cleaningOrder.invoiceNumber}
                </span>
                <h1 className="text-base font-bold text-text-primary mt-0.5">
                  {cleaningOrder.serviceName}
                </h1>
                <p className="text-xs text-text-secondary">
                  {cleaningOrder.propertyDetails.propertyType.toUpperCase()} • Luas {cleaningOrder.propertyDetails.buildingSize} m²
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  cleaningOrder.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : cleaningOrder.status === 'on_the_way'
                    ? 'bg-blue-100 text-blue-800 animate-pulse'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {getStatusLabel(cleaningOrder.status)}
              </span>
            </div>

            {/* Stepper Progression */}
            <div className="pt-2 border-t border-border">
              <div className="grid grid-cols-6 gap-1 text-center">
                {cleaningSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                          isDone
                            ? isCurrent
                              ? 'bg-primary text-white ring-2 ring-primary/30'
                              : 'bg-emerald-500 text-white'
                            : 'bg-canvas-alt text-text-muted'
                        }`}
                      >
                        {isDone && !isCurrent ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-[9px] mt-1 line-clamp-1 ${
                          isCurrent ? 'font-bold text-primary' : 'text-text-muted'
                        }`}
                      >
                        {step === 'searching_employee'
                          ? 'Cari'
                          : step === 'assigned'
                          ? 'Dapat'
                          : step === 'on_the_way'
                          ? 'Jalan'
                          : step === 'arrived'
                          ? 'Tiba'
                          : step === 'in_service'
                          ? 'Kerja'
                          : 'Selesai'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LIVE TRACKING SCREEN (PRD Section 32, 33, 34) */}
          {cleaningOrder.status === 'on_the_way' && (
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-blue-300 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Live Tracking Posisi Karyawan
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  ETA ~{cleaningOrder.liveLocation?.etaMinutes || 12} Menit
                </span>
              </div>

              {/* Simulated Map Visual */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-800 border border-blue-200 flex flex-col justify-between p-3 text-white">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Animated Path SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-400 stroke-[3] stroke-dasharray-[6]">
                  <path d="M 40 120 Q 140 40 260 50" fill="none" />
                </svg>

                {/* Employee Pin */}
                <div className="absolute left-[35px] top-[105px] flex items-center gap-1.5 animate-bounce">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    🛵
                  </div>
                  <span className="text-[10px] bg-slate-900/90 px-1.5 py-0.5 rounded font-bold">
                    {employee?.name?.split(' ')[0]}
                  </span>
                </div>

                {/* Customer Pin */}
                <div className="absolute right-[40px] top-[40px] flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    📍
                  </div>
                  <span className="text-[10px] bg-slate-900/90 px-1.5 py-0.5 rounded font-bold">
                    Lokasi Anda
                  </span>
                </div>

                <div className="relative z-10 text-[10px] bg-slate-950/70 p-2 rounded-lg backdrop-blur-sm self-start">
                  <p className="font-semibold text-cyan-300">
                    {employee?.name} sedang menuju lokasi Anda
                  </p>
                  <p className="text-slate-300 text-[9px] mt-0.5">
                    Live GPS interval diperbarui setiap 10 detik
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Employee Card (PRD Section 80) */}
          {employee ? (
            <div className="bg-white p-4 rounded-2xl border border-border flex items-center gap-3">
              <img
                src={employee.photo}
                alt={employee.name}
                className="w-13 h-13 rounded-full object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-text-primary truncate">
                    {employee.name}
                  </h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                    Cleaning Partner
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <Star size={11} className="text-warning fill-warning" />
                    <strong>{employee.rating}</strong>
                  </span>
                  <span>•</span>
                  <span>{employee.totalJobs} order selesai</span>
                </div>
                <p className="text-[10px] text-text-muted mt-1 truncate">
                  Skill: {employee.skills.join(', ')}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <span>Sistem sedang mencari partner cleaning terdekat di sekitar lokasi Anda...</span>
            </div>
          )}

          {/* Before & After Cleaning Photos (PRD Section 37 & 40) */}
          <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Bukti Dokumentasi Pekerjaan
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border rounded-xl p-2.5 text-center bg-canvas">
                <span className="text-[11px] font-bold text-text-primary block mb-1.5">
                  Foto Before (Kondisi Awal)
                </span>
                {cleaningOrder.beforePhotos.length > 0 ? (
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={cleaningOrder.beforePhotos[0]}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg bg-canvas-alt border border-dashed border-border flex items-center justify-center text-[10px] text-text-muted">
                    Menunggu upload partner
                  </div>
                )}
              </div>

              <div className="border border-border rounded-xl p-2.5 text-center bg-canvas">
                <span className="text-[11px] font-bold text-text-primary block mb-1.5">
                  Foto After (Hasil Bersih)
                </span>
                {cleaningOrder.afterPhotos.length > 0 ? (
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={cleaningOrder.afterPhotos[0]}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg bg-canvas-alt border border-dashed border-border flex items-center justify-center text-[10px] text-text-muted">
                    Setelah pembersihan selesai
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Cleaning Checklist Progress (PRD Section 39) */}
          {cleaningOrder.checklist && cleaningOrder.checklist.length > 0 && (
            <section className="bg-white p-4 rounded-2xl border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Checklist Pekerjaan Cleaning
                </h3>
                <span className="text-[10px] font-bold text-primary">
                  {cleaningOrder.checklist.filter((c) => c.completed).length} /{' '}
                  {cleaningOrder.checklist.length} Selesai
                </span>
              </div>

              <div className="space-y-1.5">
                {cleaningOrder.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-canvas text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        item.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border border-border bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <span
                      className={`${
                        item.completed ? 'line-through text-text-muted' : 'text-text-primary'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Direct Payment Details (PRD Section 44 - 50) */}
          <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Pembayaran Langsung ke Karyawan
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cleaningOrder.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {cleaningOrder.paymentStatus === 'paid' ? 'LUNAS (PAID)' : 'BELUM BAYAR'}
              </span>
            </div>

            {cleaningOrder.paymentMethod === 'cash' && (
              <div className="p-3 rounded-xl bg-canvas border border-border text-xs text-text-secondary leading-relaxed">
                💵 <strong>Metode Tunai (Cash):</strong> Silakan siapkan uang pas sebesar{' '}
                <strong className="text-primary font-bold">
                  {formatCurrency(cleaningOrder.priceBreakdown.total)}
                </strong>{' '}
                dan serahkan langsung kepada {employee?.name || 'karyawan'} saat pekerjaan selesai.
              </div>
            )}

            {cleaningOrder.paymentMethod === 'qris' && employee && (
              <div className="p-3.5 rounded-xl bg-canvas border border-border text-center space-y-2">
                <p className="text-xs font-semibold text-text-primary">
                  Scan QRIS Langsung Milik {employee.paymentProfile?.qrisMerchantName || employee.name}
                </p>
                <div className="w-40 h-40 mx-auto rounded-xl border-2 border-border overflow-hidden bg-white p-2">
                  <img
                    src={employee.paymentProfile?.qrisImageUrl || '/images/bundles/bundle1.jpg'}
                    alt="QRIS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-text-muted">
                  Total Transfer: <strong className="text-primary font-bold">{formatCurrency(cleaningOrder.priceBreakdown.total)}</strong>
                </p>
              </div>
            )}

            {cleaningOrder.paymentMethod === 'transfer' && employee && (
              <div className="p-3 rounded-xl bg-canvas border border-border space-y-2 text-xs">
                <p className="font-semibold text-text-primary">
                  Transfer ke Rekening Bank Karyawan:
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-border">
                  <p className="text-text-muted text-[10px]">Bank Tujuan</p>
                  <p className="font-bold text-text-primary">
                    {employee.paymentProfile?.bankName} - {employee.paymentProfile?.bankAccountNumber}
                  </p>
                  <p className="text-text-secondary text-[11px]">
                    a/n {employee.paymentProfile?.bankAccountName}
                  </p>
                </div>
                <p className="text-[11px] text-text-muted">
                  Nominal Pas: <strong className="text-primary font-bold">{formatCurrency(cleaningOrder.priceBreakdown.total)}</strong>
                </p>
              </div>
            )}

            {/* Proof of Payment Upload or Gateway Button */}
            {cleaningOrder.paymentStatus !== 'paid' && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentGateway(true)}
                  className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Buka Payment Gateway (Direct to Mitra)
                </button>
                <button
                  type="button"
                  onClick={handleUploadProof}
                  disabled={uploadingProof || proofUploaded}
                  className="w-full py-2 px-4 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload size={14} />
                  {uploadingProof
                    ? 'Mengunggah Bukti Bayar...'
                    : proofUploaded
                    ? 'Bukti Pembayaran Terkirim'
                    : 'Kirim Bukti Pembayaran Manual'}
                </button>
              </div>
            )}
          </section>

          {/* Completed Rating Prompt */}
          {cleaningOrder.status === 'completed' && !cleaningOrder.rating && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl text-center space-y-2">
              <h3 className="font-bold text-xs text-text-primary">
                Bagaimana hasil pembersihan {employee?.name}?
              </h3>
              <p className="text-[11px] text-text-secondary">
                Bantu partner kami menjaga kualitas layanan terbaik.
              </p>
              <button
                type="button"
                onClick={() => setShowRatingModal(true)}
                className="py-2 px-5 bg-accent text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-colors shadow-sm"
              >
                Beri Rating &amp; Review
              </button>
            </div>
          )}

          {/* Cancellation button if eligible */}
          {canCancel && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="text-xs text-danger hover:underline font-semibold"
              >
                Batalkan Pesanan Ini
              </button>
            </div>
          )}

          {/* CANCELLATION MODAL */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
                <h3 className="font-bold text-sm text-text-primary">
                  Batalkan Pesanan Cleaning?
                </h3>
                {cleaningOrder.status === 'on_the_way' && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    ⚠️ <strong>Perhatian:</strong> Partner sedang menuju lokasi Anda. Apakah Anda yakin ingin membatalkan?
                  </p>
                )}
                <div>
                  <label className="text-xs text-text-secondary font-medium block mb-1">
                    Pilih Alasan Pembatalan:
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full bg-canvas-alt p-2 rounded-lg border border-border text-xs focus:outline-none"
                  >
                    <option value="">-- Pilih Alasan --</option>
                    <option value="Ingin ganti jadwal pembersihan">Ingin ganti jadwal pembersihan</option>
                    <option value="Salah input luas bangunan">Salah input luas bangunan</option>
                    <option value="Kebutuhan mendadak berubah">Kebutuhan mendadak berubah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl border border-border text-text-secondary hover:bg-canvas"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-danger text-white hover:bg-rose-700"
                  >
                    Ya, Batalkan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RATING MODAL */}
          {showRatingModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
                <h3 className="font-bold text-sm text-text-primary text-center">
                  Beri Rating Layanan
                </h3>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          star <= ratingScore
                            ? 'text-warning fill-warning'
                            : 'text-border'
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Ceritakan pengalaman kepuasan Anda..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full bg-canvas-alt p-2.5 rounded-xl border border-border text-xs focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl border border-border"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRating}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-primary text-white"
                  >
                    Simpan Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OFFICIAL INVOICE MODAL (PRD Section 52 & 53) */}
          {showInvoiceModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold font-serif text-text-primary">
                      Official Invoice
                    </h2>
                    <span className="font-mono text-xs text-text-muted">
                      {cleaningOrder.invoiceNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="w-7 h-7 rounded-full bg-canvas-alt flex items-center justify-center text-text-secondary"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="text-xs space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <p className="text-text-muted">Customer:</p>
                      <p className="font-bold text-text-primary">{cleaningOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Tanggal Order:</p>
                      <p className="font-bold text-text-primary">{formatDate(cleaningOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Assigned Employee:</p>
                      <p className="font-bold text-text-primary">{employee?.name || 'Partner Cleaning'}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Metode Bayar:</p>
                      <p className="font-bold text-text-primary uppercase">{cleaningOrder.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-3 space-y-1.5 bg-canvas">
                    <p className="font-bold text-text-primary mb-1">Rincian Item Cleaning:</p>
                    <div className="flex justify-between">
                      <span>{cleaningOrder.serviceName} ({cleaningOrder.propertyDetails.buildingSize} m²)</span>
                      <span className="font-medium">{formatCurrency(cleaningOrder.priceBreakdown.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Jarak Operasional</span>
                      <span className="font-medium">{formatCurrency(cleaningOrder.priceBreakdown.distanceFee)}</span>
                    </div>
                    {cleaningOrder.priceBreakdown.addonsTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Layanan Tambahan (Add-ons)</span>
                        <span className="font-medium">{formatCurrency(cleaningOrder.priceBreakdown.addonsTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Biaya Sistem Aplikasi</span>
                      <span className="font-medium">{formatCurrency(cleaningOrder.priceBreakdown.serviceFee)}</span>
                    </div>
                    {cleaningOrder.priceBreakdown.discount > 0 && (
                      <div className="flex justify-between text-rose-700 font-semibold">
                        <span>Diskon Promo</span>
                        <span>-{formatCurrency(cleaningOrder.priceBreakdown.discount)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border flex justify-between font-bold text-sm">
                      <span>Total Tagihan:</span>
                      <span className="text-primary">{formatCurrency(cleaningOrder.priceBreakdown.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                  >
                    Cetak / Simpan PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Gateway Modal (Direct to Mitra) */}
          <PaymentGatewayModal
            isOpen={showPaymentGateway}
            onClose={() => setShowPaymentGateway(false)}
            onSuccess={() => {
              setShowPaymentGateway(false);
              confirmOrderPayment(
                cleaningOrder.id,
                'cleaning',
                '/images/services/svc1.jpg'
              );
            }}
            amount={cleaningOrder.priceBreakdown.total}
            invoiceNumber={cleaningOrder.invoiceNumber}
            orderTitle={`${cleaningOrder.serviceName} (${cleaningOrder.propertyDetails.buildingSize} m²)`}
            context="cleaning_direct"
            recipientName={employee?.name || 'Budi Santoso'}
            recipientBank={employee?.paymentProfile?.bankName || 'BCA'}
            recipientAccount={employee?.paymentProfile?.bankAccountNumber || '5210984421'}
            qrisMerchantName={employee?.paymentProfile?.qrisMerchantName || `${employee?.name || 'MITRA'} CLEANING`}
          />
        </div>
      </CustomerLayout>
    );
  }

  // ==========================================
  // RENDER: PRODUCT ORDER DETAIL (E-Commerce)
  // ==========================================
  return (
    <CustomerLayout currentPage="orders">
      <div className="customer-page space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/customer/orders"
            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-primary"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
            PRODUCT ORDER
          </span>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline"
          >
            <FileText size={15} /> Invoice
          </button>
        </div>

        {/* Product Order Header Card */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-text-muted">
                {productOrder?.invoiceNumber}
              </span>
              <h1 className="text-base font-bold text-text-primary mt-0.5">
                Pesanan Produk Nail Art
              </h1>
              <p className="text-xs text-text-secondary">
                {productOrder?.items.length} Macam Barang
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
              {getStatusLabel(productOrder?.status || '')}
            </span>
          </div>

          {/* Courier & Tracking (PRD Section 71) */}
          <div className="p-3 bg-canvas-alt rounded-xl border border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-accent" />
              <div>
                <p className="font-bold text-text-primary">{productOrder?.courierName}</p>
                <p className="text-[11px] text-text-muted font-mono mt-0.5">
                  No. Resi: {productOrder?.trackingNumber || 'Dalam Persiapan'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Pengiriman
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Rincian Produk
          </h3>
          <div className="divide-y divide-border">
            {productOrder?.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center gap-3 first:pt-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-text-primary truncate">
                    {item.productName}
                  </h4>
                  {item.variantName && (
                    <span className="text-[10px] text-text-muted block">
                      Varian: {item.variantName}
                    </span>
                  )}
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-text-muted">x{item.quantity}</span>
                    <span className="font-bold text-text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border space-y-1.5 text-xs">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal Produk</span>
              <span>{formatCurrency(productOrder?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Ongkos Kirim</span>
              <span>{formatCurrency(productOrder?.shippingCost || 0)}</span>
            </div>
            {(productOrder?.discount || 0) > 0 && (
              <div className="flex justify-between text-rose-700 font-semibold">
                <span>Diskon</span>
                <span>-{formatCurrency(productOrder?.discount || 0)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-text-primary">
              <span>Total Tagihan:</span>
              <span className="text-accent">{formatCurrency(productOrder?.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Alamat Penerima
          </h3>
          <div className="flex items-start gap-2 text-xs">
            <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-text-primary">
                {productOrder?.address.recipientName} ({productOrder?.address.phone})
              </p>
              <p className="text-text-secondary mt-0.5">{productOrder?.address.detail}</p>
            </div>
          </div>
        </div>

        {/* Invoice Modal for Product */}
        {showInvoiceModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-base font-bold font-serif text-text-primary">
                    Product Invoice
                  </h2>
                  <span className="font-mono text-xs text-text-muted">
                    {productOrder?.invoiceNumber}
                  </span>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="w-7 h-7 rounded-full bg-canvas-alt flex items-center justify-center text-text-secondary"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-text-muted">Penerima:</p>
                    <p className="font-bold">{productOrder?.customerName}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Kurir:</p>
                    <p className="font-bold">{productOrder?.courierName}</p>
                  </div>
                </div>

                <div className="border border-border rounded-xl p-3 space-y-1.5 bg-canvas">
                  {productOrder?.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.productName} (x{i.quantity})</span>
                      <span className="font-medium">{formatCurrency(i.price * i.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span>{formatCurrency(productOrder?.shippingCost || 0)}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between font-bold text-sm">
                    <span>Total:</span>
                    <span className="text-accent">{formatCurrency(productOrder?.total || 0)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Cetak / Simpan PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
