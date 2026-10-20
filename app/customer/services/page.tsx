'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency, calculateCleaningPrice, generateId, generateInvoiceNumber } from '@/lib/utils';
import { CleaningPropertyDetails, PaymentMethod, CleaningOrder } from '@/lib/types';
import Link from 'next/link';
import { PaymentGatewayModal } from '@/components/payment/PaymentGatewayModal';
import { seedCustomers } from '@/lib/seed';

function CleaningBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentUser,
    customers,
    cleaningServices,
    cleaningAddons,
    pricingRule,
    promos,
    createCleaningOrder,
    login,
  } = useAppStore();

  const customer = customers.find((c) => c.id === currentUser?.id) || customers[0] || seedCustomers[0];
  const addresses = (customer?.addresses && customer.addresses.length > 0) ? customer.addresses : seedCustomers[0].addresses;

  // Auto-login fallback for demo testing if currentUser is null
  useEffect(() => {
    if (!currentUser && customer) {
      login(customer);
    }
  }, [currentUser, customer, login]);

  // 1. Service Selection
  const initialServiceId = searchParams.get('serviceId') || cleaningServices[0]?.id || 'cln-gen';
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);

  useEffect(() => {
    const sId = searchParams.get('serviceId');
    if (sId) setSelectedServiceId(sId);
  }, [searchParams]);

  const selectedService =
    cleaningServices.find((s) => s.id === selectedServiceId) || cleaningServices[0];

  // 2. Property Information (PRD Section 14)
  const [propertyType, setPropertyType] = useState<'rumah' | 'apartemen' | 'kos' | 'kantor'>('rumah');
  const [buildingSize, setBuildingSize] = useState<number>(75);
  const [floors, setFloors] = useState<number>(1);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);

  // 3. Address & Distance
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses.find((a) => a.isDefault)?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // Simulated distance from company operational hub to customer address
  const simulatedDistanceKm = useMemo(() => {
    if (!activeAddress) return 4.5;
    // Calculate a consistent distance based on address id
    const hash = activeAddress.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 2.5 + (hash % 80) / 10; // e.g. 2.5 to 10.5 km
  }, [activeAddress]);

  // 4. Add-ons Selection (PRD Section 19)
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});

  const toggleAddon = (addonId: string, delta: number) => {
    setSelectedAddons((prev) => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: next };
    });
  };

  // 5. Booking Schedule (PRD Section 22)
  const [bookingType, setBookingType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');

  // 6. Promo Code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('BERSIH20');
  const [promoError, setPromoError] = useState<string>('');

  const activePromo = promos.find(
    (p) =>
      p.code.toUpperCase() === appliedPromoCode.toUpperCase() &&
      p.isActive &&
      p.applicableTo.includes('cleaning')
  );

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCode.trim()) return;
    const found = promos.find(
      (p) =>
        p.code.toUpperCase() === promoCode.trim().toUpperCase() &&
        p.isActive &&
        p.applicableTo.includes('cleaning')
    );
    if (found) {
      setAppliedPromoCode(found.code);
      setPromoCode('');
    } else {
      setPromoError('Kode promo tidak valid atau tidak berlaku untuk cleaning.');
    }
  };

  // 7. Payment Method (PRD Section 44: Direct to Employee)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  // Pricing Engine Computation (PRD Section 15-20)
  const formattedAddons = useMemo(() => {
    return Object.entries(selectedAddons).map(([id, qty]) => {
      const addon = cleaningAddons.find((a) => a.id === id);
      return {
        id,
        name: addon?.name || 'Add-on',
        price: addon?.price || 0,
        quantity: qty,
      };
    });
  }, [selectedAddons, cleaningAddons]);

  const priceCalc = useMemo(() => {
    return calculateCleaningPrice(
      buildingSize,
      simulatedDistanceKm,
      formattedAddons,
      pricingRule,
      activePromo
    );
  }, [buildingSize, simulatedDistanceKm, formattedAddons, pricingRule, activePromo]);

  // Order Submission & Payment Gateway Simulator
  const [submitting, setSubmitting] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CleaningOrder | null>(null);

  const handleSubmitOrder = () => {
    const activeUser = currentUser || customer;
    if (!activeUser) {
      router.push('/login');
      return;
    }

    const targetAddress = activeAddress || addresses[0];
    if (!targetAddress) {
      alert('Silakan tambahkan alamat terlebih dahulu.');
      router.push('/customer/account');
      return;
    }

    const propertyDetails: CleaningPropertyDetails = {
      propertyType,
      buildingSize: Number(buildingSize),
      floors: Number(floors),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
    };

    const newOrder: CleaningOrder = {
      orderType: 'cleaning' as const,
      id: generateId(),
      invoiceNumber: generateInvoiceNumber('CLN'),
      customerId: activeUser.id,
      customerName: activeUser.name,
      customerPhone: activeUser.phone,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      propertyDetails,
      address: targetAddress,
      distanceKm: simulatedDistanceKm,
      addons: formattedAddons,
      priceBreakdown: {
        basePrice: priceCalc.basePrice,
        distanceFee: priceCalc.distanceFee,
        addonsTotal: priceCalc.addonsTotal,
        serviceFee: priceCalc.serviceFee,
        discount: priceCalc.discount,
        total: priceCalc.total,
      },
      status: 'searching_employee' as const,
      bookingType,
      scheduledDate: bookingType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: bookingType === 'scheduled' ? scheduledTime : undefined,
      paymentMethod,
      paymentStatus: 'unpaid' as const,
      beforePhotos: [],
      afterPhotos: [],
      checklist: (selectedService.checklistTemplate || []).map((label, idx) => ({
        id: `chk-${idx}`,
        label,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPendingOrder(newOrder);

    // If cash on arrival, create directly
    if (paymentMethod === 'cash') {
      createCleaningOrder(newOrder);
      router.push(`/customer/orders/${newOrder.id}`);
      return;
    }

    // Direct-to-mitra payment gateway
    setShowGateway(true);
  };

  const handleGatewaySuccess = () => {
    setShowGateway(false);
    if (!pendingOrder) return;

    setSubmitting(true);
    const finalizedOrder: CleaningOrder = {
      ...pendingOrder,
      paymentStatus: 'paid',
    };

    createCleaningOrder(finalizedOrder);

    setTimeout(() => {
      setSubmitting(false);
      router.push(`/customer/orders/${finalizedOrder.id}`);
    }, 400);
  };

  return (
    <div className="customer-page space-y-6">
        {/* Banner / Header */}
        <div className="bg-gradient-to-r from-primary to-rose-700 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
            <Sparkles size={15} /> Layanan Home Cleaning Profesional
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold">
            Pesan Layanan &amp; Hitung Biaya
          </h1>
          <p className="text-xs text-white/80 mt-1 max-w-md">
            Biaya dihitung transparan berdasarkan ukuran luas rumah (m²), jarak radius, dan pilihan add-on.
          </p>
        </div>

        {/* STEP 1: Pilih Layanan Cleaning (PRD Section 12) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            Pilih Jenis Layanan Cleaning
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {cleaningServices.map((service) => {
              const isSelected = service.id === selectedService.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                      : 'border-border hover:border-border-primary bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-semibold text-text-muted">
                        {service.category}
                      </span>
                      {isSelected && <CheckCircle2 size={16} className="text-primary" />}
                    </div>
                    <h3 className="font-bold text-xs text-text-primary leading-tight">
                      {service.name}
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-primary flex items-center gap-1">
                    <Clock size={11} /> Est. {service.duration} mnt
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 2: Informasi Properti (PRD Section 14) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            Informasi Properti &amp; Ukuran Luas
          </h2>

          {/* Property Type */}
          <div>
            <label className="text-xs text-text-secondary font-medium block mb-1.5">
              Tipe Properti:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['rumah', 'apartemen', 'kos', 'kantor'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`py-2 px-1 text-xs rounded-lg font-semibold capitalize border transition-all text-center ${
                    propertyType === type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-canvas-alt text-text-secondary border-border hover:bg-border-light'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Building Size (m²) Slider & Input */}
          <div className="bg-canvas-alt p-3.5 rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="sizeInput" className="text-xs font-semibold text-text-primary">
                Luas Bangunan (m²):
              </label>
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-border">
                <input
                  id="sizeInput"
                  type="number"
                  min="10"
                  max="500"
                  value={buildingSize}
                  onChange={(e) => setBuildingSize(Math.max(1, Number(e.target.value)))}
                  className="w-14 text-right font-bold text-sm text-primary focus:outline-none"
                />
                <span className="text-xs font-medium text-text-secondary">m²</span>
              </div>
            </div>

            <input
              type="range"
              min="20"
              max="250"
              step="5"
              value={buildingSize}
              onChange={(e) => setBuildingSize(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-text-muted">
              <span>≤ 50 m² (100rb)</span>
              <span>100 m² (175rb)</span>
              <span>150 m² (250rb)</span>
              <span>200 m² (325rb)</span>
              <span>&gt; 200 m²</span>
            </div>
          </div>

          {/* Rooms, Floors, Bathrooms counters */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-canvas border border-border text-center">
              <span className="text-[10px] text-text-muted block">Jumlah Lantai</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setFloors(Math.max(1, floors - 1))}
                  className="w-6 h-6 rounded-full bg-white border border-border text-text-primary text-xs font-bold"
                >
                  -
                </button>
                <span className="font-bold text-xs">{floors}</span>
                <button
                  type="button"
                  onClick={() => setFloors(floors + 1)}
                  className="w-6 h-6 rounded-full bg-white border border-border text-text-primary text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas border border-border text-center">
              <span className="text-[10px] text-text-muted block">Kamar Tidur</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                  className="w-6 h-6 rounded-full bg-white border border-border text-text-primary text-xs font-bold"
                >
                  -
                </button>
                <span className="font-bold text-xs">{bedrooms}</span>
                <button
                  type="button"
                  onClick={() => setBedrooms(bedrooms + 1)}
                  className="w-6 h-6 rounded-full bg-white border border-border text-text-primary text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas border border-border text-center">
              <span className="text-[10px] text-text-muted block">Kamar Mandi</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                  className="w-6 h-6 rounded-full bg-white border border-border text-text-primary text-xs font-bold"
                >
                  -
                </button>
                <span className="font-bold text-xs">{bathrooms}</span>
                <button
                  type="button"
                  onClick={() => setBathrooms(bathrooms + 1)}
                  className="w-6 h-6 rounded-full bg-white border border-border text-text-primary text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: Alamat & Perhitungan Jarak (PRD Section 17 & 18) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Alamat Pembersihan &amp; Jarak
            </h2>
            <Link href="/customer/account" className="text-xs font-semibold text-primary">
              Kelola Alamat
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-xs text-amber-800 font-medium">Belum ada alamat tersimpan.</p>
              <Link
                href="/customer/account"
                className="inline-block mt-2 text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-semibold"
              >
                + Tambah Alamat Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = addr.id === activeAddress?.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-white hover:border-border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-primary flex-shrink-0" />
                        <span className="font-bold text-xs text-text-primary uppercase">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                            Utama
                          </span>
                        )}
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-primary" />}
                    </div>
                    <p className="text-xs text-text-secondary mt-1 pl-5">
                      {addr.detail}
                    </p>
                  </div>
                );
              })}

              <div className="bg-canvas-alt p-3 rounded-xl border border-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-text-muted">Estimasi Jarak Operasional:</span>
                  <p className="font-bold text-text-primary mt-0.5">
                    {simulatedDistanceKm.toFixed(1)} KM
                    <span className="text-[11px] text-text-muted font-normal ml-1">
                      ({pricingRule.freeDistanceKm} KM pertama gratis)
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-text-muted">Biaya Jarak:</span>
                  <p className="font-bold text-primary">
                    {priceCalc.distanceFee === 0 ? 'GRATIS' : formatCurrency(priceCalc.distanceFee)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* STEP 4: Layanan Tambahan / Add-ons (PRD Section 19) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              4
            </span>
            Add-on Layanan Tambahan (Opsional)
          </h2>

          <div className="space-y-2">
            {cleaningAddons.map((addon) => {
              const qty = selectedAddons[addon.id] || 0;
              return (
                <div
                  key={addon.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    qty > 0 ? 'border-primary bg-primary/5' : 'border-border bg-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <h3 className="font-semibold text-xs text-text-primary">{addon.name}</h3>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">
                      {addon.description}
                    </p>
                    <span className="text-xs font-bold text-primary mt-1 block">
                      +{formatCurrency(addon.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() => toggleAddon(addon.id, -1)}
                          className="w-5 h-5 rounded-full bg-canvas-alt text-text-primary text-xs flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs text-primary">{qty}</span>
                        <button
                          type="button"
                          onClick={() => toggleAddon(addon.id, 1)}
                          className="w-5 h-5 rounded-full bg-canvas-alt text-text-primary text-xs flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleAddon(addon.id, 1)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-canvas-alt text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        + Tambah
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 5: Waktu Pemesanan (PRD Section 22) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              5
            </span>
            Jadwal Pemesanan
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBookingType('now')}
              className={`p-3 rounded-xl border text-center transition-all ${
                bookingType === 'now'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-canvas-alt text-text-primary border-border hover:bg-border-light'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-center gap-1.5">
                <Sparkles size={14} /> Pesan Sekarang
              </div>
              <p className="text-[10px] mt-0.5 opacity-80">
                Pencarian karyawan langsung aktif
              </p>
            </button>

            <button
              type="button"
              onClick={() => setBookingType('scheduled')}
              className={`p-3 rounded-xl border text-center transition-all ${
                bookingType === 'scheduled'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-canvas-alt text-text-primary border-border hover:bg-border-light'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-center gap-1.5">
                <Calendar size={14} /> Jadwalkan
              </div>
              <p className="text-[10px] mt-0.5 opacity-80">
                Pilih tanggal &amp; slot waktu
              </p>
            </button>
          </div>

          {bookingType === 'scheduled' && (
            <div className="bg-canvas-alt p-3.5 rounded-xl border border-border space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                  Tanggal Pembersihan:
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-white p-2.5 rounded-lg border border-border text-xs text-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-secondary block mb-1">
                  Slot Waktu Kedatangan:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setScheduledTime(time)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border ${
                        scheduledTime === time
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-text-primary border-border hover:bg-canvas'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* STEP 6: Metode Pembayaran (PRD Section 44: Langsung ke Employee) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              6
            </span>
            Metode Pembayaran (Langsung ke Karyawan)
          </h2>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Catatan Model Bisnis:</strong> Pembayaran 100% langsung diserahkan kepada partner cleaning yang bertugas (melalui QRIS, transfer bank, atau tunai saat selesai).
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'qris', label: 'QRIS Employee' },
                { id: 'transfer', label: 'Transfer Bank' },
                { id: 'cash', label: 'Tunai (Cash)' },
              ] as const
            ).map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                  paymentMethod === method.id
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-border bg-canvas-alt text-text-secondary hover:bg-border-light'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </section>

        {/* STEP 7: Promo Code & Pricing Breakdown (PRD Section 20) */}
        <section className="bg-white p-4 rounded-2xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                7
              </span>
              Rincian Biaya (Breakdown)
            </h2>
          </div>

          {/* Promo Input */}
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Punya voucher promo? (e.g. BERSIH20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-canvas-alt px-3 py-2 rounded-xl border border-border text-xs focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-text-primary text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
              >
                Gunakan
              </button>
            </div>
            {promoError && <p className="text-[11px] text-danger">{promoError}</p>}
            {activePromo && (
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Tag size={12} /> Voucher <strong>{activePromo.code}</strong> diterapkan ({activePromo.name})
              </p>
            )}
          </div>

          {/* Detailed Pricing Breakdown Table */}
          <div className="border border-border rounded-xl divide-y divide-border text-xs">
            <div className="p-2.5 flex items-center justify-between bg-canvas">
              <div>
                <span className="font-semibold text-text-primary">
                  Base Price Cleaning ({buildingSize} m²)
                </span>
                <p className="text-[10px] text-text-muted">Kategori {selectedService.name}</p>
              </div>
              <span className="font-medium text-text-primary">
                {formatCurrency(priceCalc.basePrice)}
              </span>
            </div>

            <div className="p-2.5 flex items-center justify-between bg-canvas">
              <div>
                <span className="font-semibold text-text-primary">
                  Biaya Jarak ({simulatedDistanceKm.toFixed(1)} KM)
                </span>
                <p className="text-[10px] text-text-muted">
                  {simulatedDistanceKm <= pricingRule.freeDistanceKm
                    ? 'Bebas biaya antar'
                    : `${Math.ceil(simulatedDistanceKm - pricingRule.freeDistanceKm)} KM x ${formatCurrency(pricingRule.pricePerKm)}`}
                </p>
              </div>
              <span className="font-medium text-text-primary">
                {priceCalc.distanceFee === 0 ? 'Rp 0' : formatCurrency(priceCalc.distanceFee)}
              </span>
            </div>

            {priceCalc.addonsTotal > 0 && (
              <div className="p-2.5 flex items-center justify-between bg-canvas">
                <div>
                  <span className="font-semibold text-text-primary">
                    Layanan Add-on ({formattedAddons.length} item)
                  </span>
                  <p className="text-[10px] text-text-muted">
                    {formattedAddons.map((a) => `${a.name} (x${a.quantity})`).join(', ')}
                  </p>
                </div>
                <span className="font-medium text-text-primary">
                  {formatCurrency(priceCalc.addonsTotal)}
                </span>
              </div>
            )}

            <div className="p-2.5 flex items-center justify-between bg-canvas">
              <span className="font-semibold text-text-primary">Biaya Layanan Sistem</span>
              <span className="font-medium text-text-primary">
                {formatCurrency(priceCalc.serviceFee)}
              </span>
            </div>

            {priceCalc.discount > 0 && (
              <div className="p-2.5 flex items-center justify-between bg-rose-50 text-rose-800">
                <span className="font-semibold">Potongan Diskon Promo</span>
                <span className="font-bold">-{formatCurrency(priceCalc.discount)}</span>
              </div>
            )}

            <div className="p-3 flex items-center justify-between bg-white text-sm font-bold">
              <span className="text-text-primary">Total Pembayaran</span>
              <span className="text-base text-primary font-bold">
                {formatCurrency(priceCalc.total)}
              </span>
            </div>
          </div>
        </section>

        {/* Checkout Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={submitting}
            className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {submitting ? (
              'Membuat Pesanan...'
            ) : (
              <>
                Konfirmasi &amp; Buat Pesanan ({formatCurrency(priceCalc.total)})
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>

        {/* Payment Gateway Simulator Modal (Direct to Mitra) */}
        {pendingOrder && (
          <PaymentGatewayModal
            isOpen={showGateway}
            onClose={() => setShowGateway(false)}
            onSuccess={handleGatewaySuccess}
            amount={pendingOrder.priceBreakdown.total}
            invoiceNumber={pendingOrder.invoiceNumber}
            orderTitle={`${pendingOrder.serviceName} (${pendingOrder.propertyDetails.buildingSize} m²)`}
            context="cleaning_direct"
            recipientName="Budi Santoso (Mitra Cleaning)"
            recipientBank="BCA"
            recipientAccount="5210984421"
            qrisMerchantName="BUDI SANTOSO CLEANING"
          />
        )}
      </div>
  );
}

export default function CleaningBookingPage() {
  return (
    <CustomerLayout currentPage="services">
      <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">Memuat layanan cleaning...</div>}>
        <CleaningBookingContent />
      </Suspense>
    </CustomerLayout>
  );
}
