'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Bell, MapPin, Star, Search, Clock, Users } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { SectionHeader } from '@/components/common';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const CAROUSEL_INTERVAL = 6000;
const CAROUSEL_TRANSITION_MS = 350;

type Slide = { kind: 'promo'; id: string; title: string; color: string; badge: string } | { kind: 'service'; id: string; name: string; price: number; image: string; duration: number };

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

  const activeIndex = count > 0 ? ((pos - 1) % count + count) % count : 0;

  const items = useMemo(() => {
    if (count <= 0) return [];
    if (count === 1) return [0];
    return [count - 1, ...Array.from({ length: count }, (_, i) => i), 0];
  }, [count]);

  const applyTransform = useCallback((p: number, dx: number, withTransition: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = withTransition ? `transform ${CAROUSEL_TRANSITION_MS}ms ease` : 'none';
    el.style.transform = `translateX(calc(-${p * 100}% + ${dx}px))`;
  }, []);

  useEffect(() => {
    applyTransform(pos, 0, animate);
  }, [pos, animate, applyTransform, count]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setHoverCapable(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!multi || paused) return;
    const id = setInterval(() => {
      if (dragging.current) return;
      setPos((p) => Math.min(p + 1, count + 1));
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(id);
  }, [multi, paused, pos, count]);

  useEffect(() => {
    setPos(multi ? 1 : 0);
  }, [count, multi]);

  useEffect(() => {
    if (!multi || (pos !== 0 && pos !== count + 1)) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setPos(pos === count + 1 ? 1 : count);
    }, CAROUSEL_TRANSITION_MS + 60);
    return () => clearTimeout(id);
  }, [pos, count, multi]);

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

  const step = (dir: 1 | -1) => setPos((p) => Math.max(0, Math.min(p + dir, count + 1)));

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
  const { currentUser, services, employees, promos } = useAppStore();
  const [selectedAddress, setSelectedAddress] = useState<string>('addr1');
  const customer = currentUser as any;

  const activePromos = useMemo(() => promos.filter((p) => p.isActive), [promos]);

  const slides: Slide[] = useMemo(
    () => [
      ...activePromos.slice(0, 2).map((promo, i) => ({
        kind: 'promo' as const,
        id: `promo-${promo.id}`,
        title: promo.name,
        color: i % 2 === 0 ? 'bg-primary' : 'bg-accent',
        badge: promo.type === 'percentage' ? `${promo.value}%` : `Rp ${formatCurrency(promo.value).replace('Rp ', '')}`,
      })),
      ...services.slice(0, 2).map((service) => ({
        kind: 'service' as const,
        id: `svc-${service.id}`,
        name: service.name,
        price: service.price,
        image: service.image,
        duration: service.duration,
      })),
    ],
    [activePromos, services]
  );

  return (
    <CustomerLayout currentPage="home">
      <div className="pb-8">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-4 shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-serif font-bold">Hai, {customer?.name?.split(' ')[0]}</h2>
              <p className="text-xs opacity-80 mt-1">Siap booking jasa?</p>
            </div>
            <button className="p-2 bg-white/25 hover:bg-white/35 rounded-md transition-colors" aria-label="Notifikasi">
              <Bell size={20} />
            </button>
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2 text-sm bg-white/15 rounded-md px-3 py-2">
            <MapPin size={16} />
            <select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="bg-transparent text-white text-sm flex-1 focus:outline-none"
            >
              {customer?.addresses?.map((addr: any) => (
                <option key={addr.id} value={addr.id} className="text-text-primary">
                  {addr.detail}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              placeholder="Cari layanan..."
              className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-canvas text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Carousel: Promos & Services */}
        {slides.length > 0 && (
          <section className="px-4 mt-2">
            <Carousel
              count={slides.length}
              renderSlide={(i) => {
                const slide = slides[i];
                if (slide.kind === 'promo') {
                  return (
                    <div className={`${slide.color} h-40 rounded-md flex flex-col items-center justify-center text-white shadow-md`}>
                      <span className="text-4xl font-extrabold">{slide.badge}</span>
                      <p className="text-sm font-semibold mt-2">{slide.title}</p>
                    </div>
                  );
                }
                return (
                  <Link href={`/customer/services/${slide.id.replace('svc-', '')}`} draggable={false}>
                    <div className="bg-card rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img src={slide.image} alt={slide.name} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h4 className="font-semibold text-text-primary text-sm">{slide.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-primary font-bold text-sm">{formatCurrency(slide.price)}</span>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock size={12} /> {slide.duration}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }}
            />
          </section>
        )}

        {/* Services Grid */}
        {services.length > 0 && (
          <section className="px-4 mt-6">
            <SectionHeader title="Layanan Tersedia" href="/customer/services" />
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <Link key={service.id} href={`/customer/services/${service.id}`}>
                  <div className="bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border">
                    <div className="flex gap-3 p-3">
                      <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-text-primary text-sm">{service.name}</h4>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{service.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-warning fill-warning" />
                            <span className="text-xs font-semibold text-text-primary">{service.rating}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-bold text-sm">{formatCurrency(service.price)}</p>
                            <p className="text-[10px] text-text-muted">{service.duration}m</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Available Employees */}
        {employees.length > 0 && (
          <section className="px-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary" />
              <h3 className="text-lg font-serif font-semibold text-text-primary">Staff Tersedia</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-card rounded-md overflow-hidden shadow-sm border border-border p-3">
                  <img src={emp.photo || 'https://via.placeholder.com/100'} alt={emp.name} className="w-full h-20 object-cover rounded-md mb-2" />
                  <h4 className="font-semibold text-text-primary text-sm truncate">{emp.name}</h4>
                  <p className="text-xs text-text-secondary">{emp.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-warning fill-warning" />
                    <span className="text-xs font-semibold">{emp.rating}</span>
                    <span className="text-[10px] text-text-muted">({emp.totalJobs})</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}
