'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, LogOut } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { useRouter } from 'next/navigation';

export default function EmployeeAccountPage() {
  const router = useRouter();
  const { currentUser, employees, updateEmployeePaymentProfile, logout } = useAppStore();

  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0];

  const [bankName, setBankName] = useState(employee.paymentProfile?.bankName || 'BCA');
  const [bankAccountNumber, setBankAccountNumber] = useState(
    employee.paymentProfile?.bankAccountNumber || ''
  );
  const [bankAccountName, setBankAccountName] = useState(
    employee.paymentProfile?.bankAccountName || employee.name
  );
  const [qrisMerchantName, setQrisMerchantName] = useState(
    employee.paymentProfile?.qrisMerchantName || `${employee.name} QRIS`
  );

  const [editingPayment, setEditingPayment] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePaymentProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeePaymentProfile(employee.id, {
      bankName,
      bankAccountNumber,
      bankAccountName,
      qrisMerchantName,
    });
    setEditingPayment(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <EmployeeLayout currentPage="account">
      <div className="customer-page space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-900 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={employee.photo}
              alt={employee.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/60 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-serif font-bold truncate">{employee.name}</h1>
              <p className="text-xs text-white/80">{employee.specialization || 'Home Cleaning Specialist'}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  ★ {employee.rating}
                </span>
                <span className="text-white/80">• {employee.totalJobs} order selesai</span>
              </div>
            </div>
          </div>
        </div>

        {saveToast && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Data pembayaran diajukan ke admin untuk verifikasi keamanan.
          </div>
        )}

        {/* Payment Account Profile (PRD Section 45 & 46) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Rekening Bank &amp; QRIS Pembayaran
              </h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                employee.paymentProfile?.isVerified
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {employee.paymentProfile?.isVerified ? 'VERIFIED' : 'PENDING REVIEW'}
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Data ini akan ditampilkan kepada customer saat melakukan pembayaran langsung (Direct Payment) untuk layanan cleaning yang Anda kerjakan.
          </p>

          {editingPayment ? (
            <form onSubmit={handleSavePaymentProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                  Nama Bank:
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-canvas-alt p-2 rounded-xl border border-border"
                >
                  <option value="BCA">Bank Central Asia (BCA)</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                  <option value="BNI">Bank Negara Indonesia (BNI)</option>
                  <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                  Nomor Rekening:
                </label>
                <input
                  required
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full bg-canvas-alt p-2 rounded-xl border border-border font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                  Nama Pemilik Rekening (Sesuai Buku Tabungan):
                </label>
                <input
                  required
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full bg-canvas-alt p-2 rounded-xl border border-border font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                  Nama Merchant QRIS:
                </label>
                <input
                  required
                  type="text"
                  value={qrisMerchantName}
                  onChange={(e) => setQrisMerchantName(e.target.value)}
                  className="w-full bg-canvas-alt p-2 rounded-xl border border-border"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingPayment(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-border"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="bg-canvas p-3 rounded-xl border border-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Bank:</span>
                  <strong className="text-text-primary">{employee.paymentProfile?.bankName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">No. Rekening:</span>
                  <strong className="font-mono text-text-primary">{employee.paymentProfile?.bankAccountNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Atas Nama:</span>
                  <strong className="text-text-primary">{employee.paymentProfile?.bankAccountName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">QRIS Merchant:</span>
                  <strong className="text-text-primary">{employee.paymentProfile?.qrisMerchantName}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingPayment(true)}
                className="w-full py-2 bg-canvas-alt border border-border rounded-xl text-xs font-semibold text-text-primary hover:bg-border-light transition-colors"
              >
                Ubah Rekening / QRIS
              </button>
            </div>
          )}
        </section>

        {/* Skills & Competencies (PRD Section 13) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Keahlian Cleaning (Skill)
          </h2>
          <p className="text-xs text-text-secondary">
            Order yang dapat Anda ambil disesuaikan dengan kompetensi yang diverifikasi administrator.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {employee.skills?.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact info & Switch Demo */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-2 text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Informasi Kontak
          </h2>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-text-muted">Email:</span>
            <span className="font-medium text-text-primary">{employee.email}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-text-muted">No. Handphone:</span>
            <span className="font-medium text-text-primary">{employee.phone}</span>
          </div>
        </section>

        <button
          type="button"
          onClick={() => {
            logout();
            router.replace('/demo');
          }}
          className="w-full py-3 bg-red-50 text-danger border border-red-200 rounded-2xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
        >
          <LogOut size={15} /> Keluar / Ganti Akun Demo
        </button>
      </div>
    </EmployeeLayout>
  );
}
