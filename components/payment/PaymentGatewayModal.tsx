'use client';

import { useState, useEffect } from 'react';
import {
  QrCode,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export type PaymentContext = 'cleaning_direct' | 'product_ecommerce' | 'employee_settlement';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentInfo: {
    channel: string;
    reference: string;
    paidAt: string;
    amount: number;
  }) => void;
  amount: number;
  invoiceNumber: string;
  orderTitle: string;
  context: PaymentContext;
  recipientName?: string;
  recipientBank?: string;
  recipientAccount?: string;
  qrisMerchantName?: string;
}

export function PaymentGatewayModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  invoiceNumber,
  orderTitle,
  context,
  recipientName = 'Clean & Nail Escrow',
  recipientBank = 'BCA',
  recipientAccount = '8801928371',
  qrisMerchantName = 'CLEAN & NAIL ID',
}: PaymentGatewayModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<'qris' | 'va' | 'ewallet' | 'cash'>('qris');
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'Mandiri' | 'BRI' | 'BNI'>('BCA');
  const [selectedEwallet, setSelectedEwallet] = useState<'GoPay' | 'OVO' | 'ShopeePay'>('GoPay');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown

  // Countdown simulation
  useEffect(() => {
    if (!isOpen || paymentStatus !== 'pending') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentStatus]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('pending');
      setTimeLeft(900);
      setCopied(false);
      if (context === 'cleaning_direct') {
        setSelectedChannel('qris');
      }
    }
  }, [isOpen, context]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumber =
    context === 'cleaning_direct'
      ? recipientAccount
      : `827708${invoiceNumber.replace(/[^0-9]/g, '').slice(-8) || '91827364'}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = (status: 'success' | 'failed') => {
    setPaymentStatus('processing');
    setTimeout(() => {
      if (status === 'success') {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess({
            channel: selectedChannel.toUpperCase(),
            reference: `PAY-SIM-${Date.now()}`,
            paidAt: new Date().toISOString(),
            amount,
          });
        }, 1200);
      } else {
        setPaymentStatus('failed');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col text-slate-800 border border-slate-100">
        {/* Gateway Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-400">
              <ShieldCheck size={14} /> Secure Payment Gateway Simulator
            </div>
            <h2 className="text-base font-bold mt-0.5">{orderTitle}</h2>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Inv: {invoiceNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Amount & Timer Box */}
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Pembayaran</span>
            <span className="text-lg font-bold text-slate-900 font-sans">{formatCurrency(amount)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1 justify-end">
              <Clock size={11} /> Batas Waktu
            </span>
            <span className="text-xs font-bold text-rose-600 font-mono bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg inline-block mt-0.5">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Context Banner */}
        <div className="px-5 pt-3">
          {context === 'cleaning_direct' && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles size={13} className="text-emerald-700" /> 100% Gross Langsung ke Mitra
              </div>
              <p className="text-emerald-800 leading-tight">
                Pembayaran ini disalurkan langsung ke rekening / QRIS milik teknisi{' '}
                <strong>{recipientName}</strong>.
              </p>
            </div>
          )}
          {context === 'product_ecommerce' && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={13} className="text-amber-700" /> Escrow Resmi Clean &amp; Nail
              </div>
              <p className="text-amber-800 leading-tight">
                Dana ditampung aman oleh sistem hingga pesanan produk Nail Art dikirimkan oleh kurir.
              </p>
            </div>
          )}
          {context === 'employee_settlement' && (
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={13} className="text-blue-700" /> Setoran Komisi Bulanan Platform (3%)
              </div>
              <p className="text-blue-800 leading-tight">
                Pembayaran setoran wajib karyawan ditransfer langsung ke rekening kas resmi perusahaan PT.
              </p>
            </div>
          )}
        </div>

        {/* Payment Channels Tabs */}
        {paymentStatus === 'pending' && (
          <div className="p-5 overflow-y-auto space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedChannel('qris')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  selectedChannel === 'qris'
                    ? 'bg-white shadow-sm text-pink-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode size={14} /> QRIS
              </button>
              <button
                type="button"
                onClick={() => setSelectedChannel('va')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  selectedChannel === 'va'
                    ? 'bg-white shadow-sm text-pink-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard size={14} /> Transfer VA
              </button>
              {context !== 'cleaning_direct' && (
                <button
                  type="button"
                  onClick={() => setSelectedChannel('ewallet')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'ewallet'
                      ? 'bg-white shadow-sm text-pink-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wallet size={14} /> E-Wallet
                </button>
              )}
            </div>

            {/* TAB CONTENT: QRIS */}
            {selectedChannel === 'qris' && (
              <div className="space-y-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    QRIS Standar Pembayaran Nasional
                  </span>
                  <div className="w-48 h-48 bg-white border-2 border-slate-900 p-2 rounded-2xl shadow-sm flex items-center justify-center relative overflow-hidden">
                    {/* Stylized QR simulation */}
                    <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white relative">
                      <div className="grid grid-cols-6 gap-1 p-2 w-full h-full opacity-90">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-sm ${
                              (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                                ? 'bg-white'
                                : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md uppercase">
                          {context === 'cleaning_direct' ? 'Mitra QRIS' : 'Official QRIS'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-2">
                    {context === 'cleaning_direct' ? recipientName : qrisMerchantName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">NMID: ID1029384756182</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dapat di-scan menggunakan BCA Mobile, GoPay, OVO, Dana, ShopeePay, atau m-Banking apapun.
                </p>
              </div>
            )}

            {/* TAB CONTENT: VIRTUAL ACCOUNT / BANK TRANSFER */}
            {selectedChannel === 'va' && (
              <div className="space-y-3">
                {context !== 'cleaning_direct' && (
                  <div className="grid grid-cols-4 gap-2">
                    {(['BCA', 'Mandiri', 'BRI', 'BNI'] as const).map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedBank === bank
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {context === 'cleaning_direct' ? 'Nomor Rekening Mitra:' : `Nomor Virtual Account ${selectedBank}:`}
                    </span>
                    <span className="font-bold text-slate-900">
                      {context === 'cleaning_direct' ? recipientBank : selectedBank}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-sm text-slate-900 tracking-wider">
                      {vaNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(vaNumber)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Atas Nama Penerima:</span>
                    <strong className="text-slate-800">{recipientName}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Masuk ke m-Banking atau ATM pilihan Anda.</p>
                  <p>• Pilih menu Transfer / Pembayaran Virtual Account.</p>
                  <p>• Masukkan nomor di atas dan nominal akan otomatis sesuai tagihan.</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: E-WALLET */}
            {selectedChannel === 'ewallet' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {(['GoPay', 'OVO', 'ShopeePay'] as const).map((ew) => (
                    <button
                      key={ew}
                      type="button"
                      onClick={() => setSelectedEwallet(ew)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedEwallet === ew
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {ew}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                  <span className="text-xs text-slate-600 block">
                    Konfirmasi pembayaran langsung melalui aplikasi <strong>{selectedEwallet}</strong>
                  </span>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800">
                    Notifikasi push akan dikirim ke nomor HP akun Anda
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROCESSING SIMULATION STATE */}
        {paymentStatus === 'processing' && (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Menghubungkan ke Gateway...</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sedang memverifikasi saldo dan transaksi transfer secara real-time.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS SIMULATION STATE */}
        {paymentStatus === 'success' && (
          <div className="p-8 text-center space-y-3 my-auto animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="font-bold text-base text-emerald-800">Pembayaran Berhasil!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Transaksi senilai <strong>{formatCurrency(amount)}</strong> telah terkonfirmasi lunas.
              </p>
            </div>
          </div>
        )}

        {/* FAILED SIMULATION STATE */}
        {paymentStatus === 'failed' && (
          <div className="p-8 text-center space-y-3 my-auto animate-fadeIn">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={32} />
            </div>
            <div>
              <h3 className="font-bold text-base text-rose-800">Pembayaran Ditolak</h3>
              <p className="text-xs text-slate-500 mt-1">
                Simulasi pembayaran gagal atau batas waktu transfer telah habis.
              </p>
            </div>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Interactive Simulation Action Bar */}
        {paymentStatus === 'pending' && (
          <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-semibold">Simulasi Callback Gateway:</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-pink-400 font-mono">Demo Mode</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSimulatePayment('failed')}
                className="flex-1 py-2.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/50 rounded-xl text-xs font-bold transition-all"
              >
                Simulasi Gagal
              </button>
              <button
                type="button"
                onClick={() => handleSimulatePayment('success')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <CheckCircle2 size={14} /> Simulasi Bayar Berhasil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
