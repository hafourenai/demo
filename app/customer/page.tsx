'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Bell, MapPin, Star, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { SectionHeader } from '@/components/common';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Promo, Product, Service } from '@/lib/types';

const CAROUSEL_INTERVAL = 6000;
const CAROUSEL_TRANSITION_MS = 350;

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
  // `pos` is the position inside the extended track:
  //   0            → a clone of the last slide (for seamless swiping backwards)
  //   1 .. count   → the real slides
  //   count + 1    → a clone of the first slide (for seamless wrapping forwards)
  const multi = count > 1;
  const [pos, setPos] = useState(() => (multi ? 1 : 0));
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const offset = useRef(0);
  const dragging = useRef(false);
  const axis = useRef<'x' | 'y' | null>(null);
  const dragged = useRef(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Set the initial track position synchronously on mount so the leading clone
  // is never visible for a frame before the first effect runs.
  const setTrackRef = useCallback(
    (el: HTMLDivElement | null) => {
      trackRef.current = el;
      if (el && el.dataset.ready !== '1') {
        el.dataset.ready = '1';
        el.style.transition = 'none';
        el.style.transform = `translateX(calc(-${(multi ? 1 : 0) * 100}% + 0px))`;
      }
    },
    [multi]
  );

  const activeIndex = count > 0 ? ((pos - 1) % count + count) % count : 0;

  // Slide order rendered in the track, including the two clones.
  const items = useMemo(() => {
    if (count <= 0) return [];
    if (count === 1) return [0];
    return [count - 1, ...Array.from({ length: count }, (_, i) => i), 0];
  }, [count]);

  const applyTransform = useCallback((p: number, dx: number, withTransition: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = withTransition
      ? `transform ${CAROUSEL_TRANSITION_MS}ms ease`
      : 'none';
    el.style.transform = `translateX(calc(-${p * 100}% + ${dx}px))`;
  }, []);

  // Keep the track in sync with the committed position. This deliberately does
  // not run while dragging, so an in-progress drag never gets reset.
  useEffect(() => {
    applyTransform(pos, 0, animate);
  }, [pos, animate, applyTransform, count]);

  // Pause-on-hover only where a real pointer can hover. On touch devices the
  // emulated mouseenter never gets a mouseleave, which used to leave the
  // carousel permanently "paused" (stuck after the user touched a slide).
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setHoverCapable(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Restart the auto-advance timer whenever the slide or interaction state
  // changes, so it never fires immediately after a manual swipe.
  useEffect(() => {
    if (!multi || paused) return;
    const id = setInterval(() => {
      if (dragging.current) return;
      setPos((p) => Math.min(p + 1, count + 1));
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(id);
  }, [multi, paused, pos, count]);

  // Reset to the first real slide when the slide set changes.
  useEffect(() => {
    setPos(multi ? 1 : 0);
  }, [count, multi]);

  // Seamless loop: when a cloned edge slide is showing, silently snap to the
  // matching real slide. Without this the track would blur backwards across
  // every slide when wrapping from the last slide to the first.
  useEffect(() => {
    if (!multi || (pos !== 0 && pos !== count + 1)) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setPos(pos === count + 1 ? 1 : count);
    }, CAROUSEL_TRANSITION_MS + 60);
    return () => clearTimeout(id);
  }, [pos, count, multi]);

  // Re-enable the transition after a silent snap (wait for the browser to
  // paint the new position first).
  useEffect(() => {
    if (animate) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const endDrag = () => {
    dragging.current = false;
    axis.current = null;
    offset.current = 0;
  };

  const step = (dir: 1 | -1) =>
    setPos((p) => Math.max(0, Math.min(p + dir, count + 1)));

  return (
    <div className={`select-none ${className}`}>
      <div
        className="overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onMouseEnter={() => {
          if (hoverCapable) setPaused(true);
        }}
        onMouseLeave={() => {
          if (hoverCapable) setPaused(false);
        }}
        onPointerDown={(e) => {
          if (!multi) return;
          dragging.current = true;
          axis.current = null;
          dragged.current = false;
          offset.current = 0;
          startX.current = e.clientX;
          startY.current = e.clientY;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const dx = e.clientX - startX.current;
          const dy = e.clientY - startY.current;
          if (axis.current === null) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          }
          // Let the page scroll vertically instead of fighting the carousel.
          if (axis.current === 'y') {
            endDrag();
            return;
          }
          if (Math.abs(dx) > 8) dragged.current = true;
          offset.current = dx;
          applyTransform(pos, dx, false);
        }}
        onPointerUp={() => {
          if (!dragging.current) return;
          const dx = offset.current;
          endDrag();
          if (dx < -40) step(1);
          else if (dx > 40) step(-1);
          else applyTransform(pos, 0, true);
        }}
        onPointerCancel={() => {
          if (!dragging.current) return;
          endDrag();
          applyTransform(pos, 0, true);
        }}
        onClickCapture={(e) => {
          // A swipe should not also trigger the slide's link.
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
            dragged.current = false;
          }
        }}
      >
        {/* Sliding track */}
        <div
          ref={setTrackRef}
          className="flex"
          style={{ willChange: 'transform' }}
        >
          {items.map((slideIndex, p) => {
            const isClone = multi && (p === 0 || p === count + 1);
            return (
              <div
                key={p}
                className="min-w-full flex-shrink-0"
                aria-hidden={isClone || undefined}
              >
                {renderSlide(slideIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {multi && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (i === activeIndex) return;
                // Jump instantly instead of blurring through every slide.
                setAnimate(false);
                setPos(i + 1);
              }}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? `w-6 ${dotColor}` : 'w-1.5 bg-text-muted/30'
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
            <input
              type="text"
              placeholder="Cari layanan atau produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-md bg-card text-text-primary placeholder-text-muted border border-white focus:outline-none focus:ring-2 focus:ring-white/70 transition-all duration-base"
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
