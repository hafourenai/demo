'use client';

import { useState } from 'react';
import { MapPin, Star, Search, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { SectionHeader } from '@/components/common';
import { ServiceImage } from '@/components/ServiceImage';
import { PromoCarousel } from '@/components/PromoCarousel';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { currentUser, customers, services, employees, promos } = useAppStore();
  const [addressId, setAddressId] = useState('');
  const customer = customers.find(c => c.id === currentUser?.id);
  const addresses = customer?.addresses || [];
  const selected = addresses.find(a => a.id === addressId) || addresses.find(a => a.isDefault) || addresses[0];
  const categories = Array.from(new Set(services.map(s => s.category)));
  const slides = [
    ...promos.filter(p => p.isActive).slice(0, 2).map((promo, i) => <Link key={promo.id} href="/customer/services" draggable={false} className={`home-banner ${i % 2 ? 'home-banner-alt' : ''}`}>
      <div className="relative z-10 max-w-[80%]">
        <p className="text-xs font-semibold tracking-wide mb-3">PILIHAN HEMAT UNTUKMU</p>
        <h2 className="text-3xl sm:text-4xl font-serif leading-tight">{promo.name}</h2>
        <p className="mt-3 text-sm opacity-80">Luangkan waktu untuk merawat diri.</p>
        <span className="inline-flex items-center gap-2 mt-5 text-sm font-semibold">Jelajahi layanan <ArrowRight size={17} /></span>
      </div>
      <span className="banner-discount">{promo.type === 'percentage' ? `${promo.value}%` : formatCurrency(promo.value)}</span>
    </Link>),
    ...services.slice(0, 2).map(service => <Link key={service.id} href={`/customer/services/${service.id}`} draggable={false} className="home-banner home-banner-service">
      <ServiceImage src={service.image} alt="" category={service.category} className="absolute inset-y-0 right-0 w-1/2 h-full object-cover" />
      <div className="relative z-10 w-[55%] pr-4">
        <p className="text-xs font-semibold tracking-wide mb-3">PERAWATAN DI RUMAH</p>
        <h2 className="text-2xl sm:text-3xl font-serif leading-tight">{service.name}</h2>
        <p className="mt-3 font-semibold">{formatCurrency(service.price)}</p>
        <span className="inline-flex items-center gap-2 mt-5 text-sm">Lihat layanan <ArrowRight size={17} /></span>
      </div>
    </Link>)
  ];
  return <CustomerLayout currentPage="home">
    <div className="customer-page space-y-8">
      <header className="home-heading">
        <div><p className="text-sm text-text-secondary mb-1">Hai, {currentUser?.name?.split(' ')[0] || 'selamat datang'}</p><h1 className="text-3xl font-serif">Waktunya untuk dirimu.</h1></div>
        <div className="address-selector"><MapPin size={18} className="shrink-0 text-primary" />{addresses.length ? <select aria-label="Alamat layanan" value={selected?.id || ''} onChange={e => setAddressId(e.target.value)}>{addresses.map(a => <option key={a.id} value={a.id}>{a.detail}</option>)}</select> : <Link href="/customer/account">Tambahkan alamat layanan</Link>}</div>
      </header>
      <form action="/customer/services" className="home-search"><Search size={20} /><input name="q" aria-label="Cari layanan" placeholder="Perawatan apa yang kamu cari?" /><button type="submit">Cari</button></form>
      {slides.length > 0 && <PromoCarousel slides={slides} />}
      <section><SectionHeader title="Mulai dari kebutuhanmu" /><div className="category-grid">{categories.map(category => <Link key={category} href={`/customer/services?category=${encodeURIComponent(category)}`} className="category-link"><span className="font-semibold text-sm">{category}</span><ArrowUpRight size={18} /></Link>)}</div></section>
      <section><SectionHeader title="Layanan untukmu" href="/customer/services" /><div className="service-grid">{services.slice(0, 6).map(service => <Link key={service.id} href={`/customer/services/${service.id}`} className="service-tile"><ServiceImage src={service.image} alt={service.name} category={service.category} className="w-full aspect-[4/3] object-cover" /><div className="p-4 flex flex-col flex-1"><p className="text-xs text-text-secondary mb-2">{service.category}</p><h3 className="text-base font-semibold leading-snug">{service.name}</h3><div className="flex items-center gap-3 text-xs text-text-secondary mt-3"><span className="flex items-center gap-1"><Star size={13} className="text-warning fill-warning" />{service.rating}</span><span className="flex items-center gap-1"><Clock size={13} />{service.duration} menit</span></div><p className="text-primary font-bold mt-auto pt-4">{formatCurrency(service.price)}</p></div></Link>)}</div></section>
      {employees.length > 0 && <section><SectionHeader title="Kenali tim kami" /><div className="staff-grid">{employees.map(emp => <article key={emp.id} className="staff-tile">{emp.photo ? <img src={emp.photo} alt={emp.name} className="w-14 h-14 rounded-full object-cover shrink-0" /> : <span className="profile-avatar small">{emp.name.charAt(0)}</span>}<div className="min-w-0"><h3 className="text-sm font-semibold break-words">{emp.name}</h3><p className="text-xs text-text-secondary mt-1">{emp.role}</p><p className="flex items-center gap-1 text-xs mt-2"><Star size={12} className="text-warning fill-warning" />{emp.rating}<span className="text-text-muted">· {emp.totalJobs} layanan</span></p></div></article>)}</div></section>}
    </div>
  </CustomerLayout>;
}
