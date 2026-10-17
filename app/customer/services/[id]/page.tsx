'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button } from '@/components/common';
import { formatCurrency, generateId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { services, addToCart } = useAppStore();
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'now' | 'schedule'>('now');

  const service = services.find((s) => s.id === params.id);

  if (!service) {
    return (
      <CustomerLayout currentPage="services">
        <div className="text-center py-12">
          <p className="text-text-secondary">Layanan tidak ditemukan</p>
        </div>
      </CustomerLayout>
    );
  }

  const selectedVar = service.variations.find((v) => v.id === selectedVariation);
  const price = selectedVar?.price || service.price;

  const handleAddToCart = () => {
    if (!selectedVariation) {
      alert('Pilih variasi terlebih dahulu');
      return;
    }

    addToCart({
      id: generateId(),
      type: 'service',
      itemId: service.id,
      variationId: selectedVariation,
      quantity: 1,
      price: price,
    });

    router.push('/customer/checkout');
  };

  return (
    <CustomerLayout currentPage="services">
      <div className="relative">
        {/* Image */}
        <div className="relative h-48 bg-bg-alt overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <Link
            href="/customer/services"
            className="absolute top-3 left-3 bg-card rounded-md p-2 shadow-md hover:shadow-lg transition-shadow duration-base"
            aria-label="Kembali"
          >
            <ArrowLeft size={24} className="text-text-primary" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl font-serif font-bold text-text-primary">{service.name}</h1>
            <p className="text-text-secondary text-sm mt-2">{service.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star size={18} className="text-warning fill-warning" />
                <span className="font-semibold text-text-primary">{service.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-text-secondary">
                <Clock size={18} />
                <span className="text-sm">{service.duration} menit</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <Card>
            <div className="flex items-start gap-2 text-text-primary">
              <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-text-primary">Home Service</h4>
                <p className="text-sm text-text-secondary">Layanan ini dapat dilakukan di rumah Anda</p>
              </div>
            </div>
          </Card>

          {/* Variations */}
          <div>
            <h3 className="font-serif font-semibold text-text-primary mb-3">Pilih Variasi</h3>
            <div className="space-y-2">
              {service.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation.id)}
                  className={`w-full p-3 rounded-md border-2 transition-all duration-base text-left ${
                    selectedVariation === variation.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-border-primary'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-primary">{variation.name}</span>
                    <span className="text-primary font-bold">{formatCurrency(variation.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Type */}
          <div>
            <h3 className="font-serif font-semibold text-text-primary mb-3">Pilih Waktu</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBookingType('now')}
                className={`p-3 rounded-md border-2 transition-all duration-base font-semibold ${
                  bookingType === 'now'
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-card text-text-primary hover:border-border-primary'
                }`}
                style={{ minHeight: '44px' }}
              >
                Pesan Sekarang
              </button>
              <button
                onClick={() => setBookingType('schedule')}
                className={`p-3 rounded-md border-2 transition-all duration-base font-semibold ${
                  bookingType === 'schedule'
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-card text-text-primary hover:border-border-primary'
                }`}
                style={{ minHeight: '44px' }}
              >
                Jadwalkan
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <Card className="bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">Total Harga:</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(price)}</span>
            </div>
          </Card>

          {/* Buttons */}
          <div className="space-y-3">
            <Button onClick={handleAddToCart} className="w-full">
              Lanjutkan ke Checkout
            </Button>
            <Link href="/customer/services" className="w-full">
              <Button variant="secondary" className="w-full">
                Kembali
              </Button>
            </Link>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </CustomerLayout>
  );
}
