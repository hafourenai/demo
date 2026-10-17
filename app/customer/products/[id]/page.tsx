'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Heart, ShoppingCart } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card, Button } from '@/components/common';
import { formatCurrency, generateId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { products, wishlist, addToWishlist, removeFromWishlist, addToCart } = useAppStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <CustomerLayout currentPage="products">
        <div className="text-center py-12">
          <p className="text-text-secondary">Produk tidak ditemukan</p>
        </div>
      </CustomerLayout>
    );
  }

  const isInWishlist = wishlist.includes(product.id);
  const displayPrice = product.promoPrice || product.price;

  const handleAddToCart = () => {
    addToCart({
      id: generateId(),
      type: 'product',
      itemId: product.id,
      quantity: quantity,
      price: displayPrice,
    });

    router.push('/customer/checkout');
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
      <div className="relative">
        {/* Image */}
        <div className="relative h-64 bg-canvas-alt overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <Link
            href="/customer/products"
            className="absolute top-3 left-3 bg-card rounded-md p-2 shadow-md hover:shadow-lg transition-shadow duration-base"
            aria-label="Kembali"
          >
            <ArrowLeft size={24} className="text-text-primary" />
          </Link>
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-card rounded-md p-2 shadow-md hover:shadow-lg transition-shadow duration-base"
            aria-label={isInWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <Heart
              size={24}
              className={isInWishlist ? 'fill-primary text-primary' : 'text-text-muted'}
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Title and Rating */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-serif font-bold text-text-primary">{product.name}</h1>
                {product.isBestSeller && (
                  <span className="badge badge-success text-xs mt-2">Best Seller</span>
                )}
              </div>
            </div>
            <p className="text-text-secondary text-sm mt-3">{product.description}</p>
            <div className="flex items-center gap-1 mt-3">
              <Star size={18} className="text-warning fill-warning" />
              <span className="font-semibold text-text-primary">{product.rating}</span>
              <span className="text-text-secondary text-sm">({product.reviews?.length || 0} review)</span>
            </div>
          </div>

          {/* Price */}
          <Card className="bg-primary/5 border border-primary/20">
            <div className="space-y-2">
              {product.promoPrice ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{formatCurrency(product.promoPrice)}</span>
                    <span className="text-lg text-text-muted line-through">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="text-xs text-success font-semibold">
                    Hemat {formatCurrency(product.price - product.promoPrice)}
                  </div>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
              )}
            </div>
          </Card>

          {/* Stock Info */}
          <Card>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary font-semibold">Stok Tersedia:</span>
              {product.stock > 0 ? (
                <span className="text-success font-bold">{product.stock} item</span>
              ) : (
                <span className="text-danger font-bold">Habis</span>
              )}
            </div>
          </Card>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div>
              <h3 className="font-serif font-semibold text-text-primary mb-3">Jumlah</h3>
              <div className="flex items-center gap-3 bg-canvas-alt p-2 rounded-md w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-card rounded-sm transition-colors duration-base"
                  aria-label="Kurangi jumlah"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-text-primary">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-card rounded-sm transition-colors duration-base"
                  aria-label="Tambah jumlah"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Category and Info */}
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <div className="text-xs text-text-secondary font-semibold">Kategori</div>
              <div className="text-sm font-semibold text-text-primary mt-1">{product.category}</div>
            </Card>
            <Card>
              <div className="text-xs text-text-secondary font-semibold">Kondisi</div>
              <div className="text-sm font-semibold text-text-primary mt-1">Baru</div>
            </Card>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Tambah ke Keranjang
            </Button>
            <Link href="/customer/products" className="w-full">
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
