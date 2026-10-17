'use client';

import { useState, useMemo } from 'react';
import { Star, Search } from 'lucide-react';
import useAppStore from '@/lib/store';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { Card } from '@/components/common';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ServicesPage() {
  const { services } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <CustomerLayout currentPage="services">
      <div className="pb-8">
        {/* Search with improved design */}
        <div className="bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 text-white px-5 py-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Layanan Kami</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
            <input
              type="text"
              placeholder="Cari layanan..."
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

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <Link key={service.id} href={`/customer/services/${service.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition overflow-hidden">
                <div className="flex gap-3">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{service.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                      </div>
                      <span className="badge badge-primary text-xs flex-shrink-0">{service.category}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-800">{service.rating}</span>
                      </div>
                      <div>
                        <p className="text-primary font-bold">{formatCurrency(service.price)}</p>
                        <p className="text-xs text-gray-600">{service.duration} menit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada layanan ditemukan</p>
          </div>
        )}

        <div className="h-8" />
        </div>
      </div>
    </CustomerLayout>
  );
}
