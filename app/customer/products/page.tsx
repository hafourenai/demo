'use client';

import { useState, useMemo } from 'react';
import { Star, Heart } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card } from '@/components/common';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ProductsPage() {
  const { products, wishlist, addToWishlist, removeFromWishlist } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <CustomerLayout currentPage="products">
      <div className="pb-8">
        {/* Search Header */}
        <div className="relative isolate overflow-hidden bg-primary-dark text-white px-5 py-8 sm:py-12 shadow-md">
          <img
            src="/images/products/prod1.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_55%] opacity-50"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/60 via-primary-dark/20 to-transparent" />
          <h2 className="relative z-10 text-white text-2xl font-serif font-bold mb-4">Produk Kecantikan</h2>
          <div className="relative z-10">
            <input
              type="text"
              placeholder="Cari produk..."
              aria-label="Cari produk"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-md bg-card text-text-primary placeholder-text-muted border border-white focus:outline-none focus:ring-2 focus:ring-white/70 transition-all duration-base"
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-colors duration-base ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-canvas-alt text-text-primary hover:bg-border-primary'
              }`}
              style={{ minHeight: '44px' }}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-colors duration-base ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-canvas-alt text-text-primary hover:bg-border-primary'
                }`}
                style={{ minHeight: '44px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/customer/products/${product.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow duration-base h-full flex flex-col">
                  <div className="relative mb-2 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute top-2 right-2 bg-card rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow duration-base"
                      aria-label="Toggle wishlist"
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      <Heart
                        size={18}
                        className={wishlist.includes(product.id) ? 'fill-primary text-primary' : 'text-text-muted'}
                      />
                    </button>
                    {product.isBestSeller && (
                      <div className="absolute bottom-2 left-2 badge badge-success text-xs">Best Seller</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-serif font-semibold text-text-primary text-sm line-clamp-2">{product.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-warning fill-warning" />
                      <span className="text-xs font-semibold text-text-primary">{product.rating}</span>
                    </div>
                    <div className="mt-auto pt-2">
                      {product.promoPrice ? (
                        <div>
                          <p className="text-primary font-bold text-sm">{formatCurrency(product.promoPrice)}</p>
                          <p className="text-text-muted line-through text-xs">{formatCurrency(product.price)}</p>
                        </div>
                      ) : (
                        <p className="text-primary font-bold text-sm">{formatCurrency(product.price)}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">Tidak ada produk ditemukan</p>
            </div>
          )}

          <div className="h-8" />
        </div>
      </div>
    </CustomerLayout>
  );
}
