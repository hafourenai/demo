'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, MapPin, Search, Star, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { SectionHeader } from '@/components/common';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Promo, Product, Service } from '@/lib/types';

const CAROUSEL_INTERVAL = 6000;

const PROMO_COLORS = [
  'bg-primary',
  'bg-accent',
  'bg-success',
];

const CATEGORY_COLORS = [
  'bg-primary',
  'bg-accent',
  'bg-primary-dark',
];

type Slide =
  | { kind: 'promo'; id: string; promo: Promo; color: string }
  | { kind: 'product'; id: string; product: Product }
  | { kind: 'service'; id: string; service: Service };

const promoSubtitle = (promo: Promo) =>
  promo.minTransaction
    ? `Min. transaksi ${formatCurrency(promo.minTransaction)}`
    : promo.name;

function Carousel({
  count,
  renderSlide,
  className = '',
  dotColor = 'bg-primary',
}: {
  count: number;
  renderSlide: (index: number) => React.ReactNode;
  className?: string;
  dotColor?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    if (paused || isDragging || count <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % count), CAROUSEL_INTERVAL);
    return () => clearInterval(id);
  }, [paused, isDragging, count]);

  useEffect(() => {
    setIndex((p) => (count ? p % count : 0));
  }, [count]);

  const go = (dir: 'left' | 'right') =>
    setIndex((p) => (dir === 'left' ? (p + 1) % count : (p - 1 + count) % count));

  return (
    <div
      className={`select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        startX.current = e.clientX;
        dragged.current = false;
        setIsDragging(true);
        setDragOffset(0);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 10) dragged.current = true;
        setDragOffset(dx);
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - startX.current;
        if (dx < -40) go('left');
        else if (dx > 40) go('right');
        setIsDragging(false);
        setDragOffset(0);
      }}
      onPointerCancel={() => {
        setIsDragging(false);
        setDragOffset(0);
      }}
      onClickCapture={(e) => {
        if (dragged.current) {
          e.preventDefault();
          e.stopPropagation();
          dragged.current = false;
        }
      }}
    >
      {/* Sliding track */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.35s ease',
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="min-w-full flex-shrink-0">
              {renderSlide(i)}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? `w-6 ${dotColor}` : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  const { currentUser, services, products, bundles, promos, orders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const customer = currentUser as any;

  const activeOrders = orders.filter(
    (o) =>
      o.customerId === customer?.id &&
      !['completed', 'cancelled_customer', 'cancelled_admin'].includes(o.status)
  );

  const activePromos = useMemo(() => promos.filter((p) => p.isActive), [promos]);

  const bestSellerProducts = useMemo(
    () => products.filter((p) => p.isBestSeller),
    [products]
  );

  const topServices = useMemo(
    () => [...services].sort((a, b) => b.rating - a.rating),
    [services]
  );

  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    services.forEach((s) => map.set(s.category, (map.get(s.category) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [services]);

  // One carousel that merges promos + best-seller products + top services
  const slides: Slide[] = useMemo(
    () => [
      ...activePromos.slice(0, 3).map((promo, i) => ({
        kind: 'promo' as const,
        id: `promo-${promo.id}`,
        promo,
        color: PROMO_COLORS[i % PROMO_COLORS.length],
      })),
      ...bestSellerProducts.slice(0, 2).map((product) => ({
        kind: 'product' as const,
        id: `prod-${product.id}`,
        product,
      })),
      ...topServices.slice(0, 3).map((service) => ({
        kind: 'service' as const,
        id: `svc-${service.id}`,
        service,
      })),
    ],
    [activePromos, bestSellerProducts, topServices]
  );

  return (
    <CustomerLayout currentPage="home">
      <div className="pb-8">
        {/* Header with Premium Design */}
        <div className="bg-primary text-white px-5 py-6 shadow-md">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-serif font-bold">Selamat pagi, {customer?.name?.split(' ')[0]}</h2>
              <div className="flex items-center gap-1 text-sm mt-2 opacity-90">
                <MapPin size={16} />
                <span>Bogor</span>
              </div>
            </div>
            <button className="p-2 bg-white/25 hover:bg-white/35 rounded-md transition-colors duration-base" aria-label="Notifications">
              <Bell size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-none z-10" size={20} />
            <input
              type="text"
              placeholder="Cari layanan atau produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-md bg-white/25 text-white placeholder-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur-sm transition-all duration-base"
            />
          </div>
        </div>

        {/* Active Order Banner */}
        {activeOrders.length > 0 && (
          <Link href={`/customer/orders/${activeOrders[0].id}`}>
            <div className="bg-success text-white px-5 py-4 shadow-md hover:shadow-lg transition-shadow duration-base">
              <h3 className="font-semibold mb-1">Order Aktif</h3>
              <p className="text-sm opacity-90">Klik untuk lihat status real-time</p>
            </div>
          </Link>
        )}

        {/* Merged Carousel: Diskon + Terlaris (produk & layanan) */}
        {slides.length > 0 && (
          <section className="px-4 mt-5">
            <SectionHeader title="Promo & Terlaris" />
            <Carousel
              count={slides.length}
              renderSlide={(i) => {
                const slide = slides[i];

                if (slide.kind === 'promo') {
                  const { promo, color } = slide;
                  return (
                    <div className="bg-card rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-base">
                      <div className={`${color} h-48 flex flex-col items-center justify-center text-white`}>
                        <span className="text-5xl font-extrabold leading-none">
                          {promo.type === 'percentage'
                            ? `${promo.value}%`
                            : formatCurrency(promo.value).replace('Rp', 'Rp ')}
                        </span>
                        <span className="text-sm font-semibold mt-2 tracking-wide uppercase opacity-90">
                          {promo.type === 'percentage' ? 'Discount' : 'Potongan'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif font-semibold text-text-primary text-lg">{promo.name}</h4>
                        <p className="text-text-secondary text-sm mt-1">
                          Kode:{' '}
                          <span className="font-bold text-primary">{promo.code}</span>
                        </p>
                        <p className="text-xs text-text-muted mt-1">{promoSubtitle(promo)}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {promo.applicableTo.map((t) => (
                            <span
                              key={t}
                              className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (slide.kind === 'product') {
                  const product = slide.product;
                  return (
                    <Link href={`/customer/products/${product.id}`} draggable={false}>
                      <div className="bg-card rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-base">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            draggable={false}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full font-bold text-xs">
                            Terlaris
                          </div>
                          {product.promoPrice && (
                            <div className="absolute top-4 right-4 bg-danger text-white px-3 py-1 rounded-full font-bold text-sm">
                              Promo
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif font-semibold text-text-primary text-lg">{product.name}</h4>
                          <p className="text-text-secondary text-sm mt-1 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-warning fill-warning" />
                              <span className="font-semibold text-text-primary">{product.rating}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {product.promoPrice ? (
                                <>
                                  <span className="text-primary font-bold text-lg">
                                    {formatCurrency(product.promoPrice)}
                                  </span>
                                  <span className="text-text-muted line-through text-sm">
                                    {formatCurrency(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-primary font-bold text-lg">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }

                const service = slide.service;
                return (
                  <Link href={`/customer/services/${service.id}`} draggable={false}>
                    <div className="bg-card rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-base">
                      <div className="relative overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          draggable={false}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full font-bold text-xs">
                          Terlaris
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif font-semibold text-text-primary text-lg">{service.name}</h4>
                        <p className="text-text-secondary text-sm mt-1 line-clamp-2">{service.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-warning fill-warning" />
                            <span className="font-semibold text-text-primary">{service.rating}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-bold text-lg">{formatCurrency(service.price)}</p>
                            <p className="text-xs text-text-muted">{service.duration} menit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }}
            />
          </section>
        )}

        {/* Overview Layanan Tersedia (3 cards) */}
        {categoryStats.length > 0 && (
          <section className="px-4 mt-8">
            <SectionHeader title="Layanan Tersedia" href="/customer/services" />
            <div className="grid grid-cols-3 gap-3">
              {categoryStats.map((cat, i) => (
                <Link key={cat.name} href="/customer/services">
                  <div
                    className={`${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} text-white rounded-md p-3 h-full shadow-md hover:shadow-lg transition-shadow duration-base flex flex-col justify-between`}
                  >
                    <p className="text-2xl font-bold leading-none">{cat.count}</p>
                    <div className="mt-3">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">{cat.name}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">layanan</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bundle Section */}
        {bundles.length > 0 && (
          <section className="px-4 mt-8">
            <SectionHeader title="Bundle Spesial" />
            <div className="space-y-3">
              {bundles.slice(0, 2).map((bundle) => (
                <Link key={bundle.id} href={`/customer/bundles/${bundle.id}`}>
                  <div className="bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-base">
                    <div className="flex gap-3 p-3">
                      <img
                        src={bundle.image}
                        alt={bundle.name}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-serif font-semibold text-text-primary text-sm">{bundle.name}</h4>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-1">{bundle.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-bold text-sm">
                            {formatCurrency(bundle.bundlePrice)}
                          </span>
                          <span className="text-text-muted line-through text-xs">
                            {formatCurrency(bundle.normalPrice)}
                          </span>
                          <span className="bg-success/10 text-success text-xs font-bold px-2 py-0.5 rounded-full">
                            -{bundle.discount}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Layanan Terpopuler List (3 items) */}
        {topServices.length > 0 && (
          <section className="px-4 mt-8">
            <SectionHeader title="Layanan Terpopuler" href="/customer/services" />
            <div className="space-y-3">
              {topServices.slice(0, 3).map((service) => (
                <Link key={service.id} href={`/customer/services/${service.id}`}>
                  <div className="bg-card rounded-md shadow-sm hover:shadow-md transition-shadow duration-base overflow-hidden border border-border">
                    <div className="flex gap-3 p-3">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif font-semibold text-text-primary text-sm">{service.name}</h4>
                          <span className="badge badge-primary text-xs flex-shrink-0">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{service.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-warning fill-warning" />
                            <span className="text-xs font-semibold text-text-primary">{service.rating}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-bold text-sm">
                              {formatCurrency(service.price)}
                            </p>
                            <p className="text-[10px] text-text-muted">{service.duration} menit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                href="/customer/services"
                className="flex items-center justify-center gap-1 text-primary text-sm font-semibold py-2 hover:text-primary-dark transition-colors duration-base"
              >
                Lihat semua layanan <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}
