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
    return <div>Service not found</div>;
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
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <Link
            href="/customer/services"
            className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{service.name}</h1>
            <p className="text-gray-600 text-sm mt-2">{service.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-800">{service.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={18} />
                <span className="text-sm">{service.duration} menit</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <Card>
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Home Service</h4>
                <p className="text-sm text-gray-600">Layanan ini dapat dilakukan di rumah Anda</p>
              </div>
            </div>
          </Card>

          {/* Variations */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Pilih Variasi</h3>
            <div className="space-y-2">
              {service.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation.id)}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${
                    selectedVariation === variation.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{variation.name}</span>
                    <span className="text-primary font-bold">{formatCurrency(variation.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Type */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Pilih Waktu</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBookingType('now')}
                className={`p-3 rounded-lg border-2 transition font-semibold ${
                  bookingType === 'now'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                Pesan Sekarang
              </button>
              <button
                onClick={() => setBookingType('schedule')}
                className={`p-3 rounded-lg border-2 transition font-semibold ${
                  bookingType === 'schedule'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                Jadwalkan
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total Harga:</span>
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
