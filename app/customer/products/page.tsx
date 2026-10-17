'use client';

import { useState, useMemo } from 'react';
import { Star, Search, Heart } from 'lucide-react';
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
        {/* Search with improved design */}
        <div className="bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 text-white px-5 py-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Produk Kecantikan</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/25 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur-sm transition"
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/customer/products/${product.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition h-full flex flex-col">
                <div className="relative mb-2 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:shadow-md transition"
                  >
                    <Heart
                      size={18}
                      className={wishlist.includes(product.id) ? 'fill-primary text-primary' : 'text-gray-400'}
                    />
                  </button>
                  {product.isBestSeller && (
                    <div className="absolute bottom-2 left-2 badge badge-success text-xs">Best Seller</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-gray-800">{product.rating}</span>
                  </div>
                  <div className="mt-auto pt-2">
                    {product.promoPrice ? (
                      <div>
                        <p className="text-primary font-bold text-sm">{formatCurrency(product.promoPrice)}</p>
                        <p className="text-gray-500 line-through text-xs">{formatCurrency(product.price)}</p>
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
            <p className="text-gray-600">Tidak ada produk ditemukan</p>
          </div>
        )}

        <div className="h-8" />
        </div>
      </div>
    </CustomerLayout>
  );
}
