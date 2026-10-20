'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Zap, Check, AlertCircle } from 'lucide-react';
import useAppStore from '@/lib/store';
import { EmployeeLayout } from '@/components/layouts/EmployeeLayout';
import { formatCurrency } from '@/lib/utils';

export default function AvailableOrdersPage() {
  const router = useRouter();
  const {
    currentUser,
    cleaningOrders,
    employees,
    claimCleaningOrder,
  } = useAppStore();

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const employee = employees.find((e) => e.id === currentUser?.id) || employees[0];

  // Eligible orders: status searching_employee & matching skill
  const availableOrders = cleaningOrders.filter((o) => {
    if (o.status !== 'searching_employee') return false;
    if (!employee?.skills || employee.skills.length === 0) return true;
    return employee.skills.includes(o.serviceName) || employee.skills.includes('General Cleaning');
  });

  const handleClaim = (orderId: string) => {
    setClaimingId(orderId);
    setAlertMessage(null);

    // Simulate atomic concurrency claim
    setTimeout(() => {
      const res = claimCleaningOrder(orderId, employee.id);
      setClaimingId(null);

      if (res.success) {
        setAlertMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          router.push('/employee/active');
        }, 800);
      } else {
        setAlertMessage({ type: 'error', text: res.message });
      }
    }, 600);
  };

  return (
    <EmployeeLayout currentPage="available">
      <div className="customer-page space-y-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-text-primary">
            Order Cleaning Tersedia
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Sistem distribusi realtime: First Valid Claim Wins (Siapa cepat dia dapat).
          </p>
        </div>

        {alertMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              alertMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {alertMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{alertMessage.text}</span>
          </div>
        )}

        {/* Counter Header */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary flex-shrink-0" />
            <p className="text-xs text-text-primary font-semibold">
              <strong className="text-primary">{availableOrders.length}</strong> order baru menunggu respon
            </p>
          </div>
          <span className="text-[10px] text-text-muted">Auto-refresh aktif</span>
        </div>

        {/* Available Order Cards (PRD Section 82) */}
        {availableOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-canvas-alt text-text-muted flex items-center justify-center mx-auto">
              <Zap size={22} />
            </div>
            <h3 className="font-bold text-xs text-text-primary">Belum Ada Order Baru</h3>
            <p className="text-[11px] text-text-secondary max-w-xs mx-auto">
              Saat customer memesan pembersihan rumah di area Anda, order akan langsung muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrders.map((order) => {
              const isClaiming = claimingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-border p-4 shadow-sm hover:border-primary transition-all space-y-3"
                >
                  {/* Top Line */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                          {order.invoiceNumber}
                        </span>
                        <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          {order.bookingType === 'now' ? 'Pesan Sekarang' : 'Terjadwal'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-text-primary">
                        {order.serviceName}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-text-muted block">Gross Earning (100%)</span>
                      <span className="text-sm font-bold text-emerald-600">
                        {formatCurrency(order.priceBreakdown.total)}
                      </span>
                    </div>
                  </div>

                  {/* Property Details Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-canvas p-2.5 rounded-xl border border-border text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted block">Ukuran Bangunan:</span>
                      <strong className="text-text-primary">
                        {order.propertyDetails.buildingSize} m² ({order.propertyDetails.propertyType})
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block">Kamar &amp; Mandi:</span>
                      <strong className="text-text-primary">
                        {order.propertyDetails.bedrooms} Kamar • {order.propertyDetails.bathrooms} Mandi
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block">Jarak Lokasi:</span>
                      <strong className="text-primary">{order.distanceKm} KM</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block">Metode Bayar:</span>
                      <strong className="text-text-primary uppercase">{order.paymentMethod}</strong>
                    </div>
                  </div>

                  {/* Addons if any */}
                  {order.addons.length > 0 && (
                    <div className="text-[11px] text-text-secondary bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <strong>Layanan Tambahan:</strong>{' '}
                      {order.addons.map((a) => `${a.name} (x${a.quantity})`).join(', ')}
                    </div>
                  )}

                  {/* Customer Address Preview */}
                  <div className="flex items-start gap-2 text-xs text-text-secondary">
                    <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-2">
                      <strong>{order.address.label.toUpperCase()}:</strong> {order.address.detail}
                    </p>
                  </div>

                  {/* Claim Button (PRD Section 28: First Valid Claim Wins) */}
                  <button
                    type="button"
                    onClick={() => handleClaim(order.id)}
                    disabled={isClaiming}
                    className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isClaiming ? (
                      'Mengunci Order...'
                    ) : (
                      <>
                        <Zap size={15} /> AMBIL ORDER SEKARANG
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
