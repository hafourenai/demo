'use client';

import { useState, useMemo } from 'react';
import { Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ProductsPage() {
  const { nailArtProducts, wishlist, addToWishlist, removeFromWishlist, cart } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(nailArtProducts.map((p) => p.category)));

  const filteredProducts = useMemo(() => {
    return nailArtProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, nailArtProducts]);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CustomerLayout currentPage="products">
      <div className="customer-page space-y-4">
        {/* Header & Cart Shortcut */}
        <div className="bg-gradient-to-r from-accent to-amber-700 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-white/80 flex items-center gap-1.5">
              <Sparkles size={14} /> Nail Art Official Store
            </span>
            <Link
              href="/customer/checkout"
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold transition-colors"
            >
              <ShoppingBag size={14} />
              Keranjang ({totalCartCount})
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold">Katalog Produk Nail Art</h1>
          <p className="text-xs text-white/85 mt-1">
            Koleksi press-on nails handmade, uv gel polish, sticker 3D, dan starter kit lengkap.
          </p>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Cari press-on nails, gel polish, stiker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-text-primary px-3.5 py-2.5 rounded-xl text-xs placeholder:text-text-muted focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-accent text-white shadow-sm'
                : 'bg-white text-text-secondary border border-border hover:bg-canvas-alt'
            }`}
          >
            Semua ({nailArtProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white text-text-secondary border border-border hover:bg-canvas-alt'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const isWish = wishlist.includes(product.id);
            return (
              <Link
                key={product.id}
                href={`/customer/products/${product.id}`}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-square w-full bg-canvas-alt overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-text-muted hover:text-danger transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={16}
                      className={isWish ? 'fill-danger text-danger' : 'text-text-muted'}
                    />
                  </button>

                  {product.isBestSeller && (
                    <span className="absolute top-2 left-2 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Best Seller
                    </span>
                  )}
                  {product.promoPrice && (
                    <span className="absolute bottom-2 left-2 bg-danger text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      Hemat {formatCurrency(product.price - product.promoPrice)}
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-semibold">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-xs leading-snug text-text-primary line-clamp-2 mt-0.5">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-text-secondary mt-1">
                      <Star size={11} className="text-warning fill-warning" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-text-muted">• Stok {product.stock}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      {product.promoPrice ? (
                        <>
                          <span className="text-[10px] text-text-muted line-through block">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="font-bold text-xs text-danger">
                            {formatCurrency(product.promoPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-xs text-text-primary">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-accent hover:underline">
                      Pilih &gt;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-text-primary">Tidak ada produk ditemukan</p>
            <p className="text-xs text-text-secondary mt-1">
              Coba ganti kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
