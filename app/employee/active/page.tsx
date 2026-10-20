'use client';

import { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  Navigation,
  Camera,
  AlertCircle,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';

export default function ActiveJobPage() {
  const {
    currentUser,
    cleaningOrders,
    employees,
    startOrderTrip,
    arriveAtLocation,
    uploadBeforePhotos,
    startService,
    toggleChecklist,
    uploadAfterPhotos,
    completeService,
    confirmOrderPayment,
  } = useAppStore();

  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0];

  const activeOrder = cleaningOrders.find(
    (o) =>
      o.employeeId === employee?.id &&
      ['assigned', 'on_the_way', 'arrived', 'in_service'].includes(o.status)
  );

  const simulatedBeforePhoto = '/images/services/svc3.jpg';
  const simulatedAfterPhoto = '/images/services/svc1.jpg';
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  if (!activeOrder) {
    return (
      <EmployeeLayout currentPage="active">
        <div className="customer-page py-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-base font-bold text-text-primary">Tidak Ada Pekerjaan Aktif</h2>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Anda sedang tidak memiliki order cleaning yang berjalan. Silakan cek order baru yang tersedia.
          </p>
          <Link
            href="/employee/available"
            className="inline-block py-2 px-5 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            Lihat Order Tersedia
          </Link>
        </div>
      </EmployeeLayout>
    );
  }

  // Lifecycle action handlers
  const handleStartTrip = () => {
    startOrderTrip(activeOrder.id);
    setSuccessToast('Perjalanan dimulai! Live tracking lokasi aktif untuk customer.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleArrive = () => {
    arriveAtLocation(activeOrder.id);
    setSuccessToast('Status diperbarui: Anda telah tiba di lokasi customer.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleUploadBefore = () => {
    uploadBeforePhotos(activeOrder.id, [simulatedBeforePhoto]);
    setSuccessToast('Foto kondisi awal (Before) berhasil diunggah.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleStartService = () => {
    setErrorMessage('');
    const res = startService(activeOrder.id);
    if (!res.success) {
      setErrorMessage(res.message || 'Gagal memulai pekerjaan.');
    } else {
      setSuccessToast('Pekerjaan pembersihan dimulai. Selamat bekerja!');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleUploadAfter = () => {
    uploadAfterPhotos(activeOrder.id, [simulatedAfterPhoto]);
    setSuccessToast('Foto hasil akhir (After) berhasil diunggah.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCompleteService = () => {
    setErrorMessage('');
    const res = completeService(activeOrder.id);
    if (!res.success) {
      setErrorMessage(res.message || 'Gagal menyelesaikan pekerjaan.');
    } else {
      setSuccessToast('Pekerjaan selesai! Pendapatan 100% bruto berhasil tercatat.');
      setTimeout(() => setSuccessToast(''), 3500);
    }
  };

  const handleConfirmPaymentReceived = () => {
    confirmOrderPayment(activeOrder.id, 'cleaning');
    setSuccessToast('Pembayaran customer dikonfirmasi LUNAS (PAID).');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <EmployeeLayout currentPage="active">
      <div className="customer-page space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-text-muted">
              {activeOrder.invoiceNumber}
            </span>
            <h1 className="text-lg font-serif font-bold text-text-primary">
              {activeOrder.serviceName}
            </h1>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              activeOrder.status === 'on_the_way'
                ? 'bg-blue-100 text-blue-800 animate-pulse'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {getStatusLabel(activeOrder.status)}
          </span>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> {successToast}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-danger text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        {/* Step-by-Step Operator Action Panel (PRD Section 33, 36, 37, 38, 40, 41) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-primary/30 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles size={14} /> Kontrol Status Operasional Karyawan
          </h2>

          {/* STEP 1: ASSIGNED -> MULAI PERJALANAN */}
          {activeOrder.status === 'assigned' && (
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">
                Order telah Anda ambil. Tekan tombol di bawah saat Anda siap berangkat menuju alamat customer.
              </p>
              <button
                type="button"
                onClick={handleStartTrip}
                className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Navigation size={15} /> Mulai Perjalanan (Start Trip)
              </button>
            </div>
          )}

          {/* STEP 2: ON_THE_WAY -> SAYA SUDAH TIBA */}
          {activeOrder.status === 'on_the_way' && (
            <div className="space-y-2">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>🛵 Live GPS aktif &amp; terlacak customer</span>
                <span className="font-bold">ETA ~{activeOrder.liveLocation?.etaMinutes} Mnt</span>
              </div>
              <button
                type="button"
                onClick={handleArrive}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MapPin size={15} /> Saya Sudah Tiba di Lokasi
              </button>
            </div>
          )}

          {/* STEP 3: ARRIVED -> UPLOAD BEFORE & MULAI PEKERJAAN */}
          {activeOrder.status === 'arrived' && (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">
                Anda telah tiba. Wajib foto kondisi awal ruangan (Before) sebelum menekan Mulai Pekerjaan.
              </p>

              {activeOrder.beforePhotos.length > 0 ? (
                <div className="flex items-center gap-3 bg-canvas p-2.5 rounded-xl border border-border">
                  <img
                    src={activeOrder.beforePhotos[0]}
                    alt="Before"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="text-xs">
                    <span className="text-emerald-700 font-bold block">✓ Foto Before Tersedia</span>
                    <span className="text-text-muted text-[11px]">Siap memulai pengerjaan</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUploadBefore}
                  className="w-full py-2.5 px-3 bg-canvas-alt border border-dashed border-border rounded-xl text-xs font-semibold text-text-primary hover:bg-border-light flex items-center justify-center gap-2"
                >
                  <Camera size={16} /> Ambil / Upload Foto Before (Wajib)
                </button>
              )}

              <button
                type="button"
                onClick={handleStartService}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Mulai Pekerjaan Cleaning
              </button>
            </div>
          )}

          {/* STEP 4: IN_SERVICE -> CHECKLIST, UPLOAD AFTER & SELESAI */}
          {activeOrder.status === 'in_service' && (
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">
                Pembersihan sedang berlangsung. Selesaikan checklist dan unggah foto hasil akhir (After).
              </p>

              {activeOrder.afterPhotos.length > 0 ? (
                <div className="flex items-center gap-3 bg-canvas p-2.5 rounded-xl border border-border">
                  <img
                    src={activeOrder.afterPhotos[0]}
                    alt="After"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="text-xs">
                    <span className="text-emerald-700 font-bold block">✓ Foto After Tersedia</span>
                    <span className="text-text-muted text-[11px]">Siap menyelesaikan pekerjaan</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUploadAfter}
                  className="w-full py-2.5 px-3 bg-canvas-alt border border-dashed border-border rounded-xl text-xs font-semibold text-text-primary hover:bg-border-light flex items-center justify-center gap-2"
                >
                  <Camera size={16} /> Ambil / Upload Foto After (Wajib)
                </button>
              )}

              <button
                type="button"
                onClick={handleCompleteService}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Selesaikan Pekerjaan Ini
              </button>
            </div>
          )}
        </div>

        {/* Cleaning Checklist (PRD Section 39) */}
        {activeOrder.checklist && activeOrder.checklist.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Checklist Pekerjaan
              </h3>
              <span className="text-[10px] text-text-muted">Centang saat selesai</span>
            </div>

            <div className="space-y-1.5">
              {activeOrder.checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(activeOrder.id, item.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    item.completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-canvas border-border text-text-primary'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      item.completed
                        ? 'bg-emerald-600 text-white'
                        : 'border border-border bg-white'
                    }`}
                  >
                    {item.completed && '✓'}
                  </div>
                  <span className={`text-xs ${item.completed ? 'line-through opacity-80' : ''}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customer Location & Property Info */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Info Customer &amp; Alamat
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-text-primary">
                  {activeOrder.customerName || 'Customer'}
                </p>
                <p className="text-text-secondary mt-0.5">{activeOrder.address.detail}</p>
                {activeOrder.address.notes && (
                  <p className="text-[11px] text-text-muted mt-1">
                    Catatan: {activeOrder.address.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-canvas rounded-xl border border-border grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-text-muted block">Luas Rumah:</span>
                <strong className="text-text-primary">{activeOrder.propertyDetails.buildingSize} m²</strong>
              </div>
              <div>
                <span className="text-text-muted block">Jumlah Lantai:</span>
                <strong className="text-text-primary">{activeOrder.propertyDetails.floors} Lantai</strong>
              </div>
              <div>
                <span className="text-text-muted block">Kamar Tidur:</span>
                <strong className="text-text-primary">{activeOrder.propertyDetails.bedrooms} Kamar</strong>
              </div>
              <div>
                <span className="text-text-muted block">Kamar Mandi:</span>
                <strong className="text-text-primary">{activeOrder.propertyDetails.bathrooms} Mandi</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Payment Confirmation (PRD Section 47, 48, 49) */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Status Pembayaran Customer
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeOrder.paymentStatus === 'paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {activeOrder.paymentStatus === 'paid' ? 'LUNAS (PAID)' : 'BELUM DIBAYAR'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs bg-canvas p-3 rounded-xl border border-border">
            <div>
              <span className="text-text-muted block">Metode Pembayaran:</span>
              <strong className="text-text-primary uppercase">{activeOrder.paymentMethod}</strong>
            </div>
            <div className="text-right">
              <span className="text-text-muted block">Total Hak Terima (100%):</span>
              <strong className="text-base font-bold text-emerald-600">
                {formatCurrency(activeOrder.priceBreakdown.total)}
              </strong>
            </div>
          </div>

          {activeOrder.paymentStatus !== 'paid' && (
            <button
              type="button"
              onClick={handleConfirmPaymentReceived}
              className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <DollarSign size={15} /> Konfirmasi Pembayaran Diterima
            </button>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
}
