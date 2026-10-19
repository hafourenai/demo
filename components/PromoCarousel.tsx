'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PromoCarousel({ slides }: { slides: ReactNode[] }) {
  const autoplay = useMemo(() => Autoplay({ delay: 5000, playOnInit: false, stopOnInteraction: true, stopOnMouseEnter: true }), []);
  const [ref, api] = useEmblaCarousel({ loop: true, align: 'start' }, [autoplay]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!api) return;
    const select = () => setActive(api.selectedScrollSnap());
    api.on('select', select).on('reInit', select);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { if (motion.matches) autoplay.stop(); };
    if (!motion.matches && slides.length > 1) autoplay.play();
    motion.addEventListener('change', preference);
    return () => {
      api.off('select', select).off('reInit', select);
      motion.removeEventListener('change', preference);
    };
  }, [api, autoplay, slides.length]);
  const go = (index: number) => {
    autoplay.stop();
    api?.scrollTo(index, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };
  return <section aria-label="Pilihan dan promo layanan" aria-roledescription="carousel">
    <div ref={ref} className="overflow-hidden rounded-2xl" onFocusCapture={() => autoplay.stop()}>
      <div className="flex touch-pan-y">
        {slides.map((slide, i) => <div key={i} ref={el => { if (el) el.inert = i !== active; }} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${slides.length}`} className="min-w-0 flex-[0_0_100%]">{slide}</div>)}
      </div>
    </div>
    {slides.length > 1 && <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-1" aria-label="Pilih banner">
        {slides.map((_, i) => <button key={i} onClick={() => go(i)} aria-label={`Banner ${i + 1}`} aria-current={i === active ? 'true' : undefined} className="grid place-items-center min-w-[28px] h-11"><span className={`h-1.5 rounded-full transition-all ${active === i ? 'w-6 bg-primary' : 'w-1.5 bg-text-muted/50'}`} /></button>)}
      </div>
      <div className="flex gap-1">
        <button className="carousel-control" aria-label="Banner sebelumnya" onClick={() => go(active - 1)}><ChevronLeft size={19} /></button>
        <button className="carousel-control" aria-label="Banner berikutnya" onClick={() => go(active + 1)}><ChevronRight size={19} /></button>
      </div>
    </div>}
  </section>;
}
