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
    return <div>Product not found</div>;
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
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <Link
            href="/customer/products"
            className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </Link>
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <Heart
              size={24}
              className={isInWishlist ? 'fill-primary text-primary' : 'text-gray-400'}
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Title and Rating */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                {product.isBestSeller && (
                  <span className="badge badge-success text-xs mt-2">Best Seller</span>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3">{product.description}</p>
            <div className="flex items-center gap-1 mt-3">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800">{product.rating}</span>
              <span className="text-gray-600 text-sm">({product.reviews?.length || 0} review)</span>
            </div>
          </div>

          {/* Price */}
          <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
            <div className="space-y-2">
              {product.promoPrice ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{formatCurrency(product.promoPrice)}</span>
                    <span className="text-lg text-gray-500 line-through">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="text-xs text-green-600 font-semibold">
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
              <span className="text-gray-600 font-semibold">Stok Tersedia:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-bold">{product.stock} item</span>
              ) : (
                <span className="text-red-600 font-bold">Habis</span>
              )}
            </div>
          </Card>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Jumlah</h3>
              <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Category and Info */}
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <div className="text-xs text-gray-600 font-semibold">Kategori</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">{product.category}</div>
            </Card>
            <Card>
              <div className="text-xs text-gray-600 font-semibold">Kondisi</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">Baru</div>
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
