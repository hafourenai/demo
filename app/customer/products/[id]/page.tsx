'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency, generateId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { nailArtProducts, wishlist, addToWishlist, removeFromWishlist, addToCart } = useAppStore();

  const product = nailArtProducts.find((p) => p.id === params.id);

  // Variant selection (PRD Section 66: Size, Color, Design)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants?.[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <CustomerLayout currentPage="products">
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">Produk tidak ditemukan</p>
          <Link href="/customer/products" className="text-xs text-primary font-semibold mt-2 inline-block">
            ← Kembali ke Katalog
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const activePrice = selectedVariant?.price || product.promoPrice || product.price;
  const activeStock = selectedVariant?.stock ?? product.stock;
  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = (directCheckout = false) => {
    if (activeStock <= 0) {
      alert('Maaf, stok varian ini sedang habis.');
      return;
    }

    addToCart({
      id: generateId(),
      type: 'product',
      itemId: product.id,
      variantId: selectedVariant?.id,
      quantity,
      price: activePrice,
      productName: product.name,
      variantName: selectedVariant
        ? `${selectedVariant.size ? `Size ${selectedVariant.size}` : ''} ${selectedVariant.color || ''} ${selectedVariant.design || ''}`.trim()
        : undefined,
      image: product.image,
    });

    if (directCheckout) {
      router.push('/customer/checkout');
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <CustomerLayout currentPage="products">
      <div className="customer-page space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/customer/products"
            className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-text-primary shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-xs font-semibold text-text-secondary uppercase">
            {product.category}
          </span>
          <button
            onClick={toggleWishlist}
            className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center shadow-sm"
          >
            <Heart
              size={18}
              className={isInWishlist ? 'fill-danger text-danger' : 'text-text-muted'}
            />
          </button>
        </div>

        {/* Product Photo */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-canvas-alt border border-border shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {product.promoPrice && (
            <span className="absolute bottom-3 left-3 bg-danger text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
              PROMO SPESIAL
            </span>
          )}
        </div>

        {/* Product Title & Pricing */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-snug">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-text-secondary mt-1.5">
              <span className="flex items-center gap-1 font-semibold text-text-primary">
                <Star size={13} className="text-warning fill-warning" />
                {product.rating}
              </span>
              <span>•</span>
              <span className="text-text-muted">SKU: {selectedVariant?.sku || product.sku}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Sisa Stok: {activeStock}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary font-sans">
              {formatCurrency(activePrice)}
            </span>
            {product.promoPrice && !selectedVariant?.price && (
              <span className="text-xs text-text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Variant Selector (PRD Section 66) */}
        {product.variants && product.variants.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Pilih Varian
              </h3>
              <span className="text-xs text-text-muted">
                {selectedVariant?.size ? `Size: ${selectedVariant.size}` : ''}{' '}
                {selectedVariant?.color || selectedVariant?.design || ''}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariant?.id;
                const outOfStock = v.stock <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      setQuantity(1);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                        : 'border-border bg-white hover:border-border-primary'
                    } ${outOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">
                        {v.size ? `Size ${v.size}` : v.color || v.design}
                      </span>
                      {isSelected && <Check size={14} className="text-primary" />}
                    </div>
                    {v.color && v.size && (
                      <span className="text-[10px] text-text-muted block truncate mt-0.5">
                        {v.color}
                      </span>
                    )}
                    <span className="text-[10px] text-primary font-semibold block mt-1">
                      {formatCurrency(v.price)}
                    </span>
                    <span className="text-[9px] text-text-muted block">
                      {outOfStock ? 'Habis' : `Stok: ${v.stock}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="bg-white p-4 rounded-2xl border border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-text-primary">Jumlah Pembelian:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-canvas-alt text-text-primary text-sm font-bold flex items-center justify-center disabled:opacity-40"
            >
              -
            </button>
            <span className="text-sm font-bold text-text-primary w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
              disabled={quantity >= activeStock}
              className="w-8 h-8 rounded-lg bg-canvas-alt text-text-primary text-sm font-bold flex items-center justify-center disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        {/* Description & Guarantee */}
        <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Deskripsi Produk
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-[11px] text-text-secondary">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
              <span>100% Produk Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-primary flex-shrink-0" />
              <span>Pengiriman Aman &amp; Cepat</span>
            </div>
          </div>
        </div>

        {/* Floating Actions */}
        {addedToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
            <Check size={14} className="text-emerald-400" />
            Produk berhasil ditambahkan ke keranjang!
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={() => handleAddToCart(false)}
            disabled={activeStock <= 0}
            className="flex-1 py-3.5 px-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-bold text-xs hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={16} /> + Keranjang
          </button>
          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            disabled={activeStock <= 0}
            className="flex-1 py-3.5 px-4 bg-primary text-white rounded-2xl font-bold text-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            Beli Sekarang ({formatCurrency(activePrice * quantity)})
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
