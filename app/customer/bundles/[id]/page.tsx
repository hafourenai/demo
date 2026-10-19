'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Star, CheckCircle } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function BundleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { bundles, services, products, addToCart } = useAppStore();
  const [quantity, setQuantity] = useState(1);

  const bundle = bundles.find((b) => b.id === params.id);

  if (!bundle) {
    return (
      <CustomerLayout currentPage="products">
        <div className="px-4 py-8 text-center">
          <h1 className="text-xl font-semibold text-text-primary">Bundle tidak ditemukan</h1>
          <Link href="/customer" className="text-primary mt-4 inline-block">
            Kembali ke Home
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const bundleServices = services.filter((s) => bundle.services.includes(s.id));
  const bundleProducts = products.filter((p) => bundle.products.includes(p.id));
  const savings = bundle.normalPrice - bundle.bundlePrice;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `bundle-${bundle.id}-${Date.now()}-${i}`,
        type: 'bundle',
        itemId: bundle.id,
        quantity: 1,
        price: bundle.bundlePrice,
      });
    }
  };

  return (
    <CustomerLayout currentPage="products">
      <div className="pb-8">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-md transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Detail Bundle</h1>
        </div>

        {/* Bundle Image */}
        <div className="relative overflow-hidden bg-canvas">
          <img
            src={bundle.image}
            alt={bundle.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-danger text-white px-3 py-1 rounded-full font-bold text-sm">
            -{bundle.discount}%
          </div>
        </div>

        {/* Bundle Info */}
        <div className="px-4 py-4">
          <h2 className="text-2xl font-serif font-bold text-text-primary">{bundle.name}</h2>
          <p className="text-text-secondary text-sm mt-2">{bundle.description}</p>

          {/* Pricing */}
          <div className="mt-4 p-3 bg-success/10 rounded-md">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-success">
                {formatCurrency(bundle.bundlePrice)}
              </span>
              <span className="text-text-muted line-through text-lg mb-1">
                {formatCurrency(bundle.normalPrice)}
              </span>
            </div>
            <p className="text-success text-sm font-semibold mt-1">
              Hemat {formatCurrency(savings)} ({bundle.discount}%)
            </p>
          </div>

          {/* Quantity */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-text-primary block mb-2">
              Jumlah
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-md border border-border hover:bg-canvas transition-colors"
              >
                −
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-md border border-border hover:bg-canvas transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Tambah ke Keranjang
          </button>
        </div>

        {/* Services in Bundle */}
        {bundleServices.length > 0 && (
          <section className="px-4 mt-8">
            <h3 className="text-lg font-serif font-semibold text-text-primary mb-3">
              Layanan Termasuk ({bundleServices.length})
            </h3>
            <div className="space-y-2">
              {bundleServices.map((service) => (
                <div key={service.id} className="flex items-start gap-2 p-2 bg-canvas rounded-md">
                  <CheckCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm">{service.name}</p>
                    <p className="text-xs text-text-secondary">{service.duration} menit • {formatCurrency(service.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products in Bundle */}
        {bundleProducts.length > 0 && (
          <section className="px-4 mt-8">
            <h3 className="text-lg font-serif font-semibold text-text-primary mb-3">
              Produk Termasuk ({bundleProducts.length})
            </h3>
            <div className="space-y-2">
              {bundleProducts.map((product) => (
                <div key={product.id} className="flex items-start gap-2 p-2 bg-canvas rounded-md">
                  <CheckCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star size={12} className="text-warning fill-warning" />
                      <span className="text-xs text-text-secondary">{product.rating}</span>
                      <span className="text-xs text-text-secondary">• {formatCurrency(product.price)}</span>
                    </div>
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
