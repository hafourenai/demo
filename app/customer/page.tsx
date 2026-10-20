'use client';

import { useState } from 'react';
import {
  MapPin,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { ServiceImage } from '@/components/ServiceImage';
import { PromoCarousel } from '@/components/PromoCarousel';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CustomerDashboard() {
  const {
    currentUser,
    customers,
    cleaningServices,
    nailArtProducts,
    employees,
    promos,
  } = useAppStore();

  const [addressId, setAddressId] = useState('');
  const customer = customers.find((c) => c.id === currentUser?.id);
  const addresses = customer?.addresses || [];
  const selectedAddress =
    addresses.find((a) => a.id === addressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];

  const slides = [
    ...promos
      .filter((p) => p.isActive)
      .map((promo, i) => (
        <Link
          key={promo.id}
          href={promo.applicableTo.includes('cleaning') ? '/customer/services' : '/customer/products'}
          draggable={false}
          className={`home-banner ${i % 2 ? 'home-banner-alt' : ''}`}
        >
          <div className="relative z-10 max-w-[80%]">
            <p className="text-xs font-semibold tracking-wide mb-2 text-primary uppercase">
              {promo.applicableTo.includes('cleaning') ? 'Promo Home Cleaning' : 'Promo Nail Art'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {promo.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm opacity-85">
              Gunakan kode voucher: <strong className="font-mono bg-white/30 px-1.5 py-0.5 rounded">{promo.code}</strong>
            </p>
            <span className="inline-flex items-center gap-1.5 mt-4 text-xs sm:text-sm font-semibold">
              Klaim Sekarang <ArrowRight size={15} />
            </span>
          </div>
          <span className="banner-discount">
            {promo.type === 'percentage' ? `${promo.value}%` : formatCurrency(promo.value)}
          </span>
        </Link>
      )),
  ];

  return (
    <CustomerLayout currentPage="home">
      <div className="customer-page space-y-6">
        {/* Top Header & Address */}
        <header className="home-heading">
          <div>
            <p className="text-xs text-text-secondary font-medium mb-0.5">
              Halo, {currentUser?.name?.split(' ')[0] || 'Pelanggan'} 👋
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
              Rumah Bersih, Kuku Cantik.
            </h1>
          </div>
          <div className="address-selector">
            <MapPin size={16} className="shrink-0 text-primary" />
            {addresses.length ? (
              <select
                aria-label="Alamat layanan"
                value={selectedAddress?.id || ''}
                onChange={(e) => setAddressId(e.target.value)}
                className="text-xs text-text-primary bg-transparent font-medium"
              >
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label.toUpperCase()}: {a.detail.substring(0, 32)}...
                  </option>
                ))}
              </select>
            ) : (
              <Link href="/customer/account" className="text-xs font-medium text-primary">
                + Tambah Alamat
              </Link>
            )}
          </div>
        </header>

        {/* 2 Primary Action Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/customer/services"
            className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 border border-pink-200/60 shadow-sm hover:shadow transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mb-2 shadow-sm">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-sm text-text-primary">Home Cleaning</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Hitung harga m² &amp; pesan on-demand
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
              Pesan Sekarang <ChevronRight size={14} />
            </div>
          </Link>

          <Link
            href="/customer/products"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60 shadow-sm hover:shadow transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center mb-2 shadow-sm">
                <ShoppingBag size={20} />
              </div>
              <h3 className="font-bold text-sm text-text-primary">Belanja Nail Art</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Press-on nails, gel polish &amp; stiker kuku
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent-light text-amber-800 group-hover:translate-x-0.5 transition-transform">
              Buka Katalog <ChevronRight size={14} />
            </div>
          </Link>
        </div>

        {/* Promo Carousel */}
        {slides.length > 0 && <PromoCarousel slides={slides} />}

        {/* Featured Home Cleaning Services */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary font-serif">
                Layanan Home Cleaning
              </h2>
              <p className="text-xs text-text-secondary">
                Dikerjakan profesional dengan foto bukti Before &amp; After
              </p>
            </div>
            <Link
              href="/customer/services"
              className="text-xs font-semibold text-primary flex items-center gap-0.5"
            >
              Semua <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {cleaningServices.slice(0, 4).map((service) => (
              <Link
                key={service.id}
                href={`/customer/services?serviceId=${service.id}`}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ServiceImage
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  {service.popularityBadge && (
                    <span className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                      {service.popularityBadge}
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-xs leading-snug text-text-primary">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-1">
                    <span className="flex items-center gap-0.5">
                      <Star size={11} className="text-warning fill-warning" />
                      {service.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={11} /> {service.duration} mnt
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-[10px] text-text-muted">Mulai dari</span>
                    <span className="font-bold text-primary">{formatCurrency(100000)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Nail Art Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary font-serif">
                Produk Nail Art Populer
              </h2>
              <p className="text-xs text-text-secondary">
                Koleksi press-on nails &amp; aksesoris cantik
              </p>
            </div>
            <Link
              href="/customer/products"
              className="text-xs font-semibold text-primary flex items-center gap-0.5"
            >
              Katalog <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nailArtProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/customer/products/${product.id}`}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-canvas-alt">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Best Seller
                    </span>
                  )}
                  {product.promoPrice && (
                    <span className="absolute bottom-2 right-2 bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      PROMO
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-xs leading-snug text-text-primary line-clamp-2 mt-0.5">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      {product.promoPrice ? (
                        <>
                          <span className="text-[10px] text-text-muted line-through block">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="font-bold text-xs text-danger">
                            {formatCurrency(product.promoPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-xs text-text-primary">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                      Stok: {product.stock}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cleaning Specialist Partners */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary font-serif">
                Cleaning Specialist Terverifikasi
              </h2>
              <p className="text-xs text-text-secondary">
                Partner berpengalaman dengan rating tinggi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-card p-3 rounded-2xl border border-border flex items-center gap-3"
              >
                <img
                  src={emp.photo}
                  alt={emp.name}
                  className="w-11 h-11 rounded-full object-cover border border-border flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-xs text-text-primary truncate">
                    {emp.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-text-secondary mt-0.5">
                    <Star size={11} className="text-warning fill-warning" />
                    <span className="font-medium">{emp.rating}</span>
                    <span className="text-text-muted">({emp.totalJobs} order)</span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 mt-1">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}
